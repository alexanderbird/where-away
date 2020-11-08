const { Sandbox } = require('./help/sandbox');

describe('handling keyboard shortcuts', () => {
  let sandbox;
  beforeAll(() => { sandbox = new Sandbox(); })
  afterAll(async () => { await sandbox.close(); });

  test.todo('can take you to an external page');
  test.todo('can take you to an external page after asking for a url parameter');
  test.todo('can take you to a child page to show different links');
  test.todo('can take you from a child page back to a parent page with the Escape key');
});
