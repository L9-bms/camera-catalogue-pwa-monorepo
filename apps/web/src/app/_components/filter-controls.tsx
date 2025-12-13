'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface FilterControlsProps {
    brands: string[]
    sensors: string[]
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

    const handleFilterChange = (key: string, value: string | undefined) => {
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
                    <label className="label">
                        <span className="label-text">Sort by</span>
                    </label>
                    <select
                        className="select select-bordered w-full"
                        value={currentSortBy || 'name'}
                        onChange={(e) =>
                            handleFilterChange('sortBy', e.target.value)
                        }
                    >
                        <option value="brand">Brand</option>
                        <option value="price">Price</option>
                        <option value="megapixels">Megapixels</option>
                        <option value="name">Name</option>
                    </select>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Order</span>
                    </label>
                    <select
                        className="select select-bordered w-full"
                        value={currentSortOrder || 'asc'}
                        onChange={(e) =>
                            handleFilterChange(
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
                    <label className="label">
                        <span className="label-text">Brand</span>
                    </label>

                    <select
                        className="select select-bordered w-full"
                        value={currentBrand || ''}
                        onChange={(e) =>
                            handleFilterChange('brand', e.target.value)
                        }
                    >
                        <option value="">All Brands</option>
                        {brands.map((brand) => (
                            <option key={brand} value={brand}>
                                {brand}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Sensor Type</span>
                    </label>
                    <select
                        className="select select-bordered w-full"
                        value={currentSensor || ''}
                        onChange={(e) =>
                            handleFilterChange('sensor', e.target.value)
                        }
                    >
                        <option value="">All Sensor Types</option>
                        {sensors.map((sensor) => (
                            <option key={sensor} value={sensor}>
                                {sensor}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}
