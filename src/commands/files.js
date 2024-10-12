// src/commands/filesystem.js

import fs from 'node:fs';
import { rename, unlink } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';

import { commandsRegister } from '../register.js';
import { Command } from './command.js';

class Cat extends Command {
  constructor() {
    super('cat', 1);
  }

  async run(filename) {
    await pipeline(fs.createReadStream(filename), process.stdout, {
      end: false,
    });
  }
}

class Create extends Command {
  constructor() {
    super('add', 1);
  }

  async run(filename) {
    fs.createWriteStream(filename, { flags: 'wx' }).end();
  }
}

class Rename extends Command {
  constructor() {
    super('rn', 2);
  }

  async run(from, to) {
    await rename(from, to);
  }
}

class Copy extends Command {
  constructor() {
    super('cp', 2);
  }

  async run(from, to) {
    await pipeline(
      fs.createReadStream(from),
      fs.createWriteStream(to, { flags: 'wx' }),
    );
  }
}

class Move extends Command {
  constructor() {
    super('mv', 2);
    this.copy = new Copy();
  }

  async run(from, to) {
    await this.copy.run(from, to);
    await unlink(from);
  }
}

class Delete extends Command {
  constructor() {
    super('rm', 1);
  }

  async run(target) {
    await unlink(target);
  }
}

[Cat, Create, Rename, Copy, Move, Delete].forEach((ctor) =>
  commandsRegister.add(new ctor()),
);

//__EOF__
