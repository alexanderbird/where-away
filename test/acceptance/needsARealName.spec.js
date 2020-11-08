const fs = require('fs');

const { htmlOutputPath } = require('./context');

describe('whatever', () => {
  it('can access the sandbox', () => {
    const html = fs.readFileSync(htmlOutputPath, 'utf8');
    expect(html.trim()).toEqual('Where Away?');
  });
});
