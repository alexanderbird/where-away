const { Sandbox } = require('./help/sandbox');

describe('displaying links', () => {
  let sandbox;
  beforeAll(() => { sandbox = new Sandbox(); })
  afterAll(async () => { await sandbox.close(); });

  it('can show all top level links', async () => {
    const page = await sandbox.openHtmlOutput();
    const linkTexts = await page.evaluate(() => Array.from(document.querySelectorAll('a')).map(a => a.textContent));
    expect(linkTexts).toEqual([
      'External Link',
      'External Link with Parameter',
      'Child Page'
    ]);
  });

  it('can show all nested links', async () => {
    const page = await sandbox.openHtmlOutput();
    await page.evaluate(() => {
      const link = Array.from(document.querySelectorAll('a')).find(a => a.textContent.trim() === 'Child Page');
      link.click();
    });
    const linkTexts = await page.evaluate(() => Array.from(document.querySelectorAll('a')).map(a => a.textContent));
    expect(linkTexts).toEqual([
      'Another External Link',
      'Another External Link with Parameter'
    ]);
  });
});
