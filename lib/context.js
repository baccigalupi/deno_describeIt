import { indentName } from "./printing.ts";
import { Test } from "./Test.ts";

export class Context {
  constructor(name, level = 0) {
    this.name = name;
    this.tests = [];
    this.contexts = [];
    this.currentIndex = -1;
    this.level = level;
  }

  addTest(name, fn, options = {}) {
    const context = this.currentContext();
    context.tests.push(
      new Test(
        name,
        fn,
        options,
        context.level + 1,
      ),
    );
  }

  addContext(name, setupContext) {
    this.currentIndex += 1;
    this.contexts.push(new Context(name, this.currentIndex));
    setupContext();
    this.currentIndex -= 1;
  }

  prefix(index) {
    if (index !== 0) return "";
    return `${indentName(this.name, this.level)}\n`;
  }

  run() {
    this.tests.forEach((test, index) => {
      test.run(this.prefix(index));
    });

    this.contexts.forEach((context) => {
      context.run();
    });
  }

  currentContext() {
    return this.contexts[this.currentIndex] || this;
  }
}
