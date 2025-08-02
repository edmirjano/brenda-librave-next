import { expect, test } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test('should navigate between main pages', async ({ page }) => {
    await page.goto('/');

    // Test navigation to books page
    await page.getByRole('link', { name: /Libra/i }).click();
    await expect(page).toHaveURL('/books');
    await expect(page.getByRole('heading', { name: /Koleksioni i Librave/i })).toBeVisible();

    // Test navigation to about page
    await page.getByRole('link', { name: /Rreth Nesh/i }).click();
    await expect(page).toHaveURL('/about');
    await expect(page.getByRole('heading', { name: /Rreth Nesh/i })).toBeVisible();

    // Test navigation to contact page
    await page.getByRole('link', { name: /Kontakti/i }).click();
    await expect(page).toHaveURL('/contact');
    await expect(page.getByRole('heading', { name: /Na Kontaktoni/i })).toBeVisible();

    // Test navigation to forum page
    await page.getByRole('link', { name: /Forumi/i }).click();
    await expect(page).toHaveURL('/forum');
    await expect(page.getByRole('heading', { name: /Forum i Lexuesve/i })).toBeVisible();

    // Test navigation to gift page
    await page.getByRole('link', { name: /Dhuro një Libër/i }).click();
    await expect(page).toHaveURL('/gift');
    await expect(page.getByRole('heading', { name: /Dhuroni një Libër/i })).toBeVisible();
  });

  test('should show mobile navigation menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Mobile menu button should be visible
    const menuButton = page.getByRole('button').filter({ hasText: /menu/i }).or(page.locator('button').filter({ has: page.locator('svg') })).first();
    
    // Click menu button if it exists (mobile view)
    if (await menuButton.isVisible()) {
      await menuButton.click();

      // Check if mobile menu items are visible
      await expect(page.getByRole('link', { name: /Kryefaqja/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Libra/i })).toBeVisible();
    }
  });

  test('should show authentication links when not logged in', async ({ page }) => {
    await page.goto('/');

    // Should show login and register links
    await expect(page.getByRole('link', { name: /Hyr/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Regjistrohu/i })).toBeVisible();
  });

  test('should redirect /shop to /books', async ({ page }) => {
    await page.goto('/shop');

    // Should redirect to books page
    await expect(page).toHaveURL('/books');
    await expect(page.getByRole('heading', { name: /Koleksioni i Librave/i })).toBeVisible();
  });

  test('should handle 404 pages gracefully', async ({ page }) => {
    await page.goto('/nonexistent-page');

    // Should show some kind of error or redirect
    // The exact behavior depends on Next.js configuration
    await expect(page).toHaveURL(/.*nonexistent-page.*/);
  });

  test('should maintain navigation state across page loads', async ({ page }) => {
    await page.goto('/');

    // Navigate to books
    await page.getByRole('link', { name: /Libra/i }).click();
    await expect(page).toHaveURL('/books');

    // Refresh page
    await page.reload();

    // Should still be on books page
    await expect(page).toHaveURL('/books');
    await expect(page.getByRole('heading', { name: /Koleksioni i Librave/i })).toBeVisible();
  });

  test('should show brand logo and link to homepage', async ({ page }) => {
    await page.goto('/books');

    // Click on brand logo/name
    await page.getByRole('link', { name: /Brënda Librave/i }).click();

    // Should navigate to homepage
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: /Zbuloni botën e librave shqiptarë/i })).toBeVisible();
  });

  test('should handle navigation with keyboard', async ({ page }) => {
    await page.goto('/');

    // Tab through navigation links
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should be able to navigate with Enter key
    await page.keyboard.press('Enter');

    // Should navigate somewhere (exact destination depends on tab order)
    await expect(page).not.toHaveURL('/');
  });
});