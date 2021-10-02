# Deno DescribeIt

This is a small dependency free library for nesting tests. It handles
both the writing of nested test, and the printing in an outline form.

It wraps the underlying `Deno.test` library.

## About dependencies

The harderst part of using Deno currently is that Deno/TS usage
breaks with different versions of the std libs. Third party libs
that use std or other libraries similarly break. I have found this
esepcially true when it comes to working with ts and the dom.

The other thing about Deno and testing that is hard is that they
haven't yet abstracted the printing format so that alternative
formats are possible. So, there is a hidden dependencies on
the existing formatting, because this library and `Rhum` do
some fancy backspace printing magic to remove the 'test ' prefix
that Deno insists on, and allow some nesting.

## Usage

This isn't published in Deno land, but you can require it via the
github url

    import { testSuite } from 'https://raw.githubusercontent.com/baccigalupi/deno_describeIt/main/lib/testSuite.ts';

Mocha and it's magical global runner spoiled us, and to easily maintain
independent state per test file, the top level library is a function that
adds context:

    const { xit, it, describe, run } = testSuite();

    describe("Testy things", () => {
      it("is very true that you can test this way", () => {
        // assuming deno asserts have been imported
        assert(true);
      });

      xit("you can also postpone getting a test to work", () => {
        assert(false);
      });
    });

    await run();

Alternatively, you can use the suite object returned direrctly:

    const suite = testSuite();

    suite.describe("Testy things", () => {
      suite.it("is very true that you can test this way", () => {
        // assuming deno asserts have been imported
        assert(true);
      });

      suite.xit("you can also postpone getting a test to work", () => {
        assert(false);
      });
    });

    await suite.run();

### Methods

This is a list of methods available on the suite object:

- `describe`: Creates a test context for nesting tests. It can be arbirtarily deep.
- `context`: This is an alias for `describe` to allow different dsl happiness.
- `it`: Creates a test definition.
- `test`: Alias for `it`.
- `xit`: Temporarily ignores this test.
- `only`: Focuses this (and other only tests) so that others are temporarily ignored.
- `run`: This has to be called at the end of the file so that the suite actualy runs. Otherwise, it defines the tests, but never calls them.

## Possible next steps

- `beforeEach` and `afterEach`
- Alternative printing to accomodate CI and other places that balk at backspacing
