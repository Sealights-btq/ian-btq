// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Log environment variables for Sealights before Playwright runs
 */

// console.log('ℹ️ Sealights test config:', {
//   token: process.env.SL_TOKEN ? '***' : 'MISSING',
//   buildSessionId: process.env.SL_BUILD_SESSION_ID || 'MISSING',
//   labId: process.env.SL_LABID || 'MISSING',
//   testStage: process.env.SL_TEST_STAGE || 'Playwright tests',
// });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 60000, // Increased global timeout
  expect: {
    timeout: 10000, // Increased expect timeout
  },

  /* Reporters - only standard Playwright reporters */
  reporter: [
    ['list'], // prints results to console
    ['html'], // generates HTML report
  ],

  use: {
    baseURL: process.env.machine_dns || process.env.MACHINE_DNS || 'http://internal-ian.btq.sealights.co:8081',
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'on',
    actionTimeout: 30000, // Increased action timeout
    navigationTimeout: 30000, // Increased navigation timeout
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
