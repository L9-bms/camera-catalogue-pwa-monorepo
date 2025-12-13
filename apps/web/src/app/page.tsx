import { api } from '@libs'

export default async function Landing() {
    const { data } = await api.get()

    return (
        <main className="flex flex-col gap-4 justify-center items-center w-full min-h-dvh">
            <h1 className="text-2xl">{data}</h1>
        </main>
    )
}
