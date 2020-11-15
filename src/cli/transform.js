function transform(data) {
  const result = {};
  function addToResult(path, html) {
    result[path] = (result[path] || '') + html;
  }

  data.forEach(d => chomp('', addToResult, d));

  return result;
}

function chomp(path, addToResult, { key, href, label, children }) {
  if (children) {
    addToResult(path, `<a data-keyboard-shortcut="${key}" onclick="addToPath(this)">${label}</a>`);
    children.forEach(child => chomp(path + key, addToResult, child));
  } else {
    const parameterData = href.match(/^(.*){{(.*)}}(.*)$/);

    if (parameterData) {
      const [_, left, parameterLabel, right] = parameterData;
      const parentHtml = `<a data-keyboard-shortcut="${key}" onclick="addToPath(this)">${label}</a>`;
      const childHtml = '<input type="text" '
        + `placeholder="${parameterLabel.trim()}" `
        + 'onkeyup="e => e.stopPropagation()" '
        + `data-on-change-navigate-to="${left}{{VALUE}}${right}" `
        + '></input>';
      addToResult(path, parentHtml);
      addToResult(path + key, childHtml);
    } else {
      addToResult(path, `<a data-keyboard-shortcut="${key}" href="${href}">${label}</a>`);
    }
  }
}

module.exports = { transform };
