// src/commands/command.js

import { InvalidInput, OperationFailure } from '../exception.js';

export class Command {
  constructor(name, argc) {
    this.name = name;
    this.argc = argc;
  }

  async execute(cmd, ...args) {
    args = this.validate(cmd, ...args);

    try {
      await this.run(...args);
    } catch (error) {
      throw new OperationFailure(error.message);
    }

    return { exit: false };
  }

  validate(cmd, ...args) {
    if (args.length !== this.argc) {
      throw new InvalidInput(
        `'${cmd}' expects ${this.argc} argument(s) (${args.length} provided)`,
      );
    }
    return args;
  }
}

//__EOF__
