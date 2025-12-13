import { Elysia } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi'
import { cors } from '@elysiajs/cors'

import { otel } from '@api/modules'

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
    .get('/cameras', () => {
        interface Camera {
            id: number
            name: string
            brand: string
            price: number
            megapixels: number
            sensor: string
            image: string
        }

        const cameras: Camera[] = [
            {
                id: 1,
                name: 'EOS R5',
                brand: 'Canon',
                price: 3899,
                megapixels: 45,
                sensor: 'Full Frame',
                image: 'https://images.unsplash.com/photo-1606933248051-5ce98adc2db4?w=400&h=400&fit=crop'
            },
            {
                id: 2,
                name: 'Z9',
                brand: 'Nikon',
                price: 5496,
                megapixels: 45.7,
                sensor: 'Full Frame',
                image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop'
            },
            {
                id: 3,
                name: 'Alpha 7R V',
                brand: 'Sony',
                price: 3198,
                megapixels: 61,
                sensor: 'Full Frame',
                image: 'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=400&h=400&fit=crop'
            },
            {
                id: 4,
                name: 'GFX 100 II',
                brand: 'Fujifilm',
                price: 5800,
                megapixels: 102,
                sensor: 'Medium Format',
                image: 'https://images.unsplash.com/photo-1609034227505-5876f6aa4e90?w=400&h=400&fit=crop'
            },
            {
                id: 5,
                name: 'S1R',
                brand: 'Panasonic',
                price: 2498,
                megapixels: 47.3,
                sensor: 'Full Frame',
                image: 'https://images.unsplash.com/photo-1606771563261-38c75010e6c9?w=400&h=400&fit=crop'
            },
            {
                id: 6,
                name: 'K-3 Mark III',
                brand: 'Pentax',
                price: 1529.99,
                megapixels: 25.7,
                sensor: 'APS-C',
                image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop'
            }
        ]

        return cameras
    })
    .listen(Bun.env.PORT ?? 3001)

process.on('beforeExit', app.stop)

export type app = typeof app

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
