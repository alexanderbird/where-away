function prerender(data) {
  const result = {};
  function addToResult(path, html) {
    result[path] = (result[path] || '') + html;
  }

  data.forEach(d => chomp('', addToResult, d));

  return result;
}

function chomp(path, addToResult, { key, href, label, children }) {
  const emphasizedLabel = emphasizeKey(label, key);
  if (children) {
    addToResult(path, `<button class='bookmark' data-keyboard-shortcut="${key}" onclick="addToPath(this)">${emphasizedLabel}</button>`);
    children.forEach(child => chomp(path + key, addToResult, child));
  } else {
    const parameterData = href.match(/^(.*){{(.*)}}(.*)$/);

    if (parameterData) {
      const [_, left, parameterLabel, right] = parameterData;
      const parentHtml = `<button class='bookmark' data-keyboard-shortcut="${key}" onclick="addToPath(this)">${emphasizedLabel}</button>`;
      const childHtml = '<input type="text" '
        + 'class="bookmark-parameter" '
        + `placeholder="${parameterLabel.trim()}" `
        + 'onkeyup="e => e.stopPropagation()" '
        + `data-on-change-navigate-to="${left}{{VALUE}}${right}" `
        + '></input>';
      addToResult(path, parentHtml);
      addToResult(path + key, childHtml);
    } else {
      addToResult(path, `<button class='bookmark' data-keyboard-shortcut="${key}" onclick='window.location.href = "${href}"'>${emphasizedLabel}</button>`);
    }
  }
}

function emphasizeKey(label, key) {
  const keyPattern = new RegExp(key, 'i');
  return label.replace(keyPattern, `<strong>$&</strong>`);
}

module.exports = { prerender };
