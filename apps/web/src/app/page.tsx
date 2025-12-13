import { api } from '@libs'

export default async function Landing() {
    const { data } = await api.cameras.get()

    if (!data) return 'Loading...'

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="my-8 font-bold text-4xl">Camera Catalogue</h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.map((camera) => (
                    <div key={camera.id} className="card">
                        <figure>
                            <img
                                src={camera.image}
                                alt={camera.name}
                                className="h-48 w-full object-cover"
                            />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title">
                                {camera.brand} {camera.name}
                            </h2>
                            <p className="text-sm opacity-75">
                                {camera.sensor} · {camera.megapixels} MP
                            </p>

                            <div className="card-actions justify-between items-center">
                                <span className="text-2xl font-bold">
                                    ${camera.price.toLocaleString()}
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
