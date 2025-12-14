import { treaty } from '@elysiajs/eden'
import type { app } from '@api'

export const api = treaty<app>(process.env.EDEN_URL ?? 'http://localhost:3001')
