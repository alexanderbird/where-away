const { DOMParser } = require('xmldom');

function getAttributes(domDocumentAttributes) {
  return Object.values(domDocumentAttributes)
    .reduce((all, one) => ({
      ...all,
      [one.name]: one.value
    }), {});
}

function isValidNode(node) {
  return node.nodeName !== '#text';
}

function objectify(stuff) {
  const { href, key, label } = getAttributes(stuff.attributes);
  if (stuff.nodeName === 'link') {
    return { href, key, label }
  }

  if (stuff.nodeName === 'group') {
    return { label, key, children: Array.from(stuff.childNodes).filter(isValidNode).map(objectify) }
  }

  throw new Error(`don't know what to do with ${stuff}`);
}

function parse(xml) {
  const document = new DOMParser().parseFromString(xml, 'application/xml')
  return Array.from(document.lastChild.childNodes).filter(isValidNode).map(objectify);
}

module.exports = { parse }


