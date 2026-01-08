import { test, expect } from '@playwright/test';

// Test data constants for reusability
const TEST_USER = {
  username: 'user2',
  password: 'User@123' // Note: In production, this should match the hashed password in db.json
};

const TEST_PRODUCTS = [
  { id: '1', name: 'حليب طازج' },
  { id: '2', name: 'خبز عربي' }
];

const TEST_CUSTOMER = 'Test Customer UI';

// Page selectors - centralized for maintainability
const SELECTORS = {
  login: {
    usernameInput: 'input[name="username"]',
    passwordInput: 'input[name="password"]',
    submitButton: 'button[type="submit"]'
  },
  products: {
    addButton: (productId) => `button[data-product-id="${productId}"]`,
    checkoutButton: 'button.checkout'
  },
  checkout: {
    customerNameInput: 'input[name="customerName"]',
    confirmButton: 'button.confirm-sale',
    successMessage: '.success-message'
  },
  navigation: {
    salesHistoryLink: 'a[href="/sales-history"]'
  },
  salesHistory: {
    table: 'tbody.sales-history tr'
  }
};

// Reusable helper functions
async function login(page, user = TEST_USER) {
  await page.fill(SELECTORS.login.usernameInput, user.username);
  await page.fill(SELECTORS.login.passwordInput, user.password);
  await page.click(SELECTORS.login.submitButton);
  await page.waitForURL('**/products');
}

async function addProductToCart(page, productId) {
  await page.click(SELECTORS.products.addButton(productId));
}

async function proceedToCheckout(page) {
  await page.click(SELECTORS.products.checkoutButton);
}

async function completeSale(page, customerName = TEST_CUSTOMER) {
  await page.fill(SELECTORS.checkout.customerNameInput, customerName);
  await page.click(SELECTORS.checkout.confirmButton);
  await expect(page.locator(SELECTORS.checkout.successMessage)).toBeVisible();
  await page.waitForURL('**/sales-history');
}

async function navigateToSalesHistory(page) {
  await page.click(SELECTORS.navigation.salesHistoryLink);
}

async function verifySaleInHistory(page, customerName = TEST_CUSTOMER) {
  const lastSaleRow = page.locator(SELECTORS.salesHistory.table).last();
  await expect(lastSaleRow).toContainText(customerName);
}

async function takeScreenshot(page, filename) {
  await page.screenshot({ path: `screenshots/${filename}.png` });
}

test.describe('POS System UI Tests', () => {
  test('Complete sales workflow: login, create sale with two products, verify in history', async ({ page }) => {
    // Step 1: Navigate to login and capture initial state
    await page.goto('/login');
    await takeScreenshot(page, 'login-page');

    // Step 2: Perform login
    await login(page);
    await takeScreenshot(page, 'after-login');

    // Step 3: Add products to cart
    for (const product of TEST_PRODUCTS) {
      await addProductToCart(page, product.id);
    }
    await takeScreenshot(page, 'products-added');

    // Step 4: Complete the sale
    await proceedToCheckout(page);
    await completeSale(page);
    await takeScreenshot(page, 'sale-created');

    // Step 5: Verify sale in history
    await verifySaleInHistory(page);
    await takeScreenshot(page, 'sales-history');
  });
});