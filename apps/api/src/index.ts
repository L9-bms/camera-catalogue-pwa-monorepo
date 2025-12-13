import { Elysia, t } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi'
import { cors } from '@elysiajs/cors'
import { eq, asc, desc } from 'drizzle-orm'

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
            origin: 'http://localhost:3000'
        })
    )
    .get(
        '/cameras',
        async ({ query }) => {
            // Build query conditionally
            let cameras

            if (query.brand && query.sortBy) {
                const sortOrder = query.sortOrder === 'desc' ? desc : asc

                let orderByClause
                if (query.sortBy === 'price') {
                    orderByClause = sortOrder(cameraTable.price)
                } else if (query.sortBy === 'megapixels') {
                    orderByClause = sortOrder(cameraTable.megapixels)
                } else if (query.sortBy === 'name') {
                    orderByClause = sortOrder(cameraTable.name)
                } else if (query.sortBy === 'brand') {
                    orderByClause = sortOrder(cameraTable.brand)
                } else {
                    cameras = await db
                        .select()
                        .from(cameraTable)
                        .where(eq(cameraTable.brand, query.brand))
                    return cameras
                }

                cameras = await db
                    .select()
                    .from(cameraTable)
                    .where(eq(cameraTable.brand, query.brand))
                    .orderBy(orderByClause)
            } else if (query.brand) {
                cameras = await db
                    .select()
                    .from(cameraTable)
                    .where(eq(cameraTable.brand, query.brand))
            } else if (query.sortBy) {
                const sortOrder = query.sortOrder === 'desc' ? desc : asc

                let orderByClause
                if (query.sortBy === 'price') {
                    orderByClause = sortOrder(cameraTable.price)
                } else if (query.sortBy === 'megapixels') {
                    orderByClause = sortOrder(cameraTable.megapixels)
                } else if (query.sortBy === 'name') {
                    orderByClause = sortOrder(cameraTable.name)
                } else if (query.sortBy === 'brand') {
                    orderByClause = sortOrder(cameraTable.brand)
                } else {
                    cameras = await db.select().from(cameraTable)
                    return cameras
                }

                cameras = await db
                    .select()
                    .from(cameraTable)
                    .orderBy(orderByClause)
            } else {
                cameras = await db.select().from(cameraTable)
            }

            return cameras
        },
        {
            query: t.Object({
                brand: t.Optional(t.String()),
                sortBy: t.Optional(t.String()),
                sortOrder: t.Optional(
                    t.Union([t.Literal('asc'), t.Literal('desc')])
                )
            })
        }
    )
    .listen(Bun.env.PORT ?? 3001)

process.on('beforeExit', app.stop)

export type app = typeof app

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
