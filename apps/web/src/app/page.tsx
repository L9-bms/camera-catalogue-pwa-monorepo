import { api } from '@libs'
import { FilterControls } from './filter-controls'

interface LandingProps {
    searchParams: Promise<{
        brand?: string
        sortBy?: string
        sortOrder?: 'asc' | 'desc'
    }>
}

export default async function Landing({ searchParams }: LandingProps) {
    const resolvedParams = await searchParams

    const [allCamerasResponse, filteredCamerasResponse] = await Promise.all([
        api.cameras.get(),
        Object.keys(resolvedParams).length > 0
            ? api.cameras.get({
                  query: resolvedParams as Record<string, unknown>
              })
            : api.cameras.get()
    ])

    const allCameras = allCamerasResponse.data
    const data = filteredCamerasResponse.data

    if (!data || !allCameras) return 'Loading...'

    const brands = Array.from(
        new Set(allCameras.map((camera) => camera.brand))
    ).sort()

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="my-8 font-bold text-4xl">Camera Catalogue</h1>

            <FilterControls
                brands={brands}
                currentBrand={resolvedParams.brand}
                currentSortBy={resolvedParams.sortBy}
                currentSortOrder={resolvedParams.sortOrder}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
                {data.map((camera) => (
                    <div key={camera.id} className="card">
                        <figure>
                            {camera.image ? (
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
                            <p className="text-sm opacity-75">
                                {camera.sensor} · {camera.megapixels} MP
                            </p>

                            <div className="card-actions justify-between items-center">
                                <span className="text-2xl font-bold">
                                    {camera.price
                                        ? `$${camera.price.toLocaleString()}`
                                        : 'Price not available'}
                                </span>
                                <button className="btn btn-primary">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}
