import {
  ContextSetupFunction,
  Runs,
  TestOptions,
  TestSetupFunction,
} from "./types.ts";
import { indentName } from "./printing.ts";
import { Test } from "./Test.ts";

export class Context {
  name: string;
  level: number;
  tests: Array<Test>;
  contexts: Array<Context>;
  currentIndex: number;
  currentContext: Context;
  parent: Context | null;

  constructor(name: string, level = -1, parent: Context | null = null) {
    this.name = name;
    this.tests = [];
    this.contexts = [];
    this.currentIndex = -1;
    this.currentContext = this;
    this.level = level;
    this.parent = parent;
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
    const currentContext = new Context(
      name,
      previousContext.level + 1,
      previousContext,
    );
    this.contexts.push(currentContext);
    root.currentContext = currentContext;
    setupContext();
    root.currentContext = previousContext;
    this.currentIndex -= 1;
  }

  description(testNumber: number): string {
    if (testNumber !== 0) return "";
    return this.selfAndParentDescription();
  }

  selfAndParentDescription(): string {
    return `${this.parentDescription()}${this.selfDescription()}`;
  }

  parentDescription() {
    if (!this.parent) return "";
    if (this.parent.hasTests()) return "";
    return this.parent.selfAndParentDescription();
  }

  selfDescription(): string {
    return `${indentName(this.name, this.level)}\n`;
  }

  hasTests(): boolean {
    return this.tests.length > 0;
  }

  // deno-lint-ignore no-explicit-any
  run(): Promise<any> {
    const promises: Runs = this.tests.map((test, index) => {
      return test.run(this.description(index));
    });

    this.contexts.forEach((context) => {
      promises.push(context.run());
    });

    return Promise.all(promises);
  }
}
