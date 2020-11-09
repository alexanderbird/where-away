const pug = require('pug');
const fs = require('fs');

const pugTemplate = fs.readFileSync('src/template.pug');

const template = `${pug.compile(pugTemplate, { filename: 'src/template.pug' })}
module.exports = { template };
`;

fs.mkdirSync('./build', { recursive: true });
fs.copyFileSync('src/cli.js', 'build/cli.js');
fs.writeFileSync('build/template.js', template);
