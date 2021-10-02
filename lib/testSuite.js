import { Context } from "./context.js";

export const testSuite = () => {
  const suite = new Context("");

  return {
    it: (name, fn) => suite.addTest(name, fn, {}),
    test: (name, fn) => suite.addTest(name, fn, {}),
    only: (name, fn) => suite.addTest(name, fn, { only: true }),
    xit: (name, fn) => suite.addTest(name, fn, { ignore: true }),
    describe: (name, fn) => suite.addContext(name, fn),
    context: (name, fn) => suite.addContext(name, fn),
    run: async () => await suite.run(),
    suite: suite,
  };
};
