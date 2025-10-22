const { chromium } = require('playwright');

class PlaywrightHelper {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    this.browser = await chromium.launch();
    this.page = await this.browser.newPage();
  }

  async goTo(url) {
    await this.page.goto(url);
  }

  async click(selector) {
    await this.page.click(selector);
  }

  async type(selector, text) {
    await this.page.type(selector, text);
  }

  async waitForSelector(selector) {
    await this.page.waitForSelector(selector);
  }

  async getText(selector) {
    return await this.page.textContent(selector);
  }

  async login(username, password, signedInUser) {
    console.log('🔐 Attempting login with username:', username);
    
    try {
      await this.page.getByRole('button', { name: 'Log in' }).waitFor({ timeout: 10000 });
      await this.page.getByRole('button', { name: 'Log in' }).click();
      console.log('✅ Clicked login button');
      
      await this.page.locator('#login input[type="text"]').waitFor({ timeout: 10000 });
      await this.page.locator('#login input[type="text"]').click();
      await this.page.locator('#login input[type="text"]').fill(username);
      console.log('✅ Filled username');
      
      await this.page.locator('input[type="password"]').waitFor({ timeout: 10000 });
      await this.page.locator('input[type="password"]').click();
      await this.page.locator('input[type="password"]').fill(password);
      console.log('✅ Filled password');
      
      await this.page.getByRole('navigation').getByRole('button', { name: 'Log in' }).waitFor({ timeout: 10000 });
      await this.page.getByRole('navigation').getByRole('button', { name: 'Log in' }).click();
      console.log('✅ Submitted login form');
      
      await this.page.getByRole('button', { name: 'Hello, John' }).waitFor({ timeout: 10000 });
      await this.page.getByRole('button', { name: 'Hello, John' }).click();
      await this.page.getByRole('link', { name: 'Log out' }).click();
      console.log('✅ Login/logout flow completed');
      
    } catch (error) {
      console.log('❌ Login failed:', error.message);
      await this.page.screenshot({ path: 'login-failed.png' });
      throw error;
    }
  }

  async screenshot(path) {
    await this.page.screenshot({ path });
  }

  async close() {
    await this.browser.close();
  }
}

module.exports = PlaywrightHelper;

