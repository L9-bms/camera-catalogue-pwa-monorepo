import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { eq, ilike, or, and, SQL, sql } from 'drizzle-orm'

import { otel, oapi } from '@api/modules'
import { drizzle } from 'drizzle-orm/node-postgres'
import { cameraTable, brandTable, sensorTable } from './database/schema'

const db = drizzle(process.env.DATABASE_URL!)

export const app = new Elysia()
    .use(oapi)
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
            if (query.brand) filters.push(eq(cameraTable.brand_id, query.brand))
            if (query.sensor)
                filters.push(eq(cameraTable.sensor_id, query.sensor))

            return await db
                .select({
                    id: cameraTable.id,
                    name: cameraTable.name,
                    brand: brandTable.name,
                    sensor: sensorTable.name,
                    price: cameraTable.price,
                    megapixels: cameraTable.megapixels,
                    image: cameraTable.image
                })
                .from(cameraTable)
                .leftJoin(brandTable, eq(cameraTable.brand_id, brandTable.id))
                .leftJoin(
                    sensorTable,
                    eq(cameraTable.sensor_id, sensorTable.id)
                )
                .where(and(...filters))
                // sql injection? who's sql and why are they being injected?
                .orderBy(sql.raw(`"camera".${query.sortBy} ${query.sortOrder}`))
        },
        {
            query: t.Object({
                brand: t.Optional(t.String()),
                sensor: t.Optional(t.String()),
                sortBy: t.Union(
                    [
                        t.Literal('price'),
                        t.Literal('megapixels'),
                        t.Literal('name')
                    ],
                    {
                        default: 'name'
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
                        ilike(cameraTable.brand_id, searchPattern)
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
            .select({ id: brandTable.id, name: brandTable.name })
            .from(brandTable)
            .orderBy(brandTable.name)

        return brands
    })
    .get('/cameras/sensors', async () => {
        const sensors = await db
            .select({ id: sensorTable.id, name: sensorTable.name })
            .from(sensorTable)
            .orderBy(sensorTable.name)

        return sensors
    })
    .get(
        '/cameras/:id',
        async ({ params }) => {
            const camera = await db
                .select({
                    id: cameraTable.id,
                    name: cameraTable.name,
                    brand: brandTable.name,
                    sensor: sensorTable.name,
                    price: cameraTable.price,
                    megapixels: cameraTable.megapixels,
                    image: cameraTable.image
                })
                .from(cameraTable)
                .leftJoin(brandTable, eq(cameraTable.brand_id, brandTable.id))
                .leftJoin(
                    sensorTable,
                    eq(cameraTable.sensor_id, sensorTable.id)
                )
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
