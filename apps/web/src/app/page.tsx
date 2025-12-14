'use client'

import { api } from '@libs'
import Link from 'next/link'
import { FilterControls } from './_components/filter-controls'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { BrandsData, CamerasData, SensorsData } from '@libs/api/utility'

export default function HomePage() {
    const searchParams = useSearchParams()
    const [camerasResponse, setCamerasResponse] = useState<CamerasData>([])
    const [brandsResponse, setBrandsResponse] = useState<BrandsData>([])
    const [sensorsResponse, setSensorsResponse] = useState<SensorsData>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)

                const queryParams = {
                    brand: searchParams.get('brand') || undefined,
                    sensor: searchParams.get('sensor') || undefined,
                    sortBy:
                        (searchParams.get('sortBy') as
                            | 'price'
                            | 'megapixels'
                            | 'name') || 'name',
                    sortOrder:
                        (searchParams.get('sortOrder') as 'asc' | 'desc') ||
                        'asc'
                }

                const cameras = await api.cameras.get({ query: queryParams })
                const brands = await api.cameras.brands.get()
                const sensors = await api.cameras.sensors.get()

                setCamerasResponse(cameras.data || [])
                setBrandsResponse(brands.data || [])
                setSensorsResponse(sensors.data || [])
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [searchParams])

    // prettier-ignore
    if (error) {
        return <div>
            Error: {error}
        </div>
    }

    if (loading)
        return <div className="container mx-auto px-4 py-8">Loading...</div>

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="lg:w-64 shrink-0">
                    <FilterControls
                        brands={brandsResponse}
                        sensors={sensorsResponse}
                        currentBrand={searchParams.get('brand') || undefined}
                        currentSensor={searchParams.get('sensor') || undefined}
                        currentSortBy={searchParams.get('sortBy') || undefined}
                        currentSortOrder={
                            (searchParams.get('sortOrder') as 'asc' | 'desc') ||
                            undefined
                        }
                    />
                </aside>

                <div className="flex-1">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {camerasResponse.map((camera) => (
                            <div key={camera.id} className="card card-border">
                                <figure>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={camera.image}
                                        alt={camera.name}
                                        className="h-48 w-full object-cover"
                                    />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title">
                                        {camera.name}
                                    </h2>
                                    <p className="text-sm">
                                        {camera.sensor} · {camera.megapixels} MP
                                    </p>

                                    <div className="card-actions justify-between items-center">
                                        <span className="text-2xl font-bold">
                                            ${camera.price.toLocaleString()}
                                        </span>
                                        <Link
                                            href={`/${camera.id}`}
                                            className="btn btn-soft btn-primary"
                                        >
                                            Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}
