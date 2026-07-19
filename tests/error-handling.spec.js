import { test, expect } from '@playwright/test';

test('what happens when the score API fails', async ({ page }) => {
  await page.route('**/api/prompt/A', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ prompt: 'Décrivez votre dernière journée de travail.', section: 'A' }),
    });
  });

  await page.route('**/api/transcribe', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ transcript: 'Une réponse en français.' }),
    });
  });

  // Instead of a success response, make /api/score fail.
  // Use status: 500 and body: JSON.stringify({ error: 'Scoring failed' })
  await page.route('**/api/score', async (route) => {
    // fill this in
    await route.fulfill({
        status:500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'scoring Failed'}),
    });
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Get Prompt' }).click();
  await page.getByRole('button', { name: 'Start Recording' }).click();
  await page.getByRole('button', { name: 'Stop Recording' }).click();
// await page.pause();
  // Don't write expect() yet. Instead, run this with --headed so you can
  // SEE what the browser actually does when scoring fails.
  await expect(page.getByText('Une réponse en français.')).toBeVisible();
await expect(page.getByRole('heading', { name: 'Feedback' })).toBeVisible();
await expect(page.getByText('Grammar: /10')).toBeVisible();
  
});