import { api } from '@libs'
import Link from 'next/link'
import { FilterControls } from './_components/filter-controls'

interface LandingProps {
    searchParams: Promise<{
        brand?: string
        sensor?: string
        sortBy?: string
        sortOrder?: 'asc' | 'desc'
    }>
}

export default async function Landing({ searchParams }: LandingProps) {
    const resolvedParams = await searchParams

    const camerasResponse = await api.cameras.get({
        query: resolvedParams
    })
    const brandsResponse = await api.cameras.brands.get()
    const sensorsResponse = await api.cameras.sensors.get()

    const data = camerasResponse.data
    const brands = brandsResponse.data
    const sensors = sensorsResponse.data

    if (!data || !brands || !sensors) return 'Loading...'

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="lg:w-64 shrink-0">
                    <FilterControls
                        brands={brands}
                        sensors={sensors}
                        currentBrand={resolvedParams.brand}
                        currentSensor={resolvedParams.sensor}
                        currentSortBy={resolvedParams.sortBy}
                        currentSortOrder={resolvedParams.sortOrder}
                    />
                </aside>

                <div className="flex-1">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {data.map((camera) => (
                            <div key={camera.id} className="card">
                                <figure>
                                    {camera.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={camera.image}
                                            alt={camera.name}
                                            className="h-48 w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-48 w-full bg-base-300 flex items-center justify-center">
                                            <span className="text-base-content/50">
                                                No image
                                            </span>
                                        </div>
                                    )}
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
                                            {camera.price
                                                ? `$${camera.price.toLocaleString()}`
                                                : 'Price not available'}
                                        </span>
                                        <Link
                                            href={`/${camera.id}`}
                                            className="btn btn-primary"
                                        >
                                            View Details
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
