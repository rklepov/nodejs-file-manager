// src/commands/hash.js

import crypto from 'crypto';
import fs from 'node:fs';
import { pipeline } from 'node:stream/promises';

import { commandsRegister } from '../register.js';
import { Command } from './command.js';

class Hash extends Command {
  constructor() {
    super('hash', 1);
  }

  async run(path) {
    await pipeline(
      fs.createReadStream(path).on('close', () => {
        process.stdout.write('\n');
      }),
      crypto.createHash('sha256').setEncoding('hex'),
      process.stdout,
      { end: false },
    );
  }
}

commandsRegister.add(new Hash());

//__EOF__
