'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface FilterControlsProps {
    brands: string[]
    currentBrand?: string
    currentSortBy?: string
    currentSortOrder?: 'asc' | 'desc'
}

export function FilterControls({
    brands,
    currentBrand,
    currentSortBy,
    currentSortOrder
}: FilterControlsProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleFilterChange = (
        key: string,
        value: string | undefined
    ) => {
        const params = new URLSearchParams(searchParams.toString())

        if (value && value !== '') {
            params.set(key, value)
        } else {
            params.delete(key)
        }

        router.push(`/?${params.toString()}`)
    }

    return (
        <div className="flex flex-wrap gap-4 items-end mb-6">
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Filter by Brand</span>
                </label>
                <select
                    className="select select-bordered w-full md:w-48"
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
                    <span className="label-text">Sort by</span>
                </label>
                <select
                    className="select select-bordered w-full md:w-48"
                    value={currentSortBy || ''}
                    onChange={(e) =>
                        handleFilterChange('sortBy', e.target.value)
                    }
                >
                    <option value="">No sorting</option>
                    <option value="price">Price</option>
                    <option value="megapixels">Megapixels</option>
                    <option value="name">Name</option>
                    <option value="brand">Brand</option>
                </select>
            </div>

            {currentSortBy && (
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Order</span>
                    </label>
                    <select
                        className="select select-bordered w-full md:w-32"
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
            )}
        </div>
    )
}

