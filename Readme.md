# TEF Coach E2E Test Suite

Playwright end-to-end tests for the [TEF Speaking Practice Coach](https://github.com/ruchit3601/tef-speaking-coach) app.

## What this covers
- **Prompt flow**: selecting an exam section and getting a prompt
- **Recording flow**: starting/stopping a recording, and the resulting transcript + AI-scored feedback rendering correctly
- **One documented bug**: the app doesn't check `response.ok` before using the `/api/score` response, so a failed scoring call still renders a "Feedback" block with blank/undefined scores instead of an error state

## Why the tests are built this way

**Network mocking (`page.route`)**
The app calls Groq's Whisper (transcription) and Llama (scoring) APIs. These tests intercept those network calls and return fixed fake responses, so the suite:
- doesn't need a real `GROQ_API_KEY`
- doesn't depend on real audio being transcribed or real AI judgment
- runs the same way every time, instead of depending on live third-party services

This means these tests prove the **frontend correctly handles a given API response shape** — they don't prove transcription accuracy or scoring quality, which is a separate concern outside this suite's scope.

**Fake media device**
The app calls `getUserMedia()` to record audio. Chromium is launched with `--use-fake-device-for-media-stream` and `--use-fake-ui-for-media-stream` (see `playwright.config.js`), so recording can start/stop in a headless CI environment without real microphone hardware or a permission prompt.

**Role/text locators, not test IDs**
The app has no `data-testid` attributes, so tests use `getByRole` and `getByText` to find elements — matching how you'd have to test a codebase you didn't build with testing in mind, which is closer to real QA work.

## Running locally
```bash
# Terminal 1 — run the app
git clone https://github.com/ruchit3601/tef-speaking-coach.git
cd tef-speaking-coach/client
npm install
npm run dev

# Terminal 2 — run the tests
cd tef-e2e-tests
npm install
npx playwright install chromium
npx playwright test
```

View the HTML report after a run:
```bash
npx playwright show-report
```

## CI
`.github/workflows/playwright.yml` runs on every push to `main`: checks out this repo and the app repo separately, builds and serves the app, installs Playwright, waits for the app to be reachable, then runs the full suite and uploads the HTML report as an artifact.

## Known limitations
- Real speech-to-text accuracy and AI scoring quality are not tested here — that's a model-evaluation problem, not a UI-contract problem, and out of scope