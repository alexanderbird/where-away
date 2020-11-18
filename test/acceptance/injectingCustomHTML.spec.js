const { exec } = require('child_process');
const path = require('path');
const { promisify } = require('util');

const { Sandbox } = require('./help/sandbox');
const { click, keyup, getLinkTexts } = require('./help/dumpster');
const { linkData } = require('./help/fixtures');

describe('injecting custom html', () => {
  let sandbox;
  beforeAll(async () => {
    const outputFileName = 'injecting_custom_html.html';
    const command = [
      'npx --no-install where-away',
      '--title "where-away Test Sandbox"',
      `--html-head "<meta name='twitter:title' content='Sandbox'><meta name='twitter:description' content='The Test Sandbox'>"`,
      '--header-html "<h1>Where Away? Test Sandbox</h1>"',
      '--footer-html "created in <code>test/acceptance/help/create_sandbox.sh</code>"',
      `> ${outputFileName}`,
      `< ${path.join(process.cwd(), 'test/acceptance/fixtures/input.xml')}`,
    ].join(' ');

    await promisify(exec)(command, { cwd: process.env.TEST_SANDBOX });
    sandbox = new Sandbox(path.join(process.env.TEST_SANDBOX, outputFileName));
  })
  afterAll(async () => { await sandbox.close(); });

  it('supports overriding the title', async () => {
    const page = await sandbox.openHtmlOutput();
    const title = await page.evaluate(() => document.title);
    expect(title).toEqual('where-away Test Sandbox');
  });

  it('injects the header argument into the header element', async () => {
    const page = await sandbox.openHtmlOutput();
    const headerHTML = await page.evaluate(() => document.querySelector('#header').innerHTML);
    expect(headerHTML).toEqual('<h1>Where Away? Test Sandbox</h1>');
  });

  it('injects the footer argument into the footer element', async () => {
    const page = await sandbox.openHtmlOutput();
    const footerHTML = await page.evaluate(() => document.querySelector('#footer').innerHTML);
    expect(footerHTML).toEqual('created in <code>test/acceptance/help/create_sandbox.sh</code>');
  });

  it('injects the html head argument into the html head', async () => {
    const page = await sandbox.openHtmlOutput();
    const metaTags = await page.evaluate(() => Array.from(document.querySelectorAll('meta')).map(tag => tag.outerHTML));
    expect(metaTags).toEqual(expect.arrayContaining([
      '<meta name="twitter:title" content="Sandbox">',
      '<meta name="twitter:description" content="The Test Sandbox">',
    ]));
  });
});
