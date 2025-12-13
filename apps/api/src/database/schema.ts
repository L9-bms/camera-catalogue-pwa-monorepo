import { pgTable, varchar, integer } from 'drizzle-orm/pg-core'

export const cameraTable = pgTable('camera', {
    id: varchar('id').primaryKey(),
    name: varchar('name').notNull(),
    brand: varchar('brand').notNull(),
    price: integer('price'),
    megapixels: integer('megapixels'),
    sensor: varchar('sensor'),
    image: varchar('image')
})

export type CameraTable = typeof cameraTable
