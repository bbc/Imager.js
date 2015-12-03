'use strict';

import { getPageOffsetGenerator, isThisElementOnScreen } from '../../src/plugins/lazyload';


describe('plugins/lazyload', function () {
  describe('getPageOffsetGenerator', function () {
    it('should use `window.pageYOffset` if the property is available', function () {
      var pageYOffsetIsAvailable = true;
      var generator = getPageOffsetGenerator(pageYOffsetIsAvailable);

      expect(generator.toString()).to.have.string('.pageYOffset');
    });

    it('should rather use `document.documentElement.scrollTop` if `window.pageYOffset` is not available', function () {
      var pageYOffsetIsAvailable = false;
      var generator = getPageOffsetGenerator(pageYOffsetIsAvailable);

      expect(generator.toString()).to.have.string('.documentElement.scrollTop');
    });
  });

  describe('isThisElementOnScreen', function () {
    let options;

    beforeEach(function () {
      options = {
        lazyloadOffset: 0,
        viewportHeight: 1024
      };
    });

    it('should not detect an element if itself and its parent outreach the viewport height', function () {
      var element = {
        offsetTop:    100,
        offsetParent: {
          offsetTop: 1024
        }
      };

      expect(isThisElementOnScreen(element, options)).to.equal(false);
    });

    it('should detect an element on screen if its offsetPosition is located within the viewport', function () {
      var element = {
        offsetTop:    100,
        offsetParent: {
          offsetTop: 0
        }
      };

      expect(isThisElementOnScreen(element, options)).to.equal(true);
    });

    it('should detect an element on screen if its offsetPosition is out of the viewport but within the viewport+lazyloadOffset', function () {
      var element = {
        offsetTop:    100,
        offsetParent: {
          offsetTop: 1024
        }
      };

      options.lazyloadOffset = 300;

      expect(isThisElementOnScreen(element, options)).to.equal(true);
    });
  });
});
