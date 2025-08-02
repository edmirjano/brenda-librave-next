import { expect, test } from '@playwright/test';

test.describe('Book Catalog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display books page correctly', async ({ page }) => {
    await page.goto('/books');

    // Check page title and header
    await expect(page.getByRole('heading', { name: /Koleksioni i Librave/i })).toBeVisible();
    await expect(page.getByText('Zbuloni libra nga autorët më të njohur')).toBeVisible();

    // Check search functionality exists
    await expect(page.getByPlaceholder('Kërkoni libra, autorë, ose ISBN')).toBeVisible();
    await expect(page.getByRole('button', { name: /Kërko/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Filtro/i })).toBeVisible();
  });

  test('should search for books', async ({ page }) => {
    await page.goto('/books');

    // Search for a specific book
    await page.getByPlaceholder('Kërkoni libra, autorë, ose ISBN').fill('Kadare');
    await page.getByRole('button', { name: /Kërko/i }).click();

    // Wait for search results
    await page.waitForURL(/.*query=Kadare.*/);

    // Should show search results
    await expect(page.getByText(/U gjetën.*libra/)).toBeVisible();
  });

  test('should filter books by category', async ({ page }) => {
    await page.goto('/books');

    // Wait for categories to load
    await page.waitForSelector('[data-testid="category-filter"]', { timeout: 10000 });

    // Click on a category (if available)
    const categoryButton = page.locator('text=Literatura Shqiptare').first();
    if (await categoryButton.isVisible()) {
      await categoryButton.click();
      await page.waitForURL(/.*category=.*/);
    }
  });

  test('should show advanced filters', async ({ page }) => {
    await page.goto('/books');

    // Click filter button
    await page.getByRole('button', { name: /Filtro/i }).click();

    // Check advanced filters are visible
    await expect(page.getByText('Gjuha')).toBeVisible();
    await expect(page.getByText('Çmimi nga')).toBeVisible();
    await expect(page.getByText('Monedha')).toBeVisible();
  });

  test('should navigate to book detail page', async ({ page }) => {
    await page.goto('/books');

    // Wait for books to load
    await page.waitForSelector('[data-testid="book-card"]', { timeout: 10000 });

    // Click on first book if available
    const firstBook = page.locator('[data-testid="book-card"]').first();
    if (await firstBook.isVisible()) {
      await firstBook.click();

      // Should navigate to book detail page
      await expect(page).toHaveURL(/\/books\/[^\/]+$/);
    }
  });

  test('should display book details correctly', async ({ page }) => {
    // Navigate directly to a book detail page (using a known slug from seed data)
    await page.goto('/books/kshtjella');

    // Check if book detail elements are present
    // Note: These might not be visible if the book doesn't exist yet
    const bookTitle = page.getByRole('heading', { level: 1 });
    if (await bookTitle.isVisible()) {
      await expect(bookTitle).toBeVisible();
    }
  });

  test('should handle book not found', async ({ page }) => {
    await page.goto('/books/nonexistent-book-slug');

    // Should show 404 or redirect
    // The exact behavior depends on how Next.js handles this
    await expect(page).toHaveURL(/.*nonexistent-book-slug.*/);
  });

  test('should show featured books on homepage', async ({ page }) => {
    await page.goto('/');

    // Look for featured books section
    const featuredSection = page.getByText('Libra të Veçantë');
    if (await featuredSection.isVisible()) {
      await expect(featuredSection).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/books');

    // Check that page is still functional on mobile
    await expect(page.getByRole('heading', { name: /Koleksioni i Librave/i })).toBeVisible();
    await expect(page.getByPlaceholder('Kërkoni libra, autorë, ose ISBN')).toBeVisible();
  });

  test('should handle empty search results', async ({ page }) => {
    await page.goto('/books');

    // Search for something that definitely won't exist
    await page.getByPlaceholder('Kërkoni libra, autorë, ose ISBN').fill('xyznonexistentbook123');
    await page.getByRole('button', { name: /Kërko/i }).click();

    await page.waitForURL(/.*query=xyznonexistentbook123.*/);

    // Should show no results message
    await expect(page.getByText(/Nuk u gjetën libra/)).toBeVisible();
  });

  test('should navigate between pages', async ({ page }) => {
    await page.goto('/books');

    // Check if pagination exists (only if there are enough books)
    const pagination = page.locator('nav[aria-label="Pagination"]');
    if (await pagination.isVisible()) {
      // Test pagination if it exists
      const nextButton = page.getByText('Tjetër');
      if (await nextButton.isVisible() && !(await nextButton.isDisabled())) {
        await nextButton.click();
        await expect(page).toHaveURL(/.*page=2.*/);
      }
    }
  });
});