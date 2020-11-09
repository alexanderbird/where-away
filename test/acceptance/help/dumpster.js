async function click(page, _text) {
  await page.evaluate(text => {
    const link = Array.from(document.querySelectorAll('a')).find(a => a.textContent.trim() === text);
    link.click();
  }, _text);
}

async function keyup(page, _key) {
  await page.evaluate(key => {
    const event = new KeyboardEvent('keyup', { key });
    document.dispatchEvent(event);
  }, _key);
}

module.exports = { click, keyup };
