import { Context } from './context.js';

export const testSuite = () => {
  const context = new Context('');

  return {
    it: (name, fn) => context.addTest(name, fn, {}),
    test: (name, fn) => context.addTest(name, fn, {}),
    only: (name, fn) => context.addTest(name, fn, {only: true}),
    xit: (name, fn) => context.addTest(name, fn, {ignore: true}),
    describe: (name, fn) => context.addContext(name, fn),
    context: (name, fn) => context.addContext(name, fn),
    run: async () => await context.run(),
    _self: context,
  }
};