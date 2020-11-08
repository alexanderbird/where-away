const puppeteer = require('puppeteer');

const { htmlOutputPath } = require('./context');

class Sandbox {
  constructor() {
    this.browser = puppeteer.launch()
  }

  async withBrowser(action) {
    const browser = await this.browser;
    return action(browser);
  }

  async openHtmlOutput() {
    const page = await this.withBrowser(b => b.newPage());
    page.on('error',     error => console.error('Puppeteer page error:', error));
    page.on('pageerror', error => console.error('Puppeteer page error:', error));
    await page.goto(`file://${htmlOutputPath}`);
    return page;
  }

  async close() {
    await this.withBrowser(b => b.close());
  }
}

module.exports = { Sandbox }
