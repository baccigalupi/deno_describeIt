import { TestSetupFunction, TestOptions, ContextSetupFunction, Runs } from './types.ts';
import { indentName } from "./printing.ts";
import { Test } from "./Test.ts";

export class Context {
  name: string;
  level: number;
  tests: Array<Test>;
  contexts: Array<Context>;
  currentIndex: number;
  currentContext: Context;

  constructor(name: string, level = -1) {
    this.name = name;
    this.tests = [];
    this.contexts = [];
    this.currentIndex = -1;
    this.currentContext = this;
    this.level = level;
  }

  addTest(name: string, fn: TestSetupFunction, options: TestOptions = {}) {
    this.currentContext.tests.push(
      new Test(
        name,
        fn,
        options,
        this.currentContext.level + 1,
      ),
    );
  }

  addContext(name: string, setupContext: ContextSetupFunction) {
    this.currentContext.add(name, setupContext, this);
  }

  add(name: string, setupContext: ContextSetupFunction, root: Context) {
    this.currentIndex += 1;
    const previousContext = this.currentContext;
    const currentContext = new Context(name, previousContext.level + 1)
    this.contexts.push(currentContext);
    root.currentContext = currentContext;
    setupContext();
    root.currentContext = previousContext;
    this.currentIndex -= 1;
  }

  prefix(index: number): string {
    if (index !== 0) return "";
    return `${indentName(this.name, this.level)}\n`;
  }

  // deno-lint-ignore no-explicit-any
  run(): Promise<any> {
    const promises: Runs = this.tests.map((test, index) => {
      return test.run(this.prefix(index));
    });

    this.contexts.forEach((context) => {
      promises.push(context.run());
    });

    return Promise.all(promises);
  }
}
