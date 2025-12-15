import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { sql } from 'drizzle-orm'

import { otel, oapi } from '@api/modules'
import { drizzle } from 'drizzle-orm/node-postgres'
import { cameraTable, brandTable, sensorTable } from './database/schema'

const db = drizzle(process.env.DATABASE_URL!)

type FullCameraSelectType = Omit<
    typeof cameraTable.$inferSelect,
    'brand_id' | 'sensor_id'
> & {
    brand: string | null
    sensor: string | null
}

type PartialCameraSelectType = Pick<
    typeof cameraTable.$inferSelect,
    'id' | 'name'
>

export const app = new Elysia()
    .use(oapi)
    .use(otel)
    .use(
        cors({
            origin: '*'
        })
    )
    .get('/', () => 'Hello Elysia')
    .get(
        '/cameras',
        async ({ query }) => {
            // this is solely to meet the requirements of the task, which includes writing SQL

            const selectSql = sql`
                SELECT camera.id, camera.name, brand.name AS brand, sensor.name AS sensor, camera.price, camera.megapixels, camera.image
                FROM camera
                LEFT JOIN brand ON camera.brand_id = brand.id
                LEFT JOIN sensor ON camera.sensor_id = sensor.id
            `

            if (query.brand)
                selectSql.append(sql` WHERE camera.brand_id = ${query.brand}`)
            if (query.sensor)
                selectSql.append(sql` WHERE camera.sensor_id = ${query.sensor}`)

            selectSql.append(
                sql.raw(` ORDER BY camera.${query.sortBy} ${query.sortOrder};`)
            )

            return (await db.execute(selectSql)).rows as FullCameraSelectType[]
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

            return (
                await db.execute(sql`
                    SELECT id, name
                    FROM camera
                    WHERE camera.name ILIKE ${searchPattern}
                        OR camera.brand_id ILIKE ${searchPattern}
                    LIMIT 10;
                `)
            ).rows as PartialCameraSelectType[]
        },
        {
            query: t.Object({
                q: t.String({ minLength: 2 })
            })
        }
    )
    .get('/cameras/brands', async () => {
        return (
            await db.execute(sql`
                SELECT *
                FROM brand
                ORDER BY name
            `)
        ).rows as (typeof brandTable.$inferSelect)[]
    })
    .get('/cameras/sensors', async () => {
        return (
            await db.execute(sql`
                SELECT *
                FROM sensor
                ORDER BY name
            `)
        ).rows as (typeof sensorTable.$inferSelect)[]
    })
    .get(
        '/cameras/:id',
        async ({ params }) => {
            const result = await db.execute(sql`
                SELECT camera.id, camera.name, brand.name AS brand, sensor.name AS sensor, camera.price, camera.megapixels, camera.image
                FROM camera
                LEFT JOIN brand ON camera.brand_id = brand.id
                LEFT JOIN sensor ON camera.sensor_id = sensor.id
                WHERE camera.id = ${params.id}
                LIMIT 1
            `)

            if (result.rows.length === 0) {
                throw new Error('not found')
            }

            return result.rows[0]
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
