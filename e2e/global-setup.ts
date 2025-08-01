import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // Global setup for all tests
  const browser = await chromium.launch();
  const context = await browser.newContext();
  
  // Set up any global state or configuration here
  // For now, just close the browser
  await browser.close();
}

export default globalSetup;