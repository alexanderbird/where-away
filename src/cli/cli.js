#!/usr/bin/env node
const fs = require('fs');
const yargs = require('yargs-parser');

const { template } = require('./template');
const { prerender } = require('./prerender');
const { parse } = require('./parse');

const args = yargs(process.argv.slice(2));

const input = fs.readFileSync(process.stdin.fd, 'utf-8');

const bookmarks = prerender(parse(input));

const pugVariables = {
  title: args.title,
  htmlHead: args.htmlHead,
  headerHTML: args.headerHtml,
  footerHTML: args.footerHtml,
  bookmarks: JSON.stringify(bookmarks)
};

const renderedHTML = template(pugVariables);

console.log(renderedHTML);

