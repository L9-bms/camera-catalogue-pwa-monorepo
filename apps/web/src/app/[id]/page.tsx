import { api } from '@libs'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface CameraDetailProps {
    params: Promise<{
        id: string
    }>
}

export default async function CameraDetail({ params }: CameraDetailProps) {
    const { id } = await params

    const cameraResponse = await api.cameras({ id }).get()

    const data = cameraResponse.data

    if (!data) return notFound()

    const specs = [
        { label: 'Brand', value: data.brand },
        { label: 'Sensor', value: data.sensor || 'Not specified' },
        { label: 'Megapixels', value: data.megapixels ? `${data.megapixels} MP` : 'Not specified' },
        { label: 'Price', value: data.price ? `$${data.price.toLocaleString()}` : 'Not available' }
    ]

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="hero min-h-[60vh] bg-base-200">
                <div className="hero-content flex-col lg:flex-row gap-8 max-w-6xl">
                    <div className="flex-1">
                        {data.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={data.image}
                                alt={data.name}
                                className="max-w-lg w-full rounded-lg shadow-2xl"
                            />
                        ) : (
                            <div className="max-w-lg w-full h-96 bg-base-300 rounded-lg shadow-2xl flex items-center justify-center">
                                <span className="text-base-content/50 text-xl">
                                    No image available
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold mb-8">{data.name}</h1>
                        {data.price && (
                            <div className="text-2xl">
                                ${data.price.toLocaleString()}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Specs Section */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold mb-8">Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {specs.map((spec) => (
                        <div key={spec.label} className="card bg-base-100 shadow">
                            <div className="card-body">
                                <h3 className="card-title text-lg">{spec.label}</h3>
                                <p className="text-base-content/70">{spec.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

