const pug = require('pug');
const fs = require('fs');

const pugTemplate = fs.readFileSync('src/output/template.pug');

const template = `${pug.compile(pugTemplate, { filename: 'src/output/template.pug', compileDebug: false })}
module.exports = { template };
`;

fs.mkdirSync('./build', { recursive: true });
fs.copyFileSync('src/cli/index.js', 'build/cli.js');
fs.copyFileSync('src/cli/parse.js', 'build/parse.js');
fs.copyFileSync('src/cli/transform.js', 'build/transform.js');
fs.writeFileSync('build/template.js', template);
