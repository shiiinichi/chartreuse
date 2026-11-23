import { defineConfig, devices } from '@playwright/test';

const port = 5179;

export default defineConfig({
  testDir: 'test/browser',
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',
  fullyParallel: true,
  reporter: 'list',
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' } },
  use: { baseURL: `http://127.0.0.1:${port}`, viewport: { width: 1280, height: 900 } },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } } }],
  webServer: {
    command: `npx vite --host 127.0.0.1 --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}/test/browser/fixture.html`,
    reuseExistingServer: !process.env.CI,
  },
});
