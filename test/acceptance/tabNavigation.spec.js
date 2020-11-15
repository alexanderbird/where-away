const { Sandbox } = require('./help/sandbox');
const { click, fillInInput } = require('./help/dumpster');
const { fakeExternalLinkPath } = require('./help/context');
const { linkData } = require('./help/fixtures');

describe('navigating with Tab and Enter', () => {
  let sandbox;
  beforeAll(() => { sandbox = new Sandbox(); })
  afterAll(async () => { await sandbox.close(); });

  it('gives you access to the first bookmark', async () => {
    const page = await sandbox.openHtmlOutput();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForSelector('#external-link-page');
    expect(page.url()).toEqual('file://' + fakeExternalLinkPath);
  });

  it('gives you access to the second bookmark (which happens to be a parameterized bookmark', async () => {
    const page = await sandbox.openHtmlOutput();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    const arbitraryValue = 'FLArrbeN' + Math.random();
    await fillInInput(page, 'input[type="text"]', arbitraryValue);
    await page.waitForSelector('#external-link-page');
    expect(page.url()).toEqual(`file://${fakeExternalLinkPath}?param=${arbitraryValue}&more=true`);
  });

  it('gives you access to bookmarks on child pages', async () => {
    const page = await sandbox.openHtmlOutput();
    await page.keyboard.press('Tab');   // to first bookmark
    await page.keyboard.press('Tab');   // to second bookmark
    await page.keyboard.press('Tab');   // to third bookmark
    await page.keyboard.press('Enter'); // to child page
    await page.keyboard.press('Tab');   // to first child bookmark
    await page.keyboard.press('Enter'); // activate
    await page.waitForSelector('#external-link-page');
    expect(page.url()).toEqual('file://' + fakeExternalLinkPath + '?another=true');
  });

  it('gives you access to subsequent bookmarks on child pages', async () => {
    const page = await sandbox.openHtmlOutput();
    await page.keyboard.press('Tab');   // to first bookmark
    await page.keyboard.press('Tab');   // to second bookmark
    await page.keyboard.press('Tab');   // to third bookmark
    await page.keyboard.press('Enter'); // to child page
    await page.keyboard.press('Tab');   // to first child bookmark
    await page.keyboard.press('Tab');   // to second child bookmark
    await page.keyboard.press('Enter'); // activate
    const arbitraryValue = 'GLLlllitZZen' + Math.random();
    await fillInInput(page, 'input[type="text"]', arbitraryValue);
    await page.waitForSelector('#external-link-page');
    expect(page.url()).toEqual(`file://${fakeExternalLinkPath}?param=${arbitraryValue}&another=true&yes=please`);
  });
});
