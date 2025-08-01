import { expect, test } from '@playwright/test';

test.describe('Health Check and Basic Navigation', () => {
  test('health check endpoint returns correct response', async ({ request }) => {
    const response = await request.get('/api/health');

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.status).toBe('healthy');
    expect(data.service).toBe('brenda-librave');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('uptime');
    expect(data).toHaveProperty('memory');
  });

  test('homepage loads correctly with Albanian content', async ({ page }) => {
    await page.goto('/');

    // Check for Albanian welcome message
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Mirë se vini në Brënda Librave'
    );

    // Check for key features
    await expect(page.getByText('Zbuloni literaturën shqiptare dhe ndërkombëtare')).toBeVisible();
    await expect(page.getByText('Çmime në Lek Shqiptarë dhe Euro')).toBeVisible();
    await expect(page.getByText('Përvojë mobile-first me dizajn modern')).toBeVisible();

    // Check application status
    await expect(page.getByText('Aplikacioni është i gatshëm për zhvillim')).toBeVisible();
  });

  test('health check link works from homepage', async ({ page }) => {
    await page.goto('/');

    // Click the health check link
    const healthCheckLink = page.getByRole('link', { name: /Shiko Health Check/i });
    await expect(healthCheckLink).toBeVisible();

    // Click and verify it navigates to health endpoint
    const responsePromise = page.waitForResponse('/api/health');
    await healthCheckLink.click();
    const response = await responsePromise;

    expect(response.status()).toBe(200);
  });

  test('page has proper meta tags for SEO', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/Brënda Librave/);

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute(
      'content',
      expect.stringContaining('libra shqiptarë')
    );

    // Check language attribute
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'sq');
  });

  test('page is responsive and mobile-friendly', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Check that content is still accessible on mobile
    await expect(
      page.getByText('Libraria juaj shqiptare online për libra fizikë dhe dixhitalë')
    ).toBeVisible();
  });

  test('page has proper accessibility features', async ({ page }) => {
    await page.goto('/');

    // Check heading hierarchy
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();

    // Check that main content is properly marked
    const main = page.getByRole('main');
    await expect(main).toBeVisible();

    // Check that links have proper attributes
    const healthCheckLink = page.getByRole('link', { name: /Shiko Health Check/i });
    await expect(healthCheckLink).toHaveAttribute('href', '/api/health');
  });

  test('page loads quickly and meets performance standards', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Page should load within 5 seconds (reasonable for development with all features)
    expect(loadTime).toBeLessThan(5000);

    // Check that critical content is visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('security headers are properly set', async ({ request }) => {
    const response = await request.get('/');

    // Check for security headers
    const headers = response.headers();
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-xss-protection']).toBe('1; mode=block');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  });
});
