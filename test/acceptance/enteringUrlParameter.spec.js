const { Sandbox } = require('./help/sandbox');
const { click, aMoment, keyup, getLinkTexts } = require('./help/dumpster');
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

  it('returns to the previous list when you press escape', async () => {
    const page = await sandbox.openHtmlOutput();
    await click(page, linkData.parameter.label);
    await keyup(page, 'Escape');
    const linkTexts = await getLinkTexts(page);
    expect(linkTexts).toEqual([
      'External Link',
      'External Link with Parameter',
      'Child Page'
    ]);
  });

  it('auto-focusses the input', async () => {
    const page = await sandbox.openHtmlOutput();
    await click(page, linkData.parameter.label);
    await aMoment(100);
    const { nodeName, type } = await page.evaluate(() => {
      const element = document.activeElement;
      return { nodeName: element.nodeName, type: element.type };
    });
    expect(nodeName.toLowerCase()).toEqual('input');
    expect(type.toLowerCase()).toEqual('text');
  });

  it('has only one text input', async () => {
    // Several other tests assume there is only one input element on the page.
    // If you need to change the expectation of this test, please audit the other
    // tests in this file to see if they still make sense
    // e.g. 'auto-focusses the input' passes if the focussed element is a text input.
    // that assertion is meaningless if there are multiple text inputs on the page.
    const page = await sandbox.openHtmlOutput();
    await click(page, linkData.parameter.label);
    const textInputCount = await page.evaluate(() => document.querySelectorAll('input[type="text"]').length);
    expect(textInputCount).toEqual(1);
  });
});
