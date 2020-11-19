const { getAttributes } = require('./getAttributes');

function getBestKey(rawKey, label) {
  if (rawKey) {
    return rawKey.toLowerCase();
  }
  if (label) {
    return label.substring(0, 1).toLowerCase();
  }
  return '';
}

class NodeTransformer {
  constructor(type, parse) {
    this.type = type;
    this.parse = parse;
  }

  doesMatch(node) {
    return node.nodeName.toLowerCase() === this.type;
  }

  doParse(transformer, parent, node) {
    const { key: rawKey, label, ...otherAttributes } = getAttributes(node.attributes);
    const key = getBestKey(rawKey, label);
    return this.parse(transformer, { ...otherAttributes, parent, node, key, label });
  }
}

module.exports = { NodeTransformer };
