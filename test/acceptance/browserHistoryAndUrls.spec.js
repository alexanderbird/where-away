const { Sandbox } = require('./help/sandbox');
const { keyup, getLinkTexts } = require('./help/dumpster');
const { fakeExternalLinkPath } = require('./help/context');
const { linkData } = require('./help/fixtures');
const { htmlOutputPath } = require('./help/context');

describe('browser history and urls', () => {
  let sandbox;
  beforeAll(() => { sandbox = new Sandbox(); })
  afterAll(async () => { await sandbox.close(); });

  it('can take you from a child page back to a parent page with the browser back button', async () => {
    const page = await sandbox.openHtmlOutput();
    await keyup(page, linkData.child.key);
    await page.goBack();
    const linkTexts = await getLinkTexts(page);
    expect(linkTexts).toEqual([
      'External Link',
      'External Link with Parameter',
      'Child Page'
    ]);
  });

  it('persists page data after reloading the page', async () => {
    const page = await sandbox.openHtmlOutput();
    await keyup(page, linkData.child.key);
    await page.reload()
    const linkTexts = await getLinkTexts(page);
    expect(linkTexts).toEqual([
      'Another External Link',
      'Another External Link with Parameter'
    ]);
  });

  it('can follow external links directly from the url', async () => {
    const page = await sandbox.openHtmlOutput();
    await page.goBack(); // back to about:blank so that we can have a fresh DOMContentLoaded event
    const urlHash = linkData.child.key + linkData.child.external.key;
    await page.goto(`file://${htmlOutputPath}#${urlHash}`);
    await page.waitForSelector('#external-link-page');
    expect(page.url()).toEqual('file://' + fakeExternalLinkPath + '?another=true');
  });

  xit('can follow external links with parameters from a child page', async () => {
    const page = await sandbox.openHtmlOutput();
    await page.goBack(); // back to about:blank so that we can have a fresh DOMContentLoaded event
    const urlHash = linkData.child.key + linkData.child.parameter.key;
    await page.goto(`file://${htmlOutputPath}#${urlHash}`);
    const arbitraryValue = 'GLLlllitZZen' + Math.random();
    await fillInInput(page, 'input[type="text"]', arbitraryValue);
    expect(page.url()).toEqual(`file://${fakeExternalLinkPath}?param=${arbitraryValue}&another=true&yes=please`);
  });
});
