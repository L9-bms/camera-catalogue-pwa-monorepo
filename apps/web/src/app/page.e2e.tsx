import { test, expect } from '@playwright/test'

test.describe('/', () => {
    test('has <img>', async ({ page }) => {
        await page.goto('/')

        const images = page.locator('img')

        await expect(images).toBeVisible()
    })
})
