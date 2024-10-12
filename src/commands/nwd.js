// src/commands/nwd.js

import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { chdir, cwd } from 'node:process';

import { commandsRegister } from '../register.js';
import { Command } from './command.js';

class Up extends Command {
  constructor() {
    super('up', 0);
  }

  async run() {
    chdir(path.dirname(cwd()));
  }
}

class Chdir extends Command {
  constructor() {
    super('cd', 1);
  }

  async run(path) {
    chdir(path);
  }
}

class List extends Command {
  constructor() {
    super('ls', 0);
  }

  async run() {
    const entries = await readdir(cwd(), { withFileTypes: true });

    entries
      .map((entry) => {
        return { name: entry.name, type: this.getDirEntryType(entry) };
      })
      .sort((a, b) => {
        let cmp = a.type.localeCompare(b.type);
        if (cmp === 0) {
          cmp = a.name.localeCompare(b.name);
        }
        return cmp;
      })
      .forEach((entry, ix) => {
        this.prettyPrint(entry, ix);
      });
  }

  getDirEntryType(entry) {
    return [
      'is-Block-Device',
      'is-Character-Device',
      'is-Directory',
      'is-FIFO',
      'is-File',
      'is-Socket',
      'is-Symbolic-Link',
    ].reduce((type, test) => {
      if (!type && entry[test.replace(/-/g, '')]()) {
        type = test
          .split('-')
          .slice(1)
          .map((s) => s.toLowerCase())
          .join(' ');
      }
      return type;
    }, '');
  }

  prettyPrint(entry, ix) {
    process.stdout.write(`${ix} ${entry.name} ${entry.type}\n`);
  }
}

[Up, Chdir, List].forEach((ctor) => commandsRegister.add(new ctor()));

//__EOF__
