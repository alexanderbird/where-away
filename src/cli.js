#!/usr/bin/env node

const { template } = require('./template');

const renderedHTML = template();

console.log(renderedHTML);

