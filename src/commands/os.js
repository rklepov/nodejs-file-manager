// src/commands/os.js

import os from 'node:os';
import { parseArgs } from 'node:util';

import { InvalidInput } from '../exception.js';
import { commandsRegister } from '../register.js';
import { Command } from './command.js';

const options = {
  EOL: {
    type: 'boolean',
  },
  cpus: {
    type: 'boolean',
  },
  homedir: {
    type: 'boolean',
  },
  username: {
    type: 'boolean',
  },
  architecture: {
    type: 'boolean',
  },
};

class OS extends Command {
  constructor() {
    super('os', 1);
  }

  run(...args) {
    const [request] = args;
    const { EOL, cpus, homedir, username, architecture } = request;

    if (EOL) {
      process.stdout.write(`EOL: ${JSON.stringify(os.EOL)}\n`);
    }
    if (cpus) {
      process.stdout.write(`#CPU: ${os.cpus().length}\n`);
      os.cpus().forEach((cpu, ix) => {
        process.stdout.write(`${ix}: ${cpu.model} (${cpu.speed}MHz)\n`);
      });
    }
    if (homedir) {
      process.stdout.write(`Home: ${os.homedir()}\n`);
    }
    if (username) {
      process.stdout.write(`User: ${os.userInfo().username}\n`);
    }
    if (architecture) {
      process.stdout.write(`Arch: ${os.arch()}\n`);
    }
  }

  validate(cmd, ...args) {
    if (args.length === 0) {
      return super.validate(cmd, ...args);
    }

    try {
      const { values } = parseArgs({ args, options });
      return [values];
    } catch (e) {
      const message = Object.keys(options)
        .sort((a, b) => {
          return a.localeCompare(b);
        })
        .reduce((s, opt) => {
          s = `${s}\n${opt}`;
          return s;
        }, `${e.message}\nAvailable options:`);

      throw new InvalidInput(message);
    }
  }
}

commandsRegister.add(new OS());

//__EOF__
