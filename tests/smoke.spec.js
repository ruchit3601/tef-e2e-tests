import { test, expect } from '@playwright/test';

test('the app loads and shows the heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'TEF Speaking Practice' })).toBeVisible();
});