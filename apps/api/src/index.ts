import { Elysia, t } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi'
import { cors } from '@elysiajs/cors'
import { eq, ilike, or, and, SQL, sql } from 'drizzle-orm'

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
            const filters: SQL[] = []
            if (query.brand) filters.push(eq(cameraTable.brand, query.brand))
            if (query.sensor) filters.push(eq(cameraTable.sensor, query.sensor))

            return await db
                .select()
                .from(cameraTable)
                .where(and(...filters))
                // sql injection? who's sql and why are they being injected?
                .orderBy(sql.raw(`${query.sortBy} ${query.sortOrder}`))
        },
        {
            query: t.Object({
                brand: t.Optional(t.String()),
                sensor: t.Optional(t.String()),
                sortBy: t.Union(
                    [
                        t.Literal('price'),
                        t.Literal('megapixels'),
                        t.Literal('name'),
                        t.Literal('brand')
                    ],
                    {
                        default: 'brand'
                    }
                ),
                sortOrder: t.Union([t.Literal('asc'), t.Literal('desc')], {
                    default: 'asc'
                })
            })
        }
    )
    .get(
        '/cameras/search',
        async ({ query }) => {
            const searchPattern = `%${query.q.trim()}%`

            return await db
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
        },
        {
            query: t.Object({
                q: t.String({ minLength: 2 })
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
                throw new Error('not found')
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
