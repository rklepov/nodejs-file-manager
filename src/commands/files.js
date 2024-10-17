// src/commands/filesystem.js

import fs from 'node:fs';
import { rename, stat, unlink } from 'node:fs/promises';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

import { commandsRegister } from '../register.js';
import { Command } from './command.js';

function reportCopy(from, to) {
  const cwd = process.cwd();
  process.stdout.write(
    `${path.relative(cwd, from)} -> ${path.relative(cwd, to)}\n`,
  );
}

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
    return new Promise((resolve, reject) => {
      fs.createWriteStream(filename, { flags: 'wx' })
        .on('error', (e) => reject(e))
        .on('finish', () => resolve(filename))
        .end();
    });
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
    try {
      const entry = await stat(to);
      if (entry.isDirectory()) {
        to = path.join(to, path.basename(from));
      }
    } catch (_) {
      /* ok, assume the target doesn't exist */
    }

    reportCopy(from, to);

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
