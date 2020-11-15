const { JSDOM } = require('jsdom');

const { transform } = require('../../src/cli/transform');


describe('transform', () => {
  it('produces an html string with anchor tags', () => {
    const input = [{ href: 'https://foo.com', key: 'a', label: 'First Link' }];
    const actual = transform(input);
    expect(actual['']).toEqual('<a data-keyboard-shortcut="a" href="https://foo.com">First Link</a>');
  });

  it('produces an anchor tag for parameterized links', () => {
    const input = [{ href: 'https://foo.com/{{ Favourite Fruit or Appliance }}/search?where=here', key: 'x', label: 'Fruits and Appliances' }];
    const actual = transform(input);
    expect(actual['x']).toEqual('<input type="text" '
      + 'placeholder="Favourite Fruit or Appliance" '
      + 'onkeyup="e => e.stopPropagation()" '
      + 'data-on-change-navigate-to="https://foo.com/{{VALUE}}/search?where=here" '
      + '></input>');
  });

  it('produces a parent tag for parameterized links', () => {
    const input = [{ href: 'https://foo.com/{{ Favourite Fruit or Appliance }}/search?where=here', key: 'x', label: 'Fruits and Appliances' }];
    const actual = transform(input);
    expect(actual['']).toEqual('<a data-keyboard-shortcut="x" onclick="addToPath(this)">Fruits and Appliances</a>');
  });

  it('produces an anchor tag for group nodes', () => {
    const input = [{ children: [], key: 'y', label: 'A Group of Bookmarks' }];
    const actual = transform(input);
    expect(actual['']).toEqual('<a data-keyboard-shortcut="y" onclick="addToPath(this)">A Group of Bookmarks</a>');
  });

  it('produces an anchor tag for each root link', () => {
    const input = [
      { href: 'https://foo.com', key: 'l', label: 'The Foo' },
      { href: 'https://bar.com', key: 'm', label: 'BARBAR' },
      { href: 'https://baz.com', key: 'n', label: 'le bazzoo' }
    ];
    const actual = transform(input);
    expect(actual['']).toEqual(
        '<a data-keyboard-shortcut="l" href="https://foo.com">The Foo</a>'
      + '<a data-keyboard-shortcut="m" href="https://bar.com">BARBAR</a>'
      + '<a data-keyboard-shortcut="n" href="https://baz.com">le bazzoo</a>'
    );
  });

  describe('nested links', () => {
    const input = [
      { key: '1', label: 'Grandparent', children: [
        { key: 'y', label: 'Parent A', children: [
          { key: 'm', label: 'Child Group', children: [
            { href: 'https://cool.io', key: 'q', label: 'Link 1' },
          ] }
        ] },
        { key: 'z', label: 'Parent B', children: [
          { href: 'https://example.com', key: 'm', label: 'Link M' },
        ] }
      ] }
    ];

    it('produces objects keys for each unique path', () => {
      const actual = transform(input);

      expect(Object.keys(actual).sort()).toEqual(['', '1', '1y', '1ym', '1z'])
    });

    it('produces the right html for nested paths', () => {
      const actual = transform(input);

      expect(actual['1ym']).toEqual('<a data-keyboard-shortcut="q" href="https://cool.io">Link 1</a>');
    });
  });

  describe('emphasizing the key', () => {
    [
      {
        testCase: 'lower case in anchor link',
        input: [{ href: 'https://first.com', key: 'i', label: 'First Link' }],
        expected: 'F<strong>i</strong>rst Link'
      },
      {
        testCase: 'upper case in anchor link',
        input: [{ href: 'https://first.com', key: 'i', label: 'FIRST LINK' }],
        expected: 'F<strong>I</strong>RST LINK'
      },
      {
        testCase: 'lower case in parameterized anchor link',
        input: [{ href: 'https://first.com/{{ stuff }}', key: 'i', label: 'First Link' }],
        expected: 'F<strong>i</strong>rst Link'
      },
      {
        testCase: 'upper case in parameterized anchor link',
        input: [{ href: 'https://first.com/{{ stuff }}', key: 'i', label: 'FIRST LINK' }],
        expected: 'F<strong>I</strong>RST LINK'
      },
      {
        testCase: 'lower case in group node',
        input: [{ children: [], key: 'o', label: 'A Group of Bookmarks' }],
        expected: 'A Gr<strong>o</strong>up of Bookmarks'
      },
      {
        testCase: 'upper case in group node',
        input: [{ children: [], key: 'o', label: 'A GROUP OF BOOKMARKS' }],
        expected: 'A GR<strong>O</strong>UP OF BOOKMARKS'
      },
    ].forEach(({ testCase, input, expected }) => {
      it(`emphasizes the first occurrence of the key for ${testCase}`, () => {
        const actual = transform(input);
        const actualDom = new JSDOM(actual['']).window.document.body.firstChild;
        expect(actualDom.innerHTML).toEqual(expected);
      });
    });
  });
});
