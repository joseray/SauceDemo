import { test, expect } from '../../src/fixtures';
import { USERS, PASSWORD } from '../../src/utils/test-data';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test('should login successfully with standard_user', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login(USERS.STANDARD, PASSWORD);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('[data-test="inventory-container"]')).toBeVisible();
  });

  test('should show error for locked_out_user', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.LOCKED_OUT, PASSWORD);

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Sorry, this user has been locked out');
  });

  test('should show error for invalid password', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.STANDARD, 'wrong_password');

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username and password do not match');
  });

  test('should show error when username is empty', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('', PASSWORD);

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username is required');
  });

  test('should show error when password is empty', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.STANDARD, '');

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Password is required');
  });
});
