import { test, expect } from '../../src/fixtures';
import { PRODUCT_SLUGS } from '../../src/utils/test-data';

test.describe('Checkout', () => {
  test('should complete full checkout flow', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
    page,
  }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(PRODUCT_SLUGS.BACKPACK);
    await inventoryPage.goToCart();

    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    await checkoutInfoPage.fillInformation('Test', 'User', '12345');
    await checkoutInfoPage.continue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    const total = await checkoutOverviewPage.getTotal();
    expect(total).toContain('$');
    const itemCount = await checkoutOverviewPage.getItemCount();
    expect(itemCount).toBe(1);

    await checkoutOverviewPage.finish();
    await expect(page).toHaveURL(/checkout-complete\.html/);

    const header = await checkoutCompletePage.getCompleteHeader();
    expect(header).toBe('Thank you for your order!');
  });

  test('should show error when checkout info fields are empty', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
  }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(PRODUCT_SLUGS.BIKE_LIGHT);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutInfoPage.continue();

    const error = await checkoutInfoPage.getErrorMessage();
    expect(error).toContain('First Name is required');
  });

  test('should allow cancelling from checkout info', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    page,
  }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(PRODUCT_SLUGS.BACKPACK);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutInfoPage.cancel();
    await expect(page).toHaveURL(/cart\.html/);
  });

  test('should allow cancelling from checkout overview', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    page,
  }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(PRODUCT_SLUGS.BACKPACK);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.fillInformation('Test', 'User', '12345');
    await checkoutInfoPage.continue();

    await checkoutOverviewPage.cancel();
    await expect(page).toHaveURL(/inventory\.html/);
  });
});
