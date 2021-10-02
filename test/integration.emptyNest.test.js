import { assert, assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { testSuite } from "../lib/testSuite.ts";

const { it, describe, suite } = testSuite();

describe("Outer description", () => {
  describe("Layer 1", () => {
    describe("Layer 2", () => {
      it("test description", () => {
        assert(true);
      });
    });
  });
});

Deno.test('empty nest have the right setup of contexts', () => {
  let contexts = suite.contexts;
  assertEquals(contexts.length, 1);
  assertEquals(contexts[0].name, "Outer description");
  assertEquals(contexts[0].level, 0);

  contexts = suite.contexts[0].contexts
  assertEquals(contexts.length, 1);
  assertEquals(contexts[0].name, "Layer 1");
  assertEquals(contexts[0].level, 1);

  contexts = suite.contexts[0].contexts[0].contexts;
  assertEquals(contexts.length, 1);
  assertEquals(contexts[0].name, "Layer 2");
  assertEquals(contexts[0].level, 2);

  contexts = suite.contexts[0].contexts[0].contexts[0].contexts
  assertEquals(contexts.length, 0);
});

Deno.test('empty nests put the test in the right place', () => {
  assertEquals(suite.contexts[0].contexts[0].contexts[0].tests.length, 1);
  assertEquals(suite.contexts[0].contexts[0].contexts[0].tests[0].name, "test description");
});
