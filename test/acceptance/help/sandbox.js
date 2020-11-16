const puppeteer = require('puppeteer');

const { htmlOutputPath } = require('./context');

class Sandbox {
  constructor(path = htmlOutputPath) {
    this.path = path;
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
    page.on('console', message => console[message.type()]('Puppeteer console message', message.text()));
    await page.goto(`file://${this.path}`);
    return page;
  }

  async close() {
    await this.withBrowser(b => b.close());
  }
}

module.exports = { Sandbox }
