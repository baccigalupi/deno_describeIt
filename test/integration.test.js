import { assert, assertEquals } from 'https://deno.land/std/testing/asserts.ts';

import { testSuite } from '../lib/testSuite.js';

const { it, xit, test, describe, context, run, _self } = testSuite();

const testIds = [];

describe('Integration testing this it/describe stuff', () => {
  it('level 1: it runs', () => {
    testIds.push('1:1');
    assert(_self.currentIndex, 1);
  });

  test('level 1: second tests runs', () => {
    testIds.push('1:2');
    assert(true);
  });

  context('when things go one level deep', () => {
    it('level 2: still runs the it block', () => {
      testIds.push('2:1');
      assert(true);
    });

    describe('going arbitrarily deep', () => {
      it('level 3: also works', () => {
        testIds.push('3:1');
        assert(true);
      })

      xit('level 3: ignore xits', () => {
        testIds.push('3:0');
        assert(true);
      })

      it('level 3: runs after an xit', () => {
        testIds.push('3:2');
        assert(true);
      })
    });
  
    test('level 2: and it runs after a context indent', () => {
      testIds.push('2:2');
      assert(true);
    });
  });

  test('level 1 again: runs all the ones per level at once, regardless of definition order', () => {
    testIds.push('1:3');
    assert(true);
  });
});

run();

Deno.test('all the tests were run in the right order', () => {
  assertEquals(testIds, ['1:1', '1:2', '1:3', '2:1', '2:2', '3:1', '3:2'])
});