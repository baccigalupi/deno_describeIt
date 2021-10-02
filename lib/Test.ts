import { TestSetupFunction } from "./types.ts";
import { backspaces, indentName } from "./printing.ts";

export class Test {
  name: string;
  fn: TestSetupFunction;
  // deno-lint-ignore no-explicit-any
  options: Record<string, any>;
  level: number;

  constructor(
    name: string,
    fn: TestSetupFunction,
    options: Record<string, any>,
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
