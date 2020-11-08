const { Sandbox } = require('./help/sandbox');

describe('clicking links', () => {
  let sandbox;
  beforeAll(() => { sandbox = new Sandbox(); })
  afterAll(async () => { await sandbox.close(); });

  test.todo('can take you to an external page');
  test.todo('can take you to an external page after asking for a url parameter');
  test.todo('can take you to a child page to show different links');
});
