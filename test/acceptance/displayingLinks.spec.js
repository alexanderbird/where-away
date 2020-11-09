const { Sandbox } = require('./help/sandbox');
const { click, keyup } = require('./help/dumpster');
const { linkData } = require('./help/fixtures');

describe('displaying links', () => {
  let sandbox;
  beforeAll(() => { sandbox = new Sandbox(); })
  afterAll(async () => { await sandbox.close(); });

  it('can show all top level links', async () => {
    const page = await sandbox.openHtmlOutput();
    const linkTexts = await getLinkTexts(page);
    expect(linkTexts).toEqual([
      'External Link',
      'External Link with Parameter',
      'Child Page'
    ]);
  });

  it('can show all nested links', async () => {
    const page = await sandbox.openHtmlOutput();
    await click(page, linkData.child.label);
    const linkTexts = await getLinkTexts(page);
    expect(linkTexts).toEqual([
      'Another External Link',
      'Another External Link with Parameter'
    ]);
  });

  it('can take you from a child page back to a parent page with the Escape key', async () => {
    const page = await sandbox.openHtmlOutput();
    await keyup(page, linkData.child.key);
    await keyup(page, 'Escape');
    const linkTexts = await getLinkTexts(page);
    expect(linkTexts).toEqual([
      'External Link',
      'External Link with Parameter',
      'Child Page'
    ]);
  });

  async function getLinkTexts(page) {
    return await page.evaluate(() => Array.from(document.querySelectorAll('a')).map(a => a.textContent.trim()));
  }
});
