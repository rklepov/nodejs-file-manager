// src/main.js

import path from 'node:path';
import { parseArgs } from 'node:util';

const options = { username: { type: 'string', short: 'u' } };

function printUsage(argv) {
  const opt_string = '--username=<your_username>';
  [
    '\nUsage:\n\n',
    'node',
    ' ',
    path.relative(process.cwd(), argv[1]),
    ' ',
    `${opt_string}\n`,
    'or\n',
    'npm run start --',
    ' ',
    `${opt_string}\n\n`,
  ].forEach((s) => process.stdout.write(s));
}

async function main(argv) {
  try {
    const { values } = parseArgs({ args: argv.slice(2), options });

    if (!values.username) {
      throw Error('Please introduce yourself!');
    }
  } catch (error) {
    process.stdout.write(`${error.message}\n`);
    printUsage(argv);
    return 1;
  }

  return 0;
}

process.exitCode = await main(process.argv);

// __EOF__
