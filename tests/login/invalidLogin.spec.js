// tests/login/invalidLogin.spec.js
import { test, expect } from '../fixtures.js';

const BASE_URL = 'https://opensource-demo.orangehrmlive.com';

test.describe('Login — Invalid Credentials', () => {

  test('TC_LOGIN_006 — Wrong password shows error message', async ({ page }) => {
    await page.goto(`${BASE_URL}/web/index.php/auth/login`);
    await page.fill('input[name="username"]', 'Admin');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('.oxd-alert-content-text')).toContainText('Invalid credentials');
  });

  test('TC_LOGIN_007 — Wrong username shows error message', async ({ page }) => {
    await page.goto(`${BASE_URL}/web/index.php/auth/login`);
    await page.fill('input[name="username"]', 'FakeUser123');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    await expect(page.locator('.oxd-alert-content-text')).toContainText('Invalid credentials');
  });

  test('TC_LOGIN_008 — Empty username shows required validation', async ({ page }) => {
    await page.goto(`${BASE_URL}/web/index.php/auth/login`);
    await page.fill('input[name="username"]', '');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    await expect(page.locator('.oxd-input-field-error-message').first()).toContainText('Required');
  });

  test('TC_LOGIN_009 — Empty password shows required validation', async ({ page }) => {
    await page.goto(`${BASE_URL}/web/index.php/auth/login`);
    await page.fill('input[name="username"]', 'Admin');
    await page.fill('input[name="password"]', '');
    await page.click('button[type="submit"]');

    await expect(page.locator('.oxd-input-field-error-message').first()).toContainText('Required');
  });

  test('TC_LOGIN_010 — Both fields empty shows validation errors', async ({ page }) => {
    await page.goto(`${BASE_URL}/web/index.php/auth/login`);
    await page.click('button[type="submit"]');

    const errors = page.locator('.oxd-input-field-error-message');
    await expect(errors).toHaveCount(2);
  });

  test('TC_LOGIN_011 — SQL injection in username does not crash app', async ({ page }) => {
    await page.goto(`${BASE_URL}/web/index.php/auth/login`);
    await page.fill('input[name="username"]', "' OR 1=1 --");
    await page.fill('input[name="password"]', "' OR 1=1 --");
    await page.click('button[type="submit"]');

    // Should NOT navigate to dashboard
    await expect(page).not.toHaveURL(/dashboard/);
    await expect(page.locator('.oxd-alert-content-text')).toBeVisible();
  });

});
