const { Sandbox } = require('./help/sandbox');
const { click } = require('./help/dumpster');
const { fakeExternalLinkPath } = require('./help/context');

describe('clicking links', () => {
  let sandbox;
  beforeAll(() => { sandbox = new Sandbox(); })
  afterAll(async () => { await sandbox.close(); });

  it('can take you to an external page', async () => {
    const page = await sandbox.openHtmlOutput();
    await click(page, 'External Link');
    await page.waitForNavigation({ waitUntil: 'networkidle0' })
    expect(page.url()).toEqual('file://' + fakeExternalLinkPath);
  });

  it('can take you to an external page after asking for a url parameter', async () => {
    const page = await sandbox.openHtmlOutput();
    await click(page, 'External Link with Parameter');
    const arbitraryValue = 'FLArrbeN' + Math.random();
    await page.$eval('input[type="text"]', (element, value) => {
      element.value = value;
      element.dispatchEvent(new Event('change'));
    }, arbitraryValue);
    expect(page.url()).toEqual(`file://${fakeExternalLinkPath}?param=${arbitraryValue}&more=true`);
  });

  it('can follow external links from a child page', async () => {
    const page = await sandbox.openHtmlOutput();
    await click(page, 'Child Page');
    await click(page, 'Another External Link');
    await page.waitForNavigation({ waitUntil: 'networkidle0' })
    expect(page.url()).toEqual('file://' + fakeExternalLinkPath + '?another=true');
  });

  it('can follow external links with parameters from a child page', async () => {
    const page = await sandbox.openHtmlOutput();
    await click(page, 'Child Page');
    await click(page, 'Another External Link with Parameter');
    const arbitraryValue = 'GLLlllitZZen' + Math.random();
    await page.$eval('input[type="text"]', (element, value) => {
      element.value = value;
      element.dispatchEvent(new Event('change'));
    }, arbitraryValue);
    expect(page.url()).toEqual(`file://${fakeExternalLinkPath}?param=${arbitraryValue}&another=true&yes=please`);
  });
});
