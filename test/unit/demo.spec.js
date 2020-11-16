const { version } = require('../../package.json');
const demo = require('../../demo/package.json');

describe('demo', () => {
  it('uses the latest version of where-away', () => {
    expect(demo.devDependencies['where-away']).toEqual(version);
  });
});
