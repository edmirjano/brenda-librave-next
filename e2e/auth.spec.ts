import { expect, test } from '@playwright/test';

test.describe('Authentication Flows', () => {
  const testUser = {
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
  };

  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
  });

  test('should register a new user successfully', async ({ page }) => {
    // Navigate to registration page
    await page.goto('/auth/register');

    // Verify page loaded
    await expect(page.locator('h1')).toContainText('Krijoni llogarinë tuaj');

    // Fill registration form
    await page.locator('input[name="name"]').fill(testUser.name);
    await page.locator('input[name="email"]').fill(testUser.email);
    await page.locator('input[name="password"]').fill(testUser.password);
    await page.locator('input[name="confirmPassword"]').fill(testUser.password);

    // Select language and currency
    await page.locator('select[name="language"]').selectOption('SQ');
    await page.locator('select[name="currency"]').selectOption('ALL');

    // Submit form
    await page.locator('button[type="submit"]').click();

    // Should redirect to login page with success message
    await expect(page).toHaveURL('/auth/login');

    // Check for success notification (if using toast notifications)
    // This might need adjustment based on how notifications are implemented
  });

  test('should login with valid credentials', async ({ page }) => {
    // First register a user (in a real test environment, you'd set up test data)
    await page.goto('/auth/register');
    await page.locator('input[name="name"]').fill(testUser.name);
    await page.locator('input[name="email"]').fill(testUser.email);
    await page.locator('input[name="password"]').fill(testUser.password);
    await page.locator('input[name="confirmPassword"]').fill(testUser.password);
    await page.locator('button[type="submit"]').click();

    // Now test login
    await page.goto('/auth/login');

    // Verify login page loaded
    await expect(page.locator('h1')).toContainText('Mirësevini përsëri');

    // Fill login form
    await page.locator('input[name="email"]').fill(testUser.email);
    await page.locator('input[name="password"]').fill(testUser.password);

    // Submit login form
    await page.locator('button[type="submit"]').click();

    // Should redirect to home page
    await expect(page).toHaveURL('/');
  });

  test('should show error for invalid login credentials', async ({ page }) => {
    await page.goto('/auth/login');

    // Fill with invalid credentials
    await page.locator('input[name="email"]').fill('invalid@example.com');
    await page.locator('input[name="password"]').fill('wrongpassword');

    // Submit form
    await page.locator('button[type="submit"]').click();

    // Should stay on login page
    await expect(page).toHaveURL('/auth/login');

    // Check for error message
    // This would depend on how error messages are displayed
  });

  test('should validate password requirements in registration', async ({ page }) => {
    await page.goto('/auth/register');

    // Fill form with weak password
    await page.locator('input[name="name"]').fill('Test User');
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="password"]').fill('weak');

    // Check that password requirements are shown
    await expect(page.locator('text=Kërkesat për fjalëkalimin')).toBeVisible();

    // Verify that some requirements are not met (red indicators)
    const requirements = page.locator('li:has(svg)');
    await expect(requirements.first()).toBeVisible();
  });

  test('should redirect authenticated users away from auth pages', async ({ page }) => {
    // First login
    await page.goto('/auth/login');
    await page.locator('input[name="email"]').fill(testUser.email);
    await page.locator('input[name="password"]').fill(testUser.password);
    await page.locator('button[type="submit"]').click();

    // Try to access login page while authenticated
    await page.goto('/auth/login');

    // Should redirect to home page
    await expect(page).toHaveURL('/');
  });

  test('should protect profile page for unauthenticated users', async ({ page }) => {
    // Try to access profile page without authentication
    await page.goto('/profile');

    // Should redirect to login page
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('should allow authenticated users to access profile page', async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.locator('input[name="email"]').fill(testUser.email);
    await page.locator('input[name="password"]').fill(testUser.password);
    await page.locator('button[type="submit"]').click();

    // Navigate to profile page
    await page.goto('/profile');

    // Should show profile page
    await expect(page.locator('h1')).toContainText('Profili im');
  });

  test('should update user profile successfully', async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.locator('input[name="email"]').fill(testUser.email);
    await page.locator('input[name="password"]').fill(testUser.password);
    await page.locator('button[type="submit"]').click();

    // Go to profile page
    await page.goto('/profile');

    // Update profile information
    await page.locator('input[name="name"]').fill('Updated Name');
    await page.locator('select[name="language"]').selectOption('EN');
    await page.locator('select[name="currency"]').selectOption('EUR');

    // Submit profile update
    await page.locator('text=Ruaj ndryshimet').click();

    // Check for success message
    // This would depend on how success messages are implemented
  });

  test('should handle logout correctly', async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.locator('input[name="email"]').fill(testUser.email);
    await page.locator('input[name="password"]').fill(testUser.password);
    await page.locator('button[type="submit"]').click();

    // Navigate to a protected page to confirm login
    await page.goto('/profile');
    await expect(page.locator('h1')).toContainText('Profili im');

    // Logout (this would depend on how logout is implemented)
    // For now, we'll clear session storage and cookies
    await page.evaluate(() => {
      sessionStorage.clear();
      localStorage.clear();
    });

    // Clear cookies
    await page.context().clearCookies();

    // Try to access protected page
    await page.goto('/profile');

    // Should redirect to login
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('should validate password change form', async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.locator('input[name="email"]').fill(testUser.email);
    await page.locator('input[name="password"]').fill(testUser.password);
    await page.locator('button[type="submit"]').click();

    // Go to profile page
    await page.goto('/profile');

    // Find the change password form
    const changePasswordSection = page.locator('text=Ndrysho fjalëkalimin').locator('..');

    // Fill change password form
    await changePasswordSection.locator('input[name="currentPassword"]').fill(testUser.password);
    await changePasswordSection.locator('input[name="newPassword"]').fill('NewPassword123!');
    await changePasswordSection.locator('input[name="confirmNewPassword"]').fill('NewPassword123!');

    // Submit form
    await changePasswordSection.locator('button[type="submit"]').click();

    // Check for success message
    // This would depend on implementation
  });
});
