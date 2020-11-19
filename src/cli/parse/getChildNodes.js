const isNotTextNode = ({ nodeName }) => nodeName !== "#text";

function getChildNodes(parent) {
  return Array.from(parent.childNodes).filter(isNotTextNode)
}

module.exports = { getChildNodes };
