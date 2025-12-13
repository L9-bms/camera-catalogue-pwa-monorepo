import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import Layout from './layout'

describe('/ [Layout]', () => {
    it('works', () => {
        expect(() => render(<Layout />)).not.toThrow()
    })
})
