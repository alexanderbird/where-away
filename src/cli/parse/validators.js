const { BookmarkValidationError } = require('./BookmarkValidationError');

module.exports = {
  verifyNoUnsupportedAttributes(parent, unusedAttributes) {
    const unsupportedAttributeKeys = Object.keys(unusedAttributes);
    if (unsupportedAttributeKeys.length) {
      const helpMessage = `unsupported attributes: the <${parent.nodeName}> element does not support these attributes: ${unsupportedAttributeKeys.map(x => `"${x}"`).join(", ")}.`;
      throw new BookmarkValidationError(parent.lineNumber, parent.columnNumber, helpMessage);
    }
  },
  verifyNodeType(node, supported) {
    if (supported.indexOf(node.nodeName.toLowerCase()) < 0) {
      const helpMessage = `unsupported element. Expected ${supported.map(e => `<${e}>`).join(" or ")} but got <${node.nodeName}>.`;
      throw new BookmarkValidationError(node.lineNumber, node.columnNumber, helpMessage);
    }
  },
  verifyNoDuplicateKeys(stuff, children) {
    const duplicates = Object.values(children.reduce((grouped, node) => {
        grouped[node.key] = grouped[node.key] || { key: node.key, labels: [] };
        grouped[node.key].labels.push(node.label);
        return grouped;
      }, {}))
      .filter(({ labels }) => labels.length > 1)
    if (duplicates.length) {
      const duplicate = duplicates[0];
      const helpMessage =  `duplicate key: key "${duplicate.key}" is used for links ${duplicate.labels.map(l => `"${l}"`).join(", ")}. Keys must be unique to a <${stuff.nodeName}> element`;
      throw new BookmarkValidationError(stuff.lineNumber, stuff.columnNumber, helpMessage);
    }
  },
}

