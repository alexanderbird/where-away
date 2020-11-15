const { Sandbox } = require('./help/sandbox');
const { keyup, fillInInput } = require('./help/dumpster');
const { fakeExternalLinkPath } = require('./help/context');
const { linkData } = require('./help/fixtures');

describe('handling keyboard shortcuts', () => {
  let sandbox;
  beforeAll(() => { sandbox = new Sandbox(); })
  afterAll(async () => { await sandbox.close(); });

  it('can take you to an external page', async () => {
    const page = await sandbox.openHtmlOutput();
    await keyup(page, linkData.external.key);
    await page.waitForSelector('#external-link-page');
    expect(page.url()).toEqual('file://' + fakeExternalLinkPath);
  });

  it('can take you to an external page after asking for a url parameter', async () => {
    const page = await sandbox.openHtmlOutput();
    await keyup(page, linkData.parameter.key);
    const arbitraryValue = 'FLArrbeN' + Math.random();
    await fillInInput(page, 'input[type="text"]', arbitraryValue);
    expect(page.url()).toEqual(`file://${fakeExternalLinkPath}?param=${arbitraryValue}&more=true`);
  });

  it('can follow external links from a child page', async () => {
    const page = await sandbox.openHtmlOutput();
    await keyup(page, linkData.child.key);
    await keyup(page, linkData.child.external.key);
    await page.waitForSelector('#external-link-page');
    expect(page.url()).toEqual('file://' + fakeExternalLinkPath + '?another=true');
  });

  it('can follow external links with parameters from a child page', async () => {
    const page = await sandbox.openHtmlOutput();
    await keyup(page, linkData.child.key);
    await keyup(page, linkData.child.parameter.key);
    const arbitraryValue = 'GLLlllitZZen' + Math.random();
    await fillInInput(page, 'input[type="text"]', arbitraryValue);
    expect(page.url()).toEqual(`file://${fakeExternalLinkPath}?param=${arbitraryValue}&another=true&yes=please`);
  });

  it('can take you from a child page back to a parent page with the Escape key', async () => {
    const page = await sandbox.openHtmlOutput();
    await keyup(page, linkData.child.key);
    await keyup(page, 'Escape');
    await keyup(page, linkData.external.key);
    await page.waitForSelector('#external-link-page');
    expect(page.url()).toEqual('file://' + fakeExternalLinkPath);
  });
});
