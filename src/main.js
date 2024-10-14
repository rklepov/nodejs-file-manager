// src/main.js

import os from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';

import { commandsRegister } from './register.js';

import './commands/compress.js';
import './commands/exit.js';
import './commands/files.js';
import './commands/hash.js';
import './commands/nwd.js';
import './commands/os.js';

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

function prompt() {
  process.stdout.write(`\nYou are currently in [${process.cwd()}]\n> `);
}

async function main(argv) {
  let username = '';
  try {
    const { values } = parseArgs({ args: argv.slice(2), options });

    if (!values.username) {
      throw Error('Please introduce yourself!');
    }

    ({ username } = values);
  } catch (error) {
    process.stdout.write(`${error.message}\n`);
    printUsage(argv);
    return 1;
  }

  process.stdout.write(`Welcome to the File Manager, ${username}!\n`);

  process.on('exit', () => {
    process.stdout.write(
      `\nThank you for using File Manager, ${username}, goodbye!\n`,
    );
  });

  process.on('SIGINT', () => {
    // eslint-disable-next-line n/no-process-exit
    process.exit();
  });

  process.chdir(os.homedir());

  prompt();

  for await (const input of process.stdin) {
    const line = input
      .toString()
      .replaceAll(/\s+(?=([^"]*"[^"]*")*[^"]*$)/g, '\0'); // https://stackoverflow.com/a/9584469/10488248

    const command = line
      .trim()
      .split('\0')
      .slice(0, -1)
      .map((s) => s.replace(/^"(.+(?="$))"$/, '$1')); // https://stackoverflow.com/a/19156197/10488248

    if (command[0]) {
      const handler = commandsRegister.find(command[0]);
      try {
        const { exit } = await handler.execute(...command);
        if (exit) break;
      } catch (error) {
        process.stderr.write(`${error.message}\n`);
      }
    }

    prompt();
  }

  return 0;
}

process.exitCode = await main(process.argv);

// __EOF__
