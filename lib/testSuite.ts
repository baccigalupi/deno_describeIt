import { ContextSetupFunction, TestSetupFunction } from "./types.ts";
import { Context } from "./Context.ts";

export const testSuite = () => {
  const suite = new Context("");

  return {
    it: (name: string, fn: TestSetupFunction) => suite.addTest(name, fn, {}),
    test: (name: string, fn: TestSetupFunction) => suite.addTest(name, fn, {}),
    only: (name: string, fn: TestSetupFunction) =>
      suite.addTest(name, fn, { only: true }),
    xit: (name: string, fn: TestSetupFunction) =>
      suite.addTest(name, fn, { ignore: true }),
    describe: (name: string, fn: ContextSetupFunction) =>
      suite.addContext(name, fn),
    context: (name: string, fn: ContextSetupFunction) =>
      suite.addContext(name, fn),
    run: async () => await suite.run(),
    suite: suite,
  };
};
