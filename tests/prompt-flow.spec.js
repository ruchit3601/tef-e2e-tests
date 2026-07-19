import { test, expect } from '@playwright/test';

test('clicking Get Prompt shows the returned prompt text', async ({ page }) => {
  // Intercept any request to /api/prompt/A and fake the response
  await page.route('**/api/prompt/A', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        prompt: 'Vous parlez avec un ami de vos projets de vacances.',
        section: 'A',
      }),
    });
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Get Prompt' }).click();

  await expect(
    page.getByText('Vous parlez avec un ami de vos projets de vacances.')
  ).toBeVisible();
});