import { treaty } from '@elysiajs/eden'
import type { app } from '@api'

export const api = treaty<app>('http://192.168.0.25:3001')
