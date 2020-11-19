const pug = require('pug');
const fs = require('fs-extra');

const pugTemplate = fs.readFileSync('src/output/template.pug');

const template = `${pug.compile(pugTemplate, { filename: 'src/output/template.pug', compileDebug: false })}
module.exports = { template };
`;

fs.mkdirSync('./build', { recursive: true });
fs.copySync('./src/cli', './build');
fs.writeFileSync('./build/template.js', template);
