function prerender(data) {
  const result = {};
  function addToResult(path, html) {
    result[path] = (result[path] || '') + html;
  }

  data.forEach(d => chomp('', addToResult, d));

  return result;
}

function chomp(path, addToResult, { key, href, label, children, emphasizeNth }) {
  const emphasizedLabel = emphasizeKey(label, key, emphasizeNth);
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

function emphasizeKey(label, key, emphasizeNth = 1) {
  if (isNaN(emphasizeNth)) {
    throw new Error(`the value emphasizeNth for the "${label}" node cannot be interpreted as an integer; JavaScript's parseInt() method returned NaN`);
  }

  if (emphasizeNth <= 0) {
    throw new Error(`the value emphasizeNth for the "${label}" node must be greater than zero, but was ${emphasizeNth}`);
  }

  const beforePattern = `(?:[^${key}]*${key}){${emphasizeNth - 1}}[^${key}]*`;
  const nthKeyPattern = new RegExp(`^(?<before>${beforePattern})(?<keyMatch>${key})(?<after>.*)$`, 'i');
  const match = label.match(nthKeyPattern);
  if (!match) {
    const keyPattern = new RegExp(key, 'i');
    const keyCount = label.split(keyPattern).length - 1;
    if (keyCount < 1) {
      throw new Error(`key error for node "${label}": the key "${key}" does not occur in the label "${label}".`);
    }
    if (keyCount < emphasizeNth) {
      throw new Error(`the value emphasizeNth for the "${label}" node cannot be greater than the number of "${key}"s in the label. There are ${keyCount} "${key}"s in the label, but emphasizeNth is ${emphasizeNth}`);
    }
    return label;
  }
  const { before, keyMatch, after } = match.groups;
  return `${before}<strong>${keyMatch}</strong>${after}`;
}

module.exports = { prerender };
