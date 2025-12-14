import { Suspense, type PropsWithChildren } from 'react'
import type { Metadata } from 'next'

import '@web/css/global.css'

import { Navigation } from './_components/navigation'

export const metadata: Metadata = {
    title: 'Camera Catalog',
    description: 'A catalogue of cameras'
}

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <body>
                <Navigation />
                <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </body>
        </html>
    )
}
