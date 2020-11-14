const { Sandbox } = require('./help/sandbox');
const { click } = require('./help/dumpster');
const { fakeExternalLinkPath } = require('./help/context');
const { linkData } = require('./help/fixtures');

describe('entering url parameters', () => {
  let sandbox;
  beforeAll(() => { sandbox = new Sandbox(); })
  afterAll(async () => { await sandbox.close(); });

  it('shows you the placeholder from your bookmarks file', async () => {
    const page = await sandbox.openHtmlOutput();
    await click(page, linkData.parameter.label);
    const inputPlaceholder = await page.evaluate(() => document.querySelector('input[type="text"]').getAttribute('placeholder'));
    expect(inputPlaceholder).toEqual('cat breed');
  });
});
