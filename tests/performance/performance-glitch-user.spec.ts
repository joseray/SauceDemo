import { test, expect } from '../../src/fixtures';
import { USERS, PASSWORD } from '../../src/utils/test-data';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Performance Glitch User', () => {
  /**
   * Threshold: 7 seconds for login + inventory page load.
   *
   * SauceDemo's performance_glitch_user introduces an artificial delay of ~3-5 seconds
   * on page loads. The 7-second threshold accounts for:
   *   1. ~5s maximum artificial server-side delay injected by SauceDemo
   *   2. ~2s buffer for real network latency, DNS resolution, and TLS handshake
   *
   * In a production environment, this threshold would be derived from performance SLAs
   * and p95 load time metrics. Here we use a pragmatic value that catches regressions
   * beyond the known artificial delay without causing flaky failures due to network jitter.
   */
  const INVENTORY_LOAD_THRESHOLD_MS = 7_000;

  test('should load inventory page within acceptable threshold after login', async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto();

    const startTime = Date.now();
    await loginPage.login(USERS.PERFORMANCE_GLITCH, PASSWORD);
    await page.waitForURL('**/inventory.html');
    await expect(page.locator('[data-test="inventory-container"]')).toBeVisible();
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(INVENTORY_LOAD_THRESHOLD_MS);
    // eslint-disable-next-line no-console
    console.log(`performance_glitch_user inventory load time: ${loadTime}ms (threshold: ${INVENTORY_LOAD_THRESHOLD_MS}ms)`);
  });
});
