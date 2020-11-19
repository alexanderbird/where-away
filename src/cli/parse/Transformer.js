const {
  verifyNodeType,
  verifyNoDuplicateKeys
} = require('./validators');
const { getChildNodes } = require('./getChildNodes');

class Transformer {
  constructor(supportedNodeTypes) {
    this.supportedNodeTypes = supportedNodeTypes;
  }

  getSupportedNodeTypeNames() {
    return this.supportedNodeTypes.map(({ type }) => type);
  }

  transform(parent, node) {
    verifyNodeType(node, this.getSupportedNodeTypeNames());
    const applicableStrategy = this.supportedNodeTypes.find(n => n.doesMatch(node));

    if (applicableStrategy) {
      return applicableStrategy.doParse(this, parent, node);
    }

    throw new Error(`Invariant exception: somehow we didn't notice that ${node.nodeName} is not supported before trying to parse it`);
  }

  transformChildren(parent) {
    const children = getChildNodes(parent).map(this.transform.bind(this, parent.nodeName));
    verifyNoDuplicateKeys(parent, children);
    return children;
  }
}

module.exports = { Transformer };
