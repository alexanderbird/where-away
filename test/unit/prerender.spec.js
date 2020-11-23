const { JSDOM } = require('jsdom');

const { prerender } = require('../../src/cli/prerender');


describe('prerender', () => {
  it('produces an html string with anchor tags', () => {
    const input = [{ href: 'https://foo.com', key: 'l', label: 'First Link' }];
    const actual = prerender(input);
    expect(summarizeHTML(actual[''])).toEqual([expect.objectContaining({
      nodeName: 'button',
      attributes: expect.objectContaining({
        onclick: 'window.location.href = "https://foo.com"',
        'data-keyboard-shortcut': 'l'
      }),
      textContent: 'First Link'
    })]);
  });

  it('produces an anchor tag for parameterized links', () => {
    const input = [{ href: 'https://foo.com/{{ Favourite Fruit or Appliance }}/search?where=here', key: 'f', label: 'Fruits and Appliances' }];
    const actual = prerender(input);
    expect(summarizeHTML(actual['f'])).toEqual([expect.objectContaining({
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
    const input = [{ href: 'https://foo.com/{{ Favourite Fruit or Appliance }}/search?where=here', key: 'a', label: 'Fruits and Appliances' }];
    const actual = prerender(input);
    expect(summarizeHTML(actual[''])).toEqual([expect.objectContaining({
      nodeName: 'button',
      attributes: expect.objectContaining({
        onclick: 'addToPath(this)',
        'data-keyboard-shortcut': 'a'
      }),
      textContent: 'Fruits and Appliances'
    })]);
  });

  it('produces an anchor tag for group nodes', () => {
    const input = [{ children: [], key: 'g', label: 'A Group of Bookmarks' }];
    const actual = prerender(input);
    expect(summarizeHTML(actual[''])).toEqual([expect.objectContaining({
      nodeName: 'button',
      attributes: expect.objectContaining({
        onclick: 'addToPath(this)',
        'data-keyboard-shortcut': 'g'
      }),
      textContent: 'A Group of Bookmarks'
    })]);
  });

  it('produces a button tag for each root link', () => {
    const input = [
      { href: 'https://foo.com', label: 'The Foo' },
      { href: 'https://bar.com', label: 'BARBAR' },
      { href: 'https://baz.com', label: 'le bazzoo' }
    ];
    const actual = prerender(input);
    expect(summarizeHTML(actual[''])).toEqual([
      expect.objectContaining({ nodeName: 'button', textContent: 'The Foo' }),
      expect.objectContaining({ nodeName: 'button', textContent: 'BARBAR' }),
      expect.objectContaining({ nodeName: 'button', textContent: 'le bazzoo' }),
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
      const actual = prerender([input]);
      expect(summarizeHTML(actual[''])[0].attributes.class).toEqual('bookmark');
    }));
  });

  describe('nested links', () => {
    const input = [
      { key: 'g', label: 'Grandparent', children: [
        { key: 'a', label: 'Parent A', children: [
          { key: 'c', label: 'Child Group', children: [
            { href: 'https://cool.io', key: '1', label: 'Link 1' },
          ] }
        ] },
        { key: 'b', label: 'Parent B', children: [
          { href: 'https://example.com', key: 'm', label: 'Link M' },
        ] }
      ] }
    ];

    it('produces objects keys for each unique path', () => {
      const actual = prerender(input);

      expect(Object.keys(actual).sort()).toEqual(['', 'g', 'ga', 'gac', 'gb']);
    });

    it('produces the right html for nested paths', () => {
      const actual = prerender(input);

      expect(summarizeHTML(actual['gac'])).toEqual([expect.objectContaining({
        nodeName: 'button',
        attributes: expect.objectContaining({
          onclick: 'window.location.href = "https://cool.io"',
          'data-keyboard-shortcut': '1'
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
        const actual = prerender(input);
        expect(summarizeHTML(actual[''])[0].innerHTML).toEqual(expected);
      });
    });
  });

  describe('specifying which occurrence of the key to emphasize', () => {
    it('emphasizes the third occurrence of the key for a node with the emphasizeNth attribute of 3', () => {
        const input = [{ children: [], key: 'a', emphasizeNth: 3, label: 'neat apple Aunts eat Alligator tarts' }];
        const expected = 'neat apple <strong>A</strong>unts eat Alligator tarts'
        const actual = prerender(input);
        expect(summarizeHTML(actual[''])[0].innerHTML).toEqual(expected);
    });

    it('throws a helpful message when an emphasize-nth attribute value is zero', () => {
      const input = [{ href: '...', key: 'a', emphasizeNth: 0, label: 'whatever' }];
      expect(() => prerender(input)).toThrow('the value emphasizeNth for the "whatever" node must be greater than zero, but was 0');
    });

    it('throws a helpful message when an emphasize-nth attribute value is greater than the number of occurrences of that letter', () => {
      const input = [{ href: '...', key: 'a', emphasizeNth: 5, label: 'cats bats and rats' }];
      expect(() => prerender(input)).toThrow('the value emphasizeNth for the "cats bats and rats" node cannot be greater than the number of "a"s in the label. There are 4 "a"s in the label, but emphasizeNth is 5');
    });

    it('throws a helpful message when an emphasize-nth attribute value is not a number', () => {
      const input = [{ href: '...', key: 'a', emphasizeNth: NaN, label: 'whatever' }];
      expect(() => prerender(input)).toThrow('the value emphasizeNth for the "whatever" node cannot be interpreted as an integer; JavaScript\'s parseInt() method returned NaN');
    });
    
    it('throws a helpful message when the key is not present in the label', () => {
      const input = [{ href: '...', key: 'a', label: 'nope' }];
      expect(() => prerender(input)).toThrow('key error for node "nope": the key "a" does not occur in the label "nope".')
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
