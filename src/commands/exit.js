// src/commands/exit.js

import { commandsRegister } from '../register.js';
import { Command } from './command.js';

class Exit extends Command {
  constructor() {
    super('.exit', 0);
  }

  async execute() {
    return { exit: true };
  }
}

commandsRegister.add(new Exit());

//__EOF__
