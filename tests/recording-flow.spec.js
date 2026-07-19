import { test, expect } from '@playwright/test';

test('recording flow shows transcript and score feedback', async ({ page }) => {
  // Mock 1: the prompt call (same as before)
  await page.route('**/api/prompt/A', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ prompt: 'Décrivez votre dernière journée de travail.', section: 'A' }),
    });
  });

  // Mock 2: /api/transcribe — write this route.fulfill(), using { transcript: "..." }
  await page.route('**/api/transcribe', async (route) =>{
    await route.fulfill({
        status:200,
        contentType: 'application/json',
        body: JSON.stringify({ transcript: "Hier ist mein Text." })
    });
  });

  // Mock 3: /api/score — write this route.fulfill(), using the 5-key shape above
  await page.route('**/api/score', async (route) => {
    await route.fulfill({
        status:200,
        contentType: 'application/json',
        body: JSON.stringify({
            grammarScore: 6,
            vocabScore: 7,
            taskAdequacyScore: 7,
            corrections: ["string", "string"],
            overallFeedback: "Good job!",
        }),
    });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Get Prompt' }).click();
  await page.getByRole('button', { name: 'Start Recording' }).click();
  await expect(page.getByRole('button', { name: 'Stop Recording' })).toBeVisible();
  await page.getByRole('button', { name: 'Stop Recording' }).click();

  // YOU write 2-3 expect() checks here confirming the transcript text
  // and at least one score line (e.g. "Grammar: 7/10") appear on the page.
  await expect(page.getByText('Hier ist mein Text.')).toBeVisible();
  await expect(page.getByText(/Grammar.*6/)).toBeVisible();
});