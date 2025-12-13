'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@libs'
import Link from 'next/link'

interface CameraSearchResult {
    id: string
    name: string
}

export function Search() {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [results, setResults] = useState<CameraSearchResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
                setSearchQuery('')
                setResults([])
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            inputRef.current?.focus()
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    useEffect(() => {
        const searchCameras = async () => {
            if (searchQuery.trim().length < 2) {
                setResults([])
                return
            }

            setIsLoading(true)
            try {
                const response = await api.cameras.search.get({
                    query: { q: searchQuery.trim() }
                })
                console.log(response.data);
                
                setResults(response.data || [])
            } catch (error) {
                console.error('Search error:', error)
                setResults([])
            } finally {
                setIsLoading(false)
            }
        }

        const debounceTimer = setTimeout(searchCameras, 300)
        return () => clearTimeout(debounceTimer)
    }, [searchQuery])

    const handleResultClick = (cameraId: string) => {
        setIsOpen(false)
        setSearchQuery('')
        router.push(`/${cameraId}`)
    }

    const handleButtonClick = () => {
        setIsOpen(true)
    }

    return (
        <div ref={searchRef} className="relative flex items-center gap-2">
            {isOpen && (
                <div className="form-control">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search cameras..."
                        className="input input-bordered w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            )}
            <button
                className="btn btn-ghost btn-circle"
                onClick={handleButtonClick}
                type="button"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-96 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-4 text-center">
                            <span className="loading loading-spinner loading-md"></span>
                        </div>
                    ) : searchQuery.trim().length < 2 ? (
                        <div className="p-4 text-center text-base-content/60">
                            Type at least 2 characters to search
                        </div>
                    ) : results.length === 0 ? (
                        <div className="p-4 text-center text-base-content/60">
                            No cameras found
                        </div>
                    ) : (
                        <ul className="menu p-2">
                            {results.map((camera) => (
                                <li key={camera.id}>
                                    <Link
                                        href={`/${camera.id}`}
                                        onClick={() => handleResultClick(camera.id)}
                                        className="block p-3 hover:bg-base-200 rounded-lg"
                                    >
                                        <div className="font-semibold truncate">
                                            {camera.name}
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}

