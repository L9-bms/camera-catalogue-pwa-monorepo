'use client'

import { api } from '@libs'
import { CamerasData } from '@libs/api/utility'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CameraPage() {
    const params = useParams()
    const [data, setData] = useState<CamerasData[number] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCamera = async () => {
            try {
                setLoading(true)
                setError(null)

                const id = params.id as string
                const camera = await api.cameras({ id }).get()

                setData(camera.data || null)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error')
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchCamera()
        }
    }, [params.id])

    if (error) {
        return <div>Error: {error}</div>
    }

    if (loading || !data)
        return <div className="container mx-auto px-4 py-8">Loading...</div>

    const specs = [
        { label: 'Brand', value: data.brand },
        { label: 'Sensor', value: data.sensor },
        {
            label: 'Megapixels',
            value: `${data.megapixels} MP`
        },
        {
            label: 'Price',
            value: `$${data.price.toLocaleString()}`
        }
    ]

    return (
        <div className="min-h-screen">
            <div className="hero py-8 bg-base-300">
                <div className="hero-content flex-col lg:flex-row gap-12 max-w-6xl">
                    <div className="flex-1">
                        {data.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={data.image}
                                alt={data.name}
                                className="max-w-lg w-full rounded-lg"
                            />
                        ) : (
                            <div className="max-w-lg w-full h-96 bg-base-300 rounded-lg flex items-center justify-center">
                                <span className="text-base-content/50 text-xl">
                                    No image available
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold mb-4">{data.name}</h1>
                        {data.price && (
                            <div className="text-2xl">
                                ${data.price.toLocaleString()}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold mb-8">
                    Technical Specifications
                </h2>
                <div className="overflow-x-auto">
                    <table className="table table-bordered">
                        <tbody>
                            {specs.map((spec) => (
                                <tr key={spec.label}>
                                    <th>{spec.label}</th>
                                    <td>{spec.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
