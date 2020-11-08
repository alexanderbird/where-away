async function click(page, _text) {
  await page.evaluate((text) => {
    const link = Array.from(document.querySelectorAll('a')).find(a => a.textContent.trim() === text);
    link.click();
  }, _text);
}

module.exports = { click };
