import { pixelRatio, width } from '../../src/transforms'

describe('transforms', () => {
  describe('pixelRatio', () => {
    it('should transform 1 into ""', function () {
      expect(pixelRatio(1)).to.equal('');
    });

    it('should transform 1.5 into "-1.5x"', function () {
      expect(pixelRatio(1.5)).to.equal('-1.5x');
    });
  });

  describe('width', () => {
    it('return its own value if not found in the map', function () {
      expect(width(250)).to.equal(250);
    });

    it('should return the map value if found', function () {
      const map = { 250: '_o' };

      expect(width(250, map)).to.equal('_o');
    });
  });
});
