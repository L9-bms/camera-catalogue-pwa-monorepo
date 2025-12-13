import { describe, it, expect } from 'bun:test'

import { app } from '@api'

describe('core', () => {
    it('works', async () => {
        const response = await app
            .handle(new Request('http://localhost:3000'))
            .then((x) => x.text())

        expect(response).toBe('Hello Elysia')
    })
})
