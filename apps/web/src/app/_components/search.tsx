'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDebounceCallback } from 'usehooks-ts'
import { api } from '@libs'
import Link from 'next/link'

// idk how to infer the type of query result from eden treaty
// i could do that kind of thing in tRPC, can't find it for elysia
interface CameraSearchResult {
    id: string
    name: string
}

export function Search() {
    const [searchQuery, setSearchQuery] = useState('')
    const [results, setResults] = useState<CameraSearchResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const inputRef = useRef<HTMLDetailsElement>(null)
    const router = useRouter()

    const closeSearch = useCallback(() => {
        if (inputRef.current) {
            inputRef.current.open = false
        }
        setSearchQuery('')
        setResults([])
    }, [])

    const performSearch = useDebounceCallback(async (query: string) => {
        if (query.trim().length < 2) {
            setResults([])
            return
        }

        setIsLoading(true)
        const response = await api.cameras.search.get({
            query: { q: query.trim() }
        })
        setResults(response.data || [])
        setIsLoading(false)
    }, 100)

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const query = e.target.value
            setSearchQuery(query)
            performSearch(query)
        },
        [performSearch]
    )

    const handleClick = useCallback(
        (cameraId: string) => {
            closeSearch()
            router.push(`/${cameraId}`)
        },
        [router, closeSearch]
    )

    return (
        <details ref={inputRef} className="dropdown dropdown-end">
            <summary className="btn btn-ghost btn-circle m-1">
                {/* prettier-ignore */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </summary>
            <div className="dropdown-content menu bg-base-100 rounded-box z-1 w-96 shadow-lg overflow-y-auto">
                <div className="form-control p-4">
                    <input
                        type="text"
                        placeholder="Search cameras..."
                        className="input input-bordered w-full"
                        value={searchQuery}
                        onChange={handleChange}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                    />
                </div>
                {isLoading ? (
                    <div className="p-4 text-center">
                        <span className="loading loading-spinner loading-md"></span>
                    </div>
                ) : searchQuery.trim().length < 2 ? (
                    <div className="p-4 text-center">
                        Type at least 2 characters to search
                    </div>
                ) : results.length == 0 ? (
                    <div className="p-4 text-center">No cameras found</div>
                ) : (
                    <ul className="menu p-2 w-full">
                        {results.map((camera) => (
                            <li key={camera.id}>
                                <Link
                                    href={`/${camera.id}`}
                                    onClick={() => handleClick(camera.id)}
                                >
                                    {camera.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </details>
    )
}
