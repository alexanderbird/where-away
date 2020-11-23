const { parse } = require('../../src/cli/parse');

describe('parse', () => {
  it('converts xml to object', () => {
    const xml = `
      <bookmarks>
        <link key="a" href="foo" label="First Link"></link>
        <group key="b" label="Group" emphasize-nth="1">
          <link key="b" href="c" label="child" emphasize-nth="3"></link> 
        </group> 
      </bookmarks>
    `;
    const expected = [
      {
        href: 'foo',
        key: 'a',
        label: 'First Link'
      },
      {
        label: 'Group',
        key: 'b',
        emphasizeNth: 1,
        children: [
          {
            href: 'c',
            key: 'b',
            label: 'child',
            emphasizeNth: 3,
          }
        ]
      }
    ];
    expect(parse(xml)).toEqual(expected);
  });

  it('lowercases the key', () => {
    const xml = '<bookmarks><link key="Q" href="foo" label="First Link"></link></bookmarks>';
    const expected = [{
      href: 'foo',
      key: 'q',
      label: 'First Link'
    }];
    expect(parse(xml)).toEqual(expected);
  });

  it('converts the emphasize-nth to an integer', () => {
    const xml = '<bookmarks><link key="a" href="..." label="first" emphasize-nth="3.7"></link></bookmarks>';
    const expected = [{
      href: '...',
      key: 'a',
      label: 'first',
      emphasizeNth: 3
    }];
    expect(parse(xml)).toEqual(expected);
  });

  describe('defaults', () => {
    it('uses the first character of the label as the key if none is provided', () => {
      const xml = '<bookmarks><link href="foo" label="First Link"></link></bookmarks>';
      const expected = [{
        href: 'foo',
        key: 'f',
        label: 'First Link'
      }];
      expect(parse(xml)).toEqual(expected);
    });
  });

  describe('validation', () => {
    // Some parts of these tests need something arbitrary that differs from test to test
    const randomString = Math.random().toString(36).replace(/[^a-z]/g, '');

    [
      {
        rule: 'accepts mixed tag name casing',
        input: `
          <boOKMarks>
            <grOUp label="x">
              <LINK href="" label="x"/>
            </grOUp>
          </boOKMarks>
        `
      },
      {
        rule: 'accepts key, href, and label attributes for <link> elements',
        input: '<bookmarks><link key="a" href="..." label="The Link" /></bookmarks>'
      },
      {
        rule: 'accepts key and label attributes for <group> elements',
        input: '<bookmarks><group key="a" label="The Group" /></bookmarks>'
      }
    ].forEach(({ rule, input }) => test(rule, () => {
      expect(() => parse(input)).not.toThrow();
    }));


    [
      {
        rule: 'does not accept root elements other than <bookmark>',
        input: `
          <notbookmarks></notbookmarks>
        `,
        expectedException: '[line 2 column 11] unsupported element. Expected <bookmarks> but got <notbookmarks>.'
      },
      {
        rule: 'does not tolerate unclosed tags',
        input: '<bookmarks><group></bookmarks>',
        expectedException: '[line 1 column 12] unclosed xml attribute'
      },
      {
        rule: 'does not accept children other than link and group for a <bookmarks> element',
        input: `<bookmarks><${randomString} /></bookmarks>`,
        expectedException: `[line 1 column 12] unsupported element. Expected <link> or <group> but got <${randomString}>.`
      },
      {
        rule: 'does not accept children other than link and group for a <group> element',
        input: `<bookmarks><group label="g"><${randomString} /></group></bookmarks>`,
        expectedException: `[line 1 column 29] unsupported element. Expected <link> or <group> but got <${randomString}>.`
      },
      {
        rule: 'does not accept any attributes on the <bookmarks> element',
        input: `<bookmarks ${randomString}="whatever" key="b" href="..." label="nope" />`,
        expectedException: `[line 1 column 1] unsupported attributes: the <bookmarks> element does not support these attributes: "${randomString}", "key", "href", "label".`
      },
      {
        rule: 'does not accept unknown attributes for <link> elements',
        input: `<bookmarks><link ${randomString}A="whatever" ${randomString}B="whatever" /></bookmarks>`,
        expectedException: `[line 1 column 12] unsupported attributes: the <link> element does not support these attributes: "${randomString}A", "${randomString}B".`
      },
      {
        rule: 'does not accept href or other unknown attributes for <group> elements',
        input: `<bookmarks><group ${randomString}A="whatever" ${randomString}B="whatever" label="x" href="..." /></bookmarks>`,
        expectedException: `[line 1 column 12] unsupported attributes: the <group> element does not support these attributes: "${randomString}A", "${randomString}B", "href".`
      },
      {
        rule: 'does not accept duplicate keys in <group> children',
        input: `
          <bookmarks>
            <group key="g" label="The Great Group" >
              <link key="a" href="..." label="first link" />
              <group key="a"           label="child group" />
              <link key="x" href="..." label="ok link" />
              <link key="a" href="..." label="second link" />
            </group>
          </bookmarks>
        `,
        expectedException: '[line 3 column 13] duplicate key: key "a" is used for links "first link", "child group", "second link". Keys must be unique to a <group> element'
      },
      {
        rule: 'does not accept duplicate default keys in <group> children',
        input: `
          <bookmarks>
            <group key="g" label="The Great Group" >
              <link key="g" href="..." label="first link" />
              <group                   label="group child" />
              <link key="x" href="..." label="ok link" />
              <link         href="..." label="good second link" />
            </group>
          </bookmarks>
        `,
        expectedException: '[line 3 column 13] duplicate key: key "g" is used for links "first link", "group child", "good second link". Keys must be unique to a <group> element'
      },
      {
        rule: 'does not accept duplicate keys in <bookmark> children',
        input: `
          <bookmarks>
            <link key="a" href="..." label="first link" />
            <group key="a"           label="child group" />
            <link key="x" href="..." label="ok link" />
            <link key="a" href="..." label="second link" />
          </bookmarks>
        `,
        expectedException: '[line 2 column 11] duplicate key: key "a" is used for links "first link", "child group", "second link". Keys must be unique to a <bookmarks> element'
      },
      {
        rule: 'does not accept duplicate default keys in <bookmark> children',
        input: `
          <bookmarks>
            <link key="g" href="..." label="first link" />
            <group                   label="group child" />
            <link key="x" href="..." label="ok link" />
            <link         href="..." label="good second link" />
          </bookmarks>
        `,
        expectedException: '[line 2 column 11] duplicate key: key "g" is used for links "first link", "group child", "good second link". Keys must be unique to a <bookmarks> element'
      }
    ].forEach(({ rule, input, expectedException }) => test(rule, () => {
      expect(() => parse(input)).toThrow(new Error(expectedException));
    }));

  });
});
