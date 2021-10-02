const indentName = (name, level) => {
  const numberSpaces = level * 2;
  const padding =  ''.padStart(numberSpaces, ' ');
  return `${padding}${name}`;
}

const backspaces = ''.padStart(5, "\u0008");

export class Test {
  constructor(name, fn, options, level) {
    this.name = name;
    this.fn = fn;
    this.options = options;
    this.level = level;
  }

  printedName(contextPrefix) {
    const name = indentName(this.name, this.level);
    return `${backspaces}${contextPrefix}${name}`
  }

  run(contextPrefix) {
    Deno.test({
      ...this.options,
      name: this.printedName(contextPrefix),
      fn: this.fn
    })
  }
}

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
        context.level + 1
      )
    )
  }

  addContext(name, setupContext) {
    this.currentIndex += 1;
    this.contexts.push(new Context(name, this.currentIndex));
    setupContext();
    this.currentIndex -= 1;
  }

  prefix(index) {
    if (index !== 0) return ''
    return `${indentName(this.name, this.level)}\n`
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
