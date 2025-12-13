import Image from "next/image";
import { Search } from "./search";
import Link from "next/link";

export function Navigation() {
    return (
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
            <div className="navbar-start">
                <Image src="/icon-192x192.png" alt="Icon" width={192} height={192} className="btn btn-square" />
            </div>
            <div className="navbar-center">
                <Link href="/" className="btn btn-ghost text-xl">Camera Catalogue</Link>
            </div>
            <div className="navbar-end">
                <Search />
            </div>
        </div>
    );
}