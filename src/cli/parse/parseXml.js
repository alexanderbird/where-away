const { DOMParser } = require('xmldom');
const { BookmarkValidationError } = require('./BookmarkValidationError');

function createDOMParser(onWarning) {
  return new DOMParser({
    locator: {},
    errorHandler: { warning: onWarning, error: doThrow, fatalError: doThrow }
  });
}

function throwForWarnings(xmlDomWarnings) {
  if (xmlDomWarnings.length) {
    throwForWarning(xmlDomWarnings[0]);
  }
}

function throwForWarning(xmlDomWarning) {
  const [_, message, line, column ] = xmlDomWarning.match(/\[xmldom warning]\s*(.*)\n@#\[line:(.*),col:(.*)]/);
  if (!message) {
    console.warn('trouble parsing xmldom warning');
    throw new Error(xmlDomWarning);
  }
  throw new BookmarkValidationError(line, column, message);
}

function doThrow(...message) {
  throw new Error(message); 
}

function parseXml(xml) {
  const warnings = [];
  const document = createDOMParser(warnings.push.bind(warnings)).parseFromString(xml, 'application/xml')
  throwForWarnings(warnings);
  return document;
}

module.exports = { parseXml };
