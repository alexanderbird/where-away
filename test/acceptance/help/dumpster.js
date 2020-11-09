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
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
  },

  fillInInput: async function fillInInput(page, selector, value) {
    await page.$eval(selector, (element, value) => {
      element.value = value;
      element.dispatchEvent(new Event('change'));
    }, value);
  }
};
