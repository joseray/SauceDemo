import { test, expect } from '../../src/fixtures';
import { PRODUCT_SLUGS } from '../../src/utils/test-data';

test.describe('Cart Management', () => {
  test('should display added items in cart with correct details', async ({ inventoryPage, cartPage, page }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(PRODUCT_SLUGS.BACKPACK);
    await inventoryPage.goToCart();

    const names = await cartPage.getCartItemNames();
    expect(names).toContain('Sauce Labs Backpack');

    const prices = await cartPage.getCartItemPrices();
    expect(prices).toContain('$29.99');
  });

  test('should remove item from cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(PRODUCT_SLUGS.BACKPACK);
    await inventoryPage.goToCart();

    await cartPage.removeItem(PRODUCT_SLUGS.BACKPACK);

    const count = await cartPage.getCartItemCount();
    expect(count).toBe(0);
  });

  test('should continue shopping from cart', async ({ inventoryPage, cartPage, page }) => {
    await inventoryPage.goto();
    await inventoryPage.goToCart();
    await cartPage.continueShopping();

    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('should show correct quantity for each item', async ({ inventoryPage, cartPage, page }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(PRODUCT_SLUGS.BACKPACK);
    await inventoryPage.goToCart();

    const qty = page.locator('[data-test="item-quantity"]');
    await expect(qty).toHaveText('1');
  });
});
