function getAttributes(domDocumentAttributes) {
  return Object.values(domDocumentAttributes)
    .reduce((all, one) => one.name ? ({
      ...all,
      [toAttributeName(one.name)]: one.value
    }) : all, {});
}

function toAttributeName(xmlAttributeName) {
  return xmlAttributeName
    .replace(/-+([a-zA-Z])/g, (_, char) => char.toUpperCase())
    .replace(/_/g, '');
}

module.exports = { getAttributes };
