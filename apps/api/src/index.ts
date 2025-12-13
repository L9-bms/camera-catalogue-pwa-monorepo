import { Elysia, t } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi'
import { cors } from '@elysiajs/cors'
import { eq, asc, desc, ilike, or, and } from 'drizzle-orm'

import { otel } from '@api/modules'
import { drizzle } from 'drizzle-orm/node-postgres'
import { cameraTable } from './database/schema'

const db = drizzle(process.env.DATABASE_URL!)

export const app = new Elysia()
    .use(
        openapi({
            references: fromTypes(
                process.env.NODE_ENV === 'production'
                    ? 'dist/src/index.d.ts'
                    : 'src/index.ts'
            )
        })
    )
    .use(otel)
    .use(
        cors({
            origin: '*'
        })
    )
    .get(
        '/cameras',
        async ({ query }) => {
            // Build where conditions
            const whereConditions = []

            // Add search condition if provided
            if (query.search) {
                const searchPattern = `%${query.search}%`
                whereConditions.push(
                    or(
                        ilike(cameraTable.name, searchPattern),
                        ilike(cameraTable.brand, searchPattern)
                    )!
                )
            }

            // Add brand filter if provided
            if (query.brand) {
                whereConditions.push(eq(cameraTable.brand, query.brand))
            }

            // Add sensor filter if provided
            if (query.sensor) {
                whereConditions.push(eq(cameraTable.sensor, query.sensor))
            }

            // Combine where conditions
            const whereClause =
                whereConditions.length === 0
                    ? undefined
                    : whereConditions.length === 1
                      ? whereConditions[0]
                      : whereConditions.reduce((acc, condition) =>
                            acc ? and(acc, condition)! : condition
                        )

            // Build order by clause if sortBy is provided
            let orderByClause
            if (query.sortBy) {
                const sortOrder = query.sortOrder === 'desc' ? desc : asc
                if (query.sortBy === 'price') {
                    orderByClause = sortOrder(cameraTable.price)
                } else if (query.sortBy === 'megapixels') {
                    orderByClause = sortOrder(cameraTable.megapixels)
                } else if (query.sortBy === 'name') {
                    orderByClause = sortOrder(cameraTable.name)
                } else if (query.sortBy === 'brand') {
                    orderByClause = sortOrder(cameraTable.brand)
                }
            }

            // Build and execute the query
            if (whereClause && orderByClause) {
                return await db
                    .select()
                    .from(cameraTable)
                    .where(whereClause)
                    .orderBy(orderByClause)
            } else if (whereClause) {
                return await db.select().from(cameraTable).where(whereClause)
            } else if (orderByClause) {
                return await db
                    .select()
                    .from(cameraTable)
                    .orderBy(orderByClause)
            }
            return await db.select().from(cameraTable)
        },
        {
            query: t.Object({
                brand: t.Optional(t.String()),
                sensor: t.Optional(t.String()),
                sortBy: t.Optional(t.String()),
                sortOrder: t.Optional(
                    t.Union([t.Literal('asc'), t.Literal('desc')])
                ),
                search: t.Optional(t.String())
            })
        }
    )
    .get(
        '/cameras/search',
        async ({ query }) => {
            if (!query.q || query.q.trim().length < 2) {
                return []
            }

            const searchPattern = `%${query.q.trim()}%`
            const cameras = await db
                .select({
                    id: cameraTable.id,
                    name: cameraTable.name
                })
                .from(cameraTable)
                .where(
                    or(
                        ilike(cameraTable.name, searchPattern),
                        ilike(cameraTable.brand, searchPattern)
                    )
                )
                .limit(10)

            return cameras
        },
        {
            query: t.Object({
                q: t.String()
            })
        }
    )
    .get('/cameras/brands', async () => {
        const brands = await db
            .selectDistinct({ brand: cameraTable.brand })
            .from(cameraTable)
            .orderBy(cameraTable.brand)

        return brands.map((b) => b.brand)
    })
    .get('/cameras/sensors', async () => {
        const sensors = await db
            .selectDistinct({ sensor: cameraTable.sensor })
            .from(cameraTable)
            .orderBy(cameraTable.sensor)

        return sensors
            .map((s) => s.sensor)
            .filter((sensor): sensor is string => sensor !== null)
    })
    .get(
        '/cameras/:id',
        async ({ params }) => {
            const camera = await db
                .select()
                .from(cameraTable)
                .where(eq(cameraTable.id, params.id))
                .limit(1)

            if (camera.length === 0) {
                throw new Error('Camera not found')
            }

            return camera[0]
        },
        {
            params: t.Object({
                id: t.String()
            })
        }
    )
    .listen(Bun.env.PORT ?? 3001)

process.on('beforeExit', app.stop)

export type app = typeof app

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
