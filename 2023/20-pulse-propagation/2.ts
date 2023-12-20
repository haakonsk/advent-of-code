import { beep, readLinesSplit, say } from '../../utils';

console.time();

let foundLowRx = false;

class Pulse {
  constructor(isHigh: boolean, fromModuleName: string, destinationModuleName: string) {
    this.fromModuleName = fromModuleName;
    this.destinationModuleName = destinationModuleName;
    this.isHigh = isHigh;
  }

  isHigh: boolean;
  fromModuleName: string;
  destinationModuleName: string;
}

abstract class Module {
  name: string;
  destinationModuleNames: string[];
  inputModuleNames: string[] = [];

  protected constructor(name: string, destinationModuleNames: string[]) {
    this.name = name;
    this.destinationModuleNames = destinationModuleNames;
  }

  abstract receivePulse(pulse: Pulse): void;
}

class FlipFlopModule extends Module {
  constructor(name, destinationModules) {
    super(name, destinationModules);
  }

  isTurnedOn: boolean = false;

  receivePulse(pulse: Pulse): void {
    if (pulse.isHigh) {
      return;
    }
    this.isTurnedOn = !this.isTurnedOn;
    this.destinationModuleNames.forEach((destinationModuleName) => {
      (modules.broadcaster as BroadcasterModule).addToQueue(new Pulse(this.isTurnedOn, this.name, destinationModuleName));
    });
  }
}

class ConjunctionModule extends Module {
  constructor(name: string, destinationModuleNames: string[]) {
    super(name, destinationModuleNames);
  }

  previousPulses: { [name: string]: Pulse } = {};

  receivePulse(pulse: Pulse): void {
    this.previousPulses[pulse.fromModuleName] = pulse;
    this.destinationModuleNames.forEach((destinationModuleName) => {
      (modules.broadcaster as BroadcasterModule).addToQueue(new Pulse(!this.onlyHighPulses(), this.name, destinationModuleName));
    });
  }

  onlyHighPulses(): boolean {
    return this.inputModuleNames.every((name) => this.previousPulses[name]?.isHigh);
  }
}

class BroadcasterModule extends Module {
  constructor(name, destinationModuleNames) {
    super(name, destinationModuleNames);
  }

  queue: Pulse[] = [];

  receivePulse(pulse: Pulse): void {
    this.destinationModuleNames.forEach((moduleName) => {
      getModule(moduleName).receivePulse(new Pulse(pulse.isHigh, this.name, moduleName));
    });
  }

  addToQueue(pulse: Pulse): void {
    this.queue.push(pulse);
  }

  broadcast(): void {
    while (this.queue.length) {
      const pulse = this.queue.shift();
      getModule(pulse.destinationModuleName).receivePulse(pulse);
    }
  }
}

class ButtonModule extends Module {
  constructor(name, destinationModules) {
    super(name, destinationModules);
  }

  click(): void {
    const broadcaster = this.getBroadcasterModule();
    broadcaster.addToQueue(new Pulse(false, this.name, 'broadcaster'));
    broadcaster.broadcast();
  }

  getBroadcasterModule(): BroadcasterModule {
    return getModule(this.destinationModuleNames[0]) as BroadcasterModule;
  }

  receivePulse(pulse: Pulse): void {}
}

class OutputModule extends Module {
  constructor(name, destinationModules) {
    super(name, destinationModules);
  }

  receivePulse(pulse: Pulse): void {
    if (!pulse.isHigh) {
      say('found!');
      foundLowRx = true;
    }
  }
}

const modules: { [name: string]: Module } = {};

readLinesSplit('input.txt', ' -> ').forEach(([moduleStr, destinationModulesStr]) => {
  const destinationModuleNames = destinationModulesStr.split(', ');

  if (moduleStr.toString().startsWith('%')) {
    const name = moduleStr.toString().substring(1);
    modules[name] = new FlipFlopModule(name, destinationModuleNames);
  } if (moduleStr.toString().startsWith('&')) {
    const name = moduleStr.toString().substring(1);
    modules[name] = new ConjunctionModule(name, destinationModuleNames);
  } else if (moduleStr.toString() === 'broadcaster') {
    modules.broadcaster = new BroadcasterModule('broadcaster', destinationModuleNames);
  }
});

modules.output = new OutputModule('output', []);

Object.entries(modules).forEach(([name, module]) => {
  module.destinationModuleNames.forEach((destinationModuleName) => {
    (modules[destinationModuleName] || modules.output).inputModuleNames.push(name);
  })
});

const buttonModule = new ButtonModule('button', ['broadcaster']);
let i = 0;
while (true) {
  buttonModule.click();
  i++;
  if (i % 10000000 === 0) {
    say(i);
    console.timeLog();
  }
  if (foundLowRx) {
    say('Found', i);
    beep();
    break;
  }
}

function getModule(name: string): Module {
  return modules[name] ?? modules.output;
}
