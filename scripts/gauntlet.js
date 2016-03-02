/**
 * Usage:
 *
 * babel-node scripts/gauntlet.js
 */
import fs from 'fs';
import glob from 'glob';
import inquirer from 'inquirer';

const botdir = __dirname + '/../bots/';

const packages = glob.sync('**/package.json', {cwd: botdir});
const metadata = [];
packages.forEach(packagejson => {
  try {
    metadata.push(JSON.parse(fs.readFileSync(botdir + packagejson, 'utf8')));
  } catch (e) {
    console.log(packagejson, ' did not work.');
    console.log(e);
  }
});
console.log(metadata);

// get all our formats
const formats = new Set();
const names = new Set();
metadata.forEach(pkg => {
  // @TODO see if the pkg is 'ready'?
  formats.add(pkg.format);
  names.add(pkg.name);
});

inquirer.prompt({
  name: 'self',
  message: 'What is your bot\'s name?',
  default: 'stabby',
  type: 'list',
  choices: [...names]
}, (answers1) => {
  const itsFormat = metadata.find(pkg => pkg.name === answers1.self).format;
  inquirer.prompt({
    name: 'format',
    message: 'What format are you battling?',
    default: itsFormat,
    type: 'list',
    choices: [...formats]
  }, (answers2) => { // eslint-disable-line
    // valid opponents only
    const opponents = metadata.filter(pkg => pkg.accepts === 'ALL' ||
      pkg.accepts.indexOf(answers2.format) >= 0).map( (pkg) => {
        return {
          name: `${pkg.name} - ${pkg.description}`,
          value: pkg.name,
          checked: true
        };
      }
    );

    inquirer.prompt({
      name: 'opponents',
      message: 'Choose your opponents!',
      choices: opponents,
      type: 'checkbox'
    }, (answers3) => { // eslint-disable-line
      console.log(answers3);
    });
  });
});
