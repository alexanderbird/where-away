/*
 * The Dumpster. 
 *
 * This class is the dumping ground for gross utility methods that make tests
 * easier to read. 
 *
 * "But why use a name with such a negative connotation?"
 *
 * Because this file is Bad™. It's a coupling magnet -- it ties all these tests
 * together. These test utility files are troublesome in any context, but
 * particularly so with these browser UI tests. "Dumpster" reminds me that this
 * is a bad place to put things I care about. I'd like to find a better way,
 * but I don't know of one yet. So, I call it what it is. No pretending that
 * this is a Good Idea.
 *
 * As a point of information, I wouldn't use a provocative word like "Dumpster"
 * in a professional setting, but I would do what I can to avoid these files
 * growing and growing. If there's a better pattern available I may mark the
 * dumpster file (usually called "TestUtilities" or something polite and vague)
 * as deprecated so folks know they should do something better.
 *
 * If you read this and have better test helper architecture patterns or ideas,
 * please send me a tweet (@alexander_bird) or email
 * (alex@alexanderbird.software) -- I'm keen to improve the state of my
 * practice or just discuss the (anti)pattern with another practitioner.
 *
 */
module.exports = {
  click: async function click(page, _text) {
    await page.evaluate(text => {
      const link = Array.from(document.querySelectorAll('a')).find(a => a.textContent.trim() === text);
      link.click();
    }, _text);
  },

  keyup: async function keyup(page, _key) {
    await page.evaluate(key => {
      const event = new KeyboardEvent('keyup', { key });
      document.dispatchEvent(event);
    }, _key);
  },

  waitForNavigation: async function waitForNavigation(page) {
    await new Promise(r => setTimeout(r, 100));
  },

  fillInInput: async function fillInInput(page, selector, value) {
    await page.$eval(selector, (element, value) => {
      element.value = value;
      element.dispatchEvent(new Event('change'));
    }, value);
  }
};
