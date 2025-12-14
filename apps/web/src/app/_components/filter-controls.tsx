'use client'

import type { BrandsData, SensorsData } from '@libs/api/utility'
import { useRouter, useSearchParams } from 'next/navigation'

interface FilterControlsProps {
    brands: BrandsData | null
    sensors: SensorsData | null
    currentBrand?: string
    currentSensor?: string
    currentSortBy?: string
    currentSortOrder?: 'asc' | 'desc'
}

export function FilterControls({
    brands,
    sensors,
    currentBrand,
    currentSensor,
    currentSortBy,
    currentSortOrder
}: FilterControlsProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const updateParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())

        if (value && value !== '') {
            params.set(key, value)
        } else {
            params.delete(key)
        }

        router.push(`/?${params.toString()}`)
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold mb-2">Sort</h2>
                <div className="form-control">
                    <label className="label" htmlFor="sortBy">
                        <span className="label-text">Sort by</span>
                    </label>
                    <select
                        id="sortBy"
                        className="select select-bordered w-full"
                        value={currentSortBy || 'name'}
                        onChange={(e) => updateParams('sortBy', e.target.value)}
                    >
                        <option value="price">Price</option>
                        <option value="megapixels">Megapixels</option>
                        <option value="name">Name</option>
                    </select>
                </div>
                <div className="form-control">
                    <label className="label" htmlFor="sortOrder">
                        <span className="label-text">Order</span>
                    </label>
                    <select
                        id="sortOrder"
                        className="select select-bordered w-full"
                        value={currentSortOrder || 'asc'}
                        onChange={(e) =>
                            updateParams(
                                'sortOrder',
                                e.target.value as 'asc' | 'desc'
                            )
                        }
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
            </div>
            <div className="divider"></div>
            <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold mb-2">Filter</h2>
                <div className="form-control">
                    <label className="label" htmlFor="brand">
                        <span className="label-text">Brand</span>
                    </label>

                    <select
                        id="brand"
                        className="select select-bordered w-full"
                        value={currentBrand || ''}
                        onChange={(e) => updateParams('brand', e.target.value)}
                        disabled={!brands}
                    >
                        <option value="">All</option>
                        {brands &&
                            brands.map((brand) => (
                                <option key={brand.id} value={brand.id}>
                                    {brand.name}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="form-control">
                    <label className="label" htmlFor="sensor">
                        <span className="label-text">Sensor Type</span>
                    </label>
                    <select
                        id="sensor"
                        className="select select-bordered w-full"
                        value={currentSensor || ''}
                        onChange={(e) => updateParams('sensor', e.target.value)}
                        disabled={!sensors}
                    >
                        <option value="">All</option>
                        {sensors &&
                            sensors.map((sensor) => (
                                <option key={sensor.id} value={sensor.id}>
                                    {sensor.name}
                                </option>
                            ))}
                    </select>
                </div>
            </div>
        </div>
    )
}
