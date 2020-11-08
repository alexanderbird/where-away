const { Sandbox } = require('./help/sandbox');
const { click } = require('./help/dumpster');

describe('displaying links', () => {
  let sandbox;
  beforeAll(() => { sandbox = new Sandbox(); })
  afterAll(async () => { await sandbox.close(); });

  it('can show all top level links', async () => {
    const page = await sandbox.openHtmlOutput();
    const linkTexts = await page.evaluate(() => Array.from(document.querySelectorAll('a')).map(a => a.textContent.trim()));
    expect(linkTexts).toEqual([
      'External Link',
      'External Link with Parameter',
      'Child Page'
    ]);
  });

  it('can show all nested links', async () => {
    const page = await sandbox.openHtmlOutput();
    await click(page, 'Child Page');
    const linkTexts = await page.evaluate(() => Array.from(document.querySelectorAll('a')).map(a => a.textContent.trim()));
    expect(linkTexts).toEqual([
      'Another External Link',
      'Another External Link with Parameter'
    ]);
  });
});
