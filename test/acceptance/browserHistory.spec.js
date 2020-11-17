const { Sandbox } = require('./help/sandbox');
const { keyup, getLinkTexts } = require('./help/dumpster');
const { fakeExternalLinkPath } = require('./help/context');
const { linkData } = require('./help/fixtures');

describe('browser history', () => {
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
});
