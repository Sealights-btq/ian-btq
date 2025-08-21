// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  /* Reporters */
  reporter: [
    ['list'], // prints results to console
    ['html'], // keep HTML report
    ['sealights-playwright-plugin', {
      token: process.env.SL_TOKEN,
      labId: process.env.SL_LABID,
      testStage: process.env.SL_TEST_STAGE || 'Playwright tests'
    }]
  ],

  use: {
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'on'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
