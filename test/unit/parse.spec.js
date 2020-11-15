const { parse } = require('../../src/cli/parse');

describe('parse', () => {
  it('converts xml to object', () => {
    const xml = `
      <bookmarks>
        <link key="a" href="foo" label="First Link"></link>
        <group key="a" label="Group">
          <link key="b" href="c" label="child"></link> 
        </group> 
      </bookmarks>
    `;
    const expected = [
      {
        "href": "foo",
        "key": "a",
        "label": "First Link"
      },
      {
        "label": "Group",
        "key": "a",
        "children": [
          {
            "href": "c",
            "key": "b",
            "label": "child"
          }
        ]
      }
    ];
    expect(parse(xml)).toEqual(expected);
  });

  it('lowercases the key', () => {
    const xml = `
      <bookmarks>
        <link key="Q" href="foo" label="First Link"></link>
      </bookmarks>
    `;
    const expected = [{
      "href": "foo",
      "key": "q",
      "label": "First Link"
    }];
    expect(parse(xml)).toEqual(expected);
  });
});
