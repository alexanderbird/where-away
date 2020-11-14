#!/usr/bin/env node
const fs = require('fs');

const { template } = require('./template');
const { transform } = require('./transform');
const { parse } = require('./parse');

const input = fs.readFileSync(process.stdin.fd, 'utf-8');

const bookmarks = transform(parse(input));

const renderedHTML = template({ bookmarks: JSON.stringify(bookmarks) });

console.log(renderedHTML);

