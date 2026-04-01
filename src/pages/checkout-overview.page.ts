import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutOverviewPage extends BasePage {
  private readonly summaryContainer: Locator;
  private readonly summaryItems: Locator;
  private readonly subtotalLabel: Locator;
  private readonly taxLabel: Locator;
  private readonly totalLabel: Locator;
  private readonly paymentInfo: Locator;
  private readonly shippingInfo: Locator;
  private readonly finishButton: Locator;
  private readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.summaryContainer = page.locator('[data-test="checkout-summary-container"]');
    this.summaryItems = page.locator('[data-test="inventory-item"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.paymentInfo = page.locator('[data-test="payment-info-value"]');
    this.shippingInfo = page.locator('[data-test="shipping-info-value"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  async getItemCount(): Promise<number> {
    return this.summaryItems.count();
  }

  async getSubtotal(): Promise<string> {
    return (await this.subtotalLabel.textContent()) ?? '';
  }

  async getTax(): Promise<string> {
    return (await this.taxLabel.textContent()) ?? '';
  }

  async getTotal(): Promise<string> {
    return (await this.totalLabel.textContent()) ?? '';
  }

  async getPaymentInfo(): Promise<string> {
    return (await this.paymentInfo.textContent()) ?? '';
  }

  async getShippingInfo(): Promise<string> {
    return (await this.shippingInfo.textContent()) ?? '';
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
