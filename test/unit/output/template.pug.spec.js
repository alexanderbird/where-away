const pug = require('pug');
const { JSDOM } = require('jsdom');

describe('template.pug', () => {
  function renderTemplate(variables = {}) {
    const html = pug.renderFile('src/output/template.pug', variables);
    return new JSDOM(html).window.document;
  }

  describe('head', () => {
    it('sets the title to "Where Away?" by default', () => {
      const dom = renderTemplate();
      expect(dom.querySelector('head title').textContent).toEqual('Where Away?');
    });

    it('sets the title based on configuration when provided', () => {
      const dom = renderTemplate({ title: 'Very Good' });
      expect(dom.querySelector('head title').textContent).toEqual('Very Good');
    });

    // Read more: https://css-tricks.com/snippets/html/responsive-meta-tag/
    it('sets the default viewport for mobile devices so the site is responsive', () => {
      const dom = renderTemplate();
      const metaViewportTag = dom.querySelector('meta[name="viewport"]')
      const expectedContent = 'width=device-width, initial-scale=1';
      expect(metaViewportTag.getAttribute('content')).toEqual(expectedContent);
    });
  });

  describe('body', () => {
    it('has a header container element as the first child of body', async () => {
      const dom = renderTemplate();
      const firstChildSummary = Array.from(dom.body.childNodes)
        .filter(node => node.nodeName !== '#text')
        .map(node => `${node.nodeName}#${node.id}`)
        [0];
      expect(firstChildSummary).toEqual('DIV#header');
    });

    it('has a footer container element as the last child of body', async () => {
      const dom = renderTemplate();
      const lastChildSummary = Array.from(dom.body.childNodes)
        .filter(node => node.nodeName !== '#text')
        .map(node => `${node.nodeName}#${node.id}`)
        .slice(-1)[0];
      expect(lastChildSummary).toEqual('DIV#footer');
    });
  });
});
