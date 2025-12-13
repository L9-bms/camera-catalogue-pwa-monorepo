import Image from 'next/image'
import { Search } from './search'
import Link from 'next/link'

export function Navigation() {
    return (
        <div className="navbar bg-base-200 shadow-sm sticky top-0 z-50">
            <div className="navbar-start">
                <Link href="/">
                    <Image
                        src="/icon-192x192.png"
                        alt="Icon"
                        width={192}
                        height={192}
                        className="btn btn-square"
                    />
                </Link>
            </div>
            <div className="navbar-center">
                <span className="font-bold text-xl">Camera Catalogue</span>
            </div>
            <div className="navbar-end">
                <Search />
            </div>
        </div>
    )
}
