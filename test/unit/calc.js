'use strict';

import { getClosestValue } from '../../src/calc'
import { loadFixtures, cleanFixtures } from '../helpers';


describe('calc', function () {
  describe('getClosestValue', function () {
    const availableWidths = [320, 640, 1024];

    it('should select the smallest value if (lowest) out of band', function () {
      expect(getClosestValue(319, availableWidths)).to.equal(320);
    });

    it('should select the same value amongst many ', function () {
      expect(getClosestValue(320, availableWidths)).to.equal(320);
    });

    it('should select the closest upper value amongst many', function () {
      expect(getClosestValue(321, availableWidths)).to.equal(640);
    });

    it('should select the uppest value if (upper) out of band', function () {
      expect(getClosestValue(1025, availableWidths)).to.equal(1024);
    });
  });
});
