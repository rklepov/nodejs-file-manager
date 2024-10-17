// src/commands/nwd.js

import { mkdir, readdir } from 'node:fs/promises';
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

class Mkdir extends Command {
  constructor() {
    super('md', 1);
  }

  async run(path) {
    await mkdir(path);
  }
}

class List extends Command {
  constructor() {
    super('ls', 0);
  }

  async run() {
    const entries = await readdir(cwd(), { withFileTypes: true });

    const listing = entries
      .map((entry) => {
        return { Name: entry.name, Type: this.getDirEntryType(entry) };
      })
      .sort((a, b) => {
        let cmp = a.Type.localeCompare(b.Type);
        if (cmp === 0) {
          cmp = a.Name.localeCompare(b.Name);
        }
        return cmp;
      });

    this.prettyPrint(listing);
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

  prettyPrint(listing) {
    console.table(listing);
  }
}

[Up, Chdir, List, Mkdir].forEach((ctor) => commandsRegister.add(new ctor()));

//__EOF__
