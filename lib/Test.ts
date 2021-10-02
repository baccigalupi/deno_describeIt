import { TestSetupFunction, TestOptions } from "./types.ts";
import { backspaces, indentName } from "./printing.ts";

export class Test {
  name: string;
  fn: TestSetupFunction;
  options: TestOptions;
  level: number;

  constructor(
    name: string,
    fn: TestSetupFunction,
    options: TestOptions,
    level: number,
  ) {
    this.name = name;
    this.fn = fn;
    this.options = options;
    this.level = level;
  }

  printedName(contextPrefix: string): string {
    const name = indentName(this.name, this.level);
    return `${backspaces}${contextPrefix}${name}`;
  }

  run(contextPrefix: string): MaybeAsync {
    return Deno.test({
      ...this.options,
      name: this.printedName(contextPrefix),
      fn: this.fn,
    });
  }
}
