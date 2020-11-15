const { Sandbox } = require('./help/sandbox');
const { click, fillInInput } = require('./help/dumpster');
const { fakeExternalLinkPath } = require('./help/context');
const { linkData } = require('./help/fixtures');

describe('clicking links', () => {
  let sandbox;
  beforeAll(() => { sandbox = new Sandbox(); })
  afterAll(async () => { await sandbox.close(); });

  it('can take you to an external page', async () => {
    const page = await sandbox.openHtmlOutput();
    await click(page, linkData.external.label);
    await page.waitForSelector('#external-link-page');
    expect(page.url()).toEqual('file://' + fakeExternalLinkPath);
  });

  it('can take you to an external page after asking for a url parameter', async () => {
    const page = await sandbox.openHtmlOutput();
    await click(page, linkData.parameter.label);
    const arbitraryValue = 'FLArrbeN' + Math.random();
    await fillInInput(page, 'input[type="text"]', arbitraryValue);
    expect(page.url()).toEqual(`file://${fakeExternalLinkPath}?param=${arbitraryValue}&more=true`);
  });

  it('can follow external links from a child page', async () => {
    const page = await sandbox.openHtmlOutput();
    await click(page, linkData.child.label);
    await click(page, linkData.child.external.label);
    await page.waitForSelector('#external-link-page');
    expect(page.url()).toEqual('file://' + fakeExternalLinkPath + '?another=true');
  });

  it('can follow external links with parameters from a child page', async () => {
    const page = await sandbox.openHtmlOutput();
    await click(page, linkData.child.label);
    await click(page, linkData.child.parameter.label);
    const arbitraryValue = 'GLLlllitZZen' + Math.random();
    await fillInInput(page, 'input[type="text"]', arbitraryValue);
    expect(page.url()).toEqual(`file://${fakeExternalLinkPath}?param=${arbitraryValue}&another=true&yes=please`);
  });
});
