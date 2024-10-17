// src/commands/compress.js

import fs from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';

import { commandsRegister } from '../register.js';
import { Command } from './command.js';

class Compress extends Command {
  constructor() {
    super('compress', 2);
  }

  async run(source, target) {
    await pipeline(
      fs.createReadStream(source),
      createBrotliCompress(),
      fs.createWriteStream(target, { flags: 'wx' }),
    );
  }
}

class Decompress extends Command {
  constructor() {
    super('decompress', 2);
  }

  async run(source, target) {
    await pipeline(
      fs.createReadStream(source),
      createBrotliDecompress(),
      fs.createWriteStream(target, { flags: 'wx' }),
    );
  }
}

[Compress, Decompress].forEach((ctor) => commandsRegister.add(new ctor()));

//__EOF__
