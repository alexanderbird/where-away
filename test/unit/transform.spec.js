const { transform } = require('../../src/cli/transform');

describe('transform', () => {
  it('produces an html string with anchor tags', () => {
    const input = [{ href: 'https://foo.com', key: 'a', label: 'First Link' }];
    const actual = transform(input);
    expect(actual['']).toEqual('<a data-keyboard-shortcut="a" href="https://foo.com">First Link</a>');
  });

  it('produces an anchor tag for parameterized links', () => {
    const input = [{ href: 'https://foo.com/{{ Favourite Fruit or Appliance }}/search?where=here', key: 'f', label: 'Fruits and Appliances' }];
    const actual = transform(input);
    expect(actual['f']).toEqual('<input type="text" '
      + 'placeholder="Favourite Fruit or Appliance" '
      + 'onkeyup="e => e.stopPropagation()" '
      + 'data-on-change-navigate-to="https://foo.com/{{VALUE}}/search?where=here" '
      + '></input>');
  });

  it('produces a parent tag for parameterized links', () => {
    const input = [{ href: 'https://foo.com/{{ Favourite Fruit or Appliance }}/search?where=here', key: 'f', label: 'Fruits and Appliances' }];
    const actual = transform(input);
    expect(actual['']).toEqual('<a data-keyboard-shortcut="f" onclick="addToPath(this)">Fruits and Appliances</a>');
  });

  it('produces an anchor tag for group nodes', () => {
    const input = [{ children: [], key: 'g', label: 'A Group of Bookmarks' }];
    const actual = transform(input);
    expect(actual['']).toEqual('<a data-keyboard-shortcut="g" onclick="addToPath(this)">A Group of Bookmarks</a>');
  });

  it('produces an anchor tag for each root link', () => {
    const input = [
      { href: 'https://foo.com', key: 'f', label: 'The Foo' },
      { href: 'https://bar.com', key: 'b', label: 'BARBAR' },
      { href: 'https://baz.com', key: 'z', label: 'le bazzoo' }
    ];
    const actual = transform(input);
    expect(actual['']).toEqual(
        '<a data-keyboard-shortcut="f" href="https://foo.com">The Foo</a>'
      + '<a data-keyboard-shortcut="b" href="https://bar.com">BARBAR</a>'
      + '<a data-keyboard-shortcut="z" href="https://baz.com">le bazzoo</a>'
    );
  });

  describe('nested links', () => {
    const input = [
      { key: '1', label: 'Grandparent', children: [
        { key: 'a', label: 'Parent A', children: [
          { key: 'm', label: 'Child Group', children: [
            { href: 'https://cool.io', key: '1', label: 'Link 1' },
          ] }
        ] },
        { key: 'b', label: 'Parent B', children: [
          { href: 'https://example.com', key: 'm', label: 'Link M' },
        ] }
      ] }
    ];

    it('produces objects keys for each unique path', () => {
      const actual = transform(input);

      expect(Object.keys(actual).sort()).toEqual(['', '1', '1a', '1am', '1b'])
    });

    it('produces the right html for nested paths', () => {
      const actual = transform(input);

      expect(actual['1am']).toEqual('<a data-keyboard-shortcut="1" href="https://cool.io">Link 1</a>');
    });
  });
});
