const { JSDOM } = require('jsdom');

const { transform } = require('../../src/cli/transform');


describe('transform', () => {
  it('produces an html string with anchor tags', () => {
    const input = [{ href: 'https://foo.com', key: 'a', label: 'First Link' }];
    const actual = transform(input);
    expect(summarizeHTML(actual[''])).toEqual([expect.objectContaining({
      nodeName: 'a',
      attributes: expect.objectContaining({
        href: 'https://foo.com',
        'data-keyboard-shortcut': 'a'
      }),
      textContent: 'First Link'
    })]);
  });

  it('produces an anchor tag for parameterized links', () => {
    const input = [{ href: 'https://foo.com/{{ Favourite Fruit or Appliance }}/search?where=here', key: 'x', label: 'Fruits and Appliances' }];
    const actual = transform(input);
    expect(summarizeHTML(actual['x'])).toEqual([expect.objectContaining({
      nodeName: 'input',
      attributes: expect.objectContaining({
        type: 'text',
        class: 'bookmark-parameter',
        placeholder: 'Favourite Fruit or Appliance',
        onkeyup: 'e => e.stopPropagation()',
        'data-on-change-navigate-to': 'https://foo.com/{{VALUE}}/search?where=here',
      }),
      textContent: ''
    })]);
  });

  it('produces a parent tag for parameterized links', () => {
    const input = [{ href: 'https://foo.com/{{ Favourite Fruit or Appliance }}/search?where=here', key: 'x', label: 'Fruits and Appliances' }];
    const actual = transform(input);
    expect(summarizeHTML(actual[''])).toEqual([expect.objectContaining({
      nodeName: 'button',
      attributes: expect.objectContaining({
        onclick: 'addToPath(this)',
        'data-keyboard-shortcut': 'x'
      }),
      textContent: 'Fruits and Appliances'
    })]);
  });

  it('produces an anchor tag for group nodes', () => {
    const input = [{ children: [], key: 'y', label: 'A Group of Bookmarks' }];
    const actual = transform(input);
    expect(summarizeHTML(actual[''])).toEqual([expect.objectContaining({
      nodeName: 'button',
      attributes: expect.objectContaining({
        onclick: 'addToPath(this)',
        'data-keyboard-shortcut': 'y'
      }),
      textContent: 'A Group of Bookmarks'
    })]);
  });

  it('produces an anchor tag for each root link', () => {
    const input = [
      { href: 'https://foo.com', key: 'l', label: 'The Foo' },
      { href: 'https://bar.com', key: 'm', label: 'BARBAR' },
      { href: 'https://baz.com', key: 'n', label: 'le bazzoo' }
    ];
    const actual = transform(input);
    expect(summarizeHTML(actual[''])).toEqual([
      expect.objectContaining({ nodeName: 'a', textContent: 'The Foo' }),
      expect.objectContaining({ nodeName: 'a', textContent: 'BARBAR' }),
      expect.objectContaining({ nodeName: 'a', textContent: 'le bazzoo' }),
    ]);
  });

  describe('identifying anchors and buttons through CSS', () => {
    [
      {
        testCase: 'link',
        input: { href: 'go.there', key: 'a', label: 'anchor' }
      },
      {
        testCase: 'parameterized link parent',
        input: { href: 'go.{{ somewhere }}', key: 'a', label: 'anchor' }
      },
      {
        testCase: 'group',
        input: { children: [], key: 'a', label: 'anchor' }
      }
    ].forEach(({ testCase, input }) => it(`adds the 'bookmark' class to ${testCase} nodes`, () => {
      const actual = transform([input]);
      expect(summarizeHTML(actual[''])[0].attributes.class).toEqual('bookmark');
    }));
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

      expect(Object.keys(actual).sort()).toEqual(['', '1', '1y', '1ym', '1z']);
    });

    it('produces the right html for nested paths', () => {
      const actual = transform(input);

      expect(summarizeHTML(actual['1ym'])).toEqual([expect.objectContaining({
        nodeName: 'a',
        attributes: expect.objectContaining({
          href: 'https://cool.io',
          'data-keyboard-shortcut': 'q'
        }),
        textContent: 'Link 1'
      })]);
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
        expect(summarizeHTML(actual[''])[0].innerHTML).toEqual(expected);
      });
    });
  });

  function summarizeHTML(html) {
    const body = new JSDOM(html).window.document.body;
    return Array.from(body.childNodes)
      .map(node => ({
        nodeName: node.nodeName.toLowerCase(),
        textContent: node.textContent,
        innerHTML: node.innerHTML,
        attributes: Array.from(node.attributes)
          .map(({ nodeName: key, nodeValue: value }) => ({ key, value }))
          .reduce((all, one) => { all[one.key] = one.value; return all }, {})
      }));
  }
});
