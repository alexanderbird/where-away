function getAttributes(domDocumentAttributes) {
  return Object.values(domDocumentAttributes)
    .reduce((all, one) => one.name ? ({
      ...all,
      [one.name]: one.value
    }) : all, {});
}

module.exports = { getAttributes };
