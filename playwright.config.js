import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  use: {
    baseURL: 'http://localhost:5173',
  },

  projects: [
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      launchOptions: {
        args: [
          '--use-fake-device-for-media-stream',
          '--use-fake-ui-for-media-stream',
        ],
      },
      permissions: ['microphone'],
    },
  },
],
});