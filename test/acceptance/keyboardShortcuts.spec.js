const { Sandbox } = require('./help/sandbox');
const { keyup, waitForNavigation, fillInInput } = require('./help/dumpster');
const { fakeExternalLinkPath } = require('./help/context');

describe('handling keyboard shortcuts', () => {
  let sandbox;
  beforeAll(() => { sandbox = new Sandbox(); })
  afterAll(async () => { await sandbox.close(); });

  it('can take you to an external page', async () => {
    const page = await sandbox.openHtmlOutput();
    await keyup(page, 'e');
    await waitForNavigation(page);
    expect(page.url()).toEqual('file://' + fakeExternalLinkPath);
  });

  it('can take you to an external page after asking for a url parameter', async () => {
    const page = await sandbox.openHtmlOutput();
    await keyup(page, 'p');
    const arbitraryValue = 'FLArrbeN' + Math.random();
    await fillInInput(page, 'input[type="text"]', arbitraryValue);
    expect(page.url()).toEqual(`file://${fakeExternalLinkPath}?param=${arbitraryValue}&more=true`);
  });

  test.todo('can take you to a child page to show different links');
  test.todo('can take you from a child page back to a parent page with the Escape key');
});
