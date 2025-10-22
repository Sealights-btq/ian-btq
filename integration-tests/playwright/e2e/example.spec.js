// @ts-check
// Try using Sealights as test wrapper instead of reporter

// const { test, expect } = require('@playwright/test');
const { expect } = require('@playwright/test');
const { test } = require('sealights-playwright-plugin');
const config = require('./config');
const PlaywrightHelper = require('./playwrightHelper');

// Debug logging
console.log('🔍 Playwright Test Configuration:');
console.log('  - Base URL:', config.baseUrl);
console.log('  - Machine DNS env:', process.env.machine_dns);
console.log('  - MACHINE_DNS env:', process.env.MACHINE_DNS);

const testData = {
  email: 'ian@sealights.com',
  address: '123 Main Street',
  city: 'Austin',
  state: 'TX',
  zip: '78757',
  cvv: '123'
};

// Simple connectivity test
test('Application connectivity test', async ({ page }) => {
  console.log('🔍 Testing application connectivity...');
  console.log('📍 Target URL:', config.baseUrl);
  
  try {
    await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('✅ Successfully connected to application');
    console.log('📍 Final URL:', page.url());
    console.log('📄 Page title:', await page.title());
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'connectivity-test.png' });
    
    // Check if page loaded successfully
    const title = await page.title();
    expect(title).toBeTruthy();
    console.log('✅ Page title is present:', title);
    
  } catch (error) {
    console.log('❌ Failed to connect to application:', error.message);
    await page.screenshot({ path: 'connectivity-failed.png' });
    throw error;
  }
});

async function fillCheckoutForm(page, data) {
  await page.getByLabel('E-mail Address').fill(data.email);
  await page.getByLabel('Street Address').fill(data.address);
  await page.getByLabel('Zip Code').fill(data.zip);
  await page.getByLabel('City').fill(data.city);
  await page.getByLabel('State').fill(data.state);
  await page.getByLabel('CVV').fill(data.cvv);
}

test('Add single item to cart and complete checkout', async ({ page }) => {
  console.log('🚀 Starting test: Add single item to cart and complete checkout');
  console.log('📍 Navigating to:', config.baseUrl);
  
  await page.goto('/');
  console.log('✅ Page loaded, current URL:', page.url());
  
  // Take screenshot for debugging
  await page.screenshot({ path: 'debug-homepage.png' });
  
  // Wait for page to be fully loaded
  await page.waitForLoadState('networkidle');
  
  // Try to find and click first product
  try {
    await page.locator('.col-md-4 > a').first().waitFor({ timeout: 10000 });
    await page.locator('.col-md-4 > a').first().click();
    console.log('✅ Clicked first product');
  } catch (error) {
    console.log('❌ Failed to find/click first product:', error.message);
    await page.screenshot({ path: 'debug-no-products.png' });
    throw error;
  }
  
  // Try to add to cart
  try {
    await page.getByRole('button', { name: 'Add To Cart' }).waitFor({ timeout: 10000 });
    await page.getByRole('button', { name: 'Add To Cart' }).click();
    console.log('✅ Added item to cart');
  } catch (error) {
    console.log('❌ Failed to add to cart:', error.message);
    await page.screenshot({ path: 'debug-no-add-to-cart.png' });
    throw error;
  }
  
  await fillCheckoutForm(page, testData);
  await page.getByRole('button', { name: 'Place Order' }).click();
  await expect(page.getByText('Your order is complete!')).toBeVisible();
  await expect(page.getByText(/[\d]+\.\d{2}/)).toBeVisible();
  console.log('✅ Test completed successfully');
});

test('Add Loafers to Cart and Validate', async ({ page }) => {
  await page.goto('/');
  await page.locator('div:nth-child(5) > a').click();
  await page.getByRole('button', { name: 'Add To Cart' }).click();
  await page.getByRole('heading', { name: 'Loafers' }).click();
  await page.getByText('$89.99').click();
  await page.getByText('$8.99').click();
  await page.getByText('$98.98').click();
  await page.getByRole('button', { name: 'Empty Cart' }).click();
});

test('Add Mug to cart and validate', async ({ page }) => {
  await page.goto('/');
  await page.locator('div:nth-child(10) > a').click();
  await page.getByRole('button', { name: 'Add To Cart' }).click();
  await page.getByRole('heading', { name: 'Mug' }).click();
  await page.getByText('Quantity:').click();
  await page.getByRole('strong').click();
  await page.locator('div').filter({ hasText: /^\$8\.99$/ }).click();
  await page.getByText('SKU #6E92ZMYYFZ').click();
  await page.getByText('$17.98').click();
  await page.getByRole('button', { name: 'Empty Cart' }).click();
});
