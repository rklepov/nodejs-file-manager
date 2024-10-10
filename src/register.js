// src/commands/register.js

class UnknownCommand {
  async execute(cmd) {
    process.stdout.write(`Invalid input: '${cmd}'\n`);
    process.stdout.write('Supported commands:\n');

    [...commandsRegister.listCommands()]
      .sort((a, b) => {
        return a.localeCompare(b);
      })
      .forEach((name) => process.stdout.write(`${name}\n`));

    return { exit: false };
  }
}

class Register {
  find(command) {
    const handler = this.handlers.get(command);

    if (handler) {
      return handler;
    } else {
      return this.unknown_handler;
    }
  }

  add(command) {
    this.handlers.set(command.name, command);
    return this;
  }

  *listCommands() {
    for (let [name] of this.handlers) {
      yield name;
    }
  }

  handlers = new Map();

  unknown_handler = new UnknownCommand();
}

export const commandsRegister = new Register();

// __EOF__
