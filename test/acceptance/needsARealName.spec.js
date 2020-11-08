const { Sandbox } = require('./sandbox');

describe('whatever', () => {
  let sandbox;

  beforeAll(() => {
    sandbox = new Sandbox();
  })

  afterAll(async () => {
    await sandbox.close();
  });

  it('can access the sandbox', async () => {
    const page = await sandbox.openHtmlOutput();
    const textContent = await page.evaluate(() => document.body.textContent);
    expect(textContent.trim()).toEqual('Where Away?');
  });
});
