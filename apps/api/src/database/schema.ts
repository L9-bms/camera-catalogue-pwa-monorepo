import { pgTable, varchar, integer, foreignKey } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const brandTable = pgTable('brand', {
    id: varchar('id').primaryKey(),
    name: varchar('name').notNull().unique()
})

export const sensorTable = pgTable('sensor', {
    id: varchar('id').primaryKey(),
    name: varchar('name').notNull().unique()
})

export const cameraTable = pgTable(
    'camera',
    {
        id: varchar('id').primaryKey(),
        name: varchar('name').notNull(),
        brand_id: varchar('brand_id').notNull(),
        price: integer('price').notNull(),
        megapixels: integer('megapixels').notNull(),
        sensor_id: varchar('sensor_id').notNull(),
        image: varchar('image').notNull()
    },
    (table) => [
        foreignKey({
            columns: [table.brand_id],
            foreignColumns: [brandTable.id]
        }),
        foreignKey({
            columns: [table.sensor_id],
            foreignColumns: [sensorTable.id]
        })
    ]
)

export const cameraRelations = relations(cameraTable, ({ one }) => ({
    brand: one(brandTable, {
        fields: [cameraTable.brand_id],
        references: [brandTable.id]
    }),
    sensor: one(sensorTable, {
        fields: [cameraTable.sensor_id],
        references: [sensorTable.id]
    })
}))

export const brandRelations = relations(brandTable, ({ many }) => ({
    cameras: many(cameraTable)
}))

export const sensorRelations = relations(sensorTable, ({ many }) => ({
    cameras: many(cameraTable)
}))

export type CameraTable = typeof cameraTable
export type BrandTable = typeof brandTable
export type SensorTable = typeof sensorTable
