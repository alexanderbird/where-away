const { DOMParser } = require('xmldom');

const {
  verifyNoUnsupportedAttributes,
  verifyNodeType,
} = require('./parse/validators');
const { getAttributes } = require('./parse/getAttributes');
const { NodeTransformer } = require('./parse/NodeTransformer');
const { parseXml } = require('./parse/parseXml');
const { Transformer } = require('./parse/Transformer');

const transformer = new Transformer([
  new NodeTransformer('link', (transformer, { parent, node, key, label, href, ...unusedAttributes }) => {
    verifyNoUnsupportedAttributes(node, unusedAttributes);
    return { label, key, href };
  }),
  new NodeTransformer('group', (transformer, { parent, node, key, label, ...unusedAttributes }) => {
    verifyNoUnsupportedAttributes(node, unusedAttributes);
    const children = transformer.transformChildren(node);
    return { label, key, children };
  })
]);

function parse(xml) {
  const root = parseXml(xml).lastChild;
  verifyNodeType(root, ['bookmarks']);
  verifyNoUnsupportedAttributes(root, getAttributes(root.attributes));
  return transformer.transformChildren(root);
}

module.exports = { parse };
