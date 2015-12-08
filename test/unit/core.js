'use strict';

import Imager from '../../index';
import { getClosestValue } from '../../src/calc'
import { applyEach } from '../../src/shims'
import { loadFixtures, cleanFixtures } from '../helpers';

import jQuery from 'jquery';

describe('Imager.js', function () {
  var fixtures, sandbox;

  beforeEach(function () {
    fixtures = undefined;
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
    cleanFixtures(fixtures);
  });

  describe('constructor', function () {
    it('should raise if the first argument is not provided', function () {
      expect(function(){ new Imager() }).to.throwError();
    });

    it('should initialise without arguments', function (done) {
      fixtures = loadFixtures('regular');
      var imgr = new Imager('.delayed-image-load');

      imgr.ready(function () {
        expect(imgr.initialized).to.equal(true);
        expect(imgr.scrolled).to.be(undefined);
        expect(imgr.divs).to.have.length(5);

        done();
      });
    });

    it('should target elements with a string as first argument', function (done) {
      fixtures = loadFixtures('regular');
      var imgr = new Imager('#main .delayed-image-load');

      imgr.ready(function () {
        expect(imgr.initialized).to.equal(true);
        expect(imgr.divs).to.have.length(3);

        done();
      });
    });

    it('should target elements contained in a static NodeList collection', function (done) {
      fixtures = loadFixtures('regular');
      var imgr = new Imager(document.querySelectorAll('#main .delayed-image-load'));

      imgr.ready(function () {
        expect(imgr.initialized).to.equal(true);
        expect(imgr.divs).to.have.length(3);

        done();
      });
    });

    it('should target elements contained in a live NodeList collection', function (done) {
      fixtures = loadFixtures('regular');
      var imgr = new Imager(document.getElementById('main').getElementsByTagName('div'));

      imgr.ready(function () {
        expect(imgr.initialized).to.equal(true);
        expect(imgr.divs).to.have.length(3);

        done();
      });
    });

    it('should target elements contained in a third-party library collection', function (done) {
      fixtures = loadFixtures('regular');
      var imgr = new Imager(jQuery('#main .delayed-image-load'));

      imgr.ready(function () {
        expect(imgr.initialized).to.equal(true);
        expect(imgr.divs).to.have.length(3);

        done();
      });
    });
  });

  describe('add', function () {

    it('should add additional images based on a custom selector', function (done) {
      fixtures = loadFixtures('add');
      var imgr = new Imager('.delayed-image-load');
      imgr.ready(function () {
        expect(imgr.divs).to.have.length(2);
        imgr.add('.triggered-image-load');
        expect(imgr.divs).to.have.length(4);
        done();
      });
    });

    it('should raise if no parameter is given', function () {
      var imgr = new Imager('.delayed-image-load');
      expect(() => imgr.add()).to.throwError();
    });

    it('should add additional images based on NodeList passed in', function (done) {
      fixtures = loadFixtures('add');
      var imgr = new Imager('.delayed-image-load');
      imgr.ready(function () {

        imgr.add(document.querySelectorAll('#test-case div'));
        expect(imgr.divs).to.have.length(4);
        done();
      });
    });

    it('should add additional images based on Node array passed in', function (done) {
      fixtures = loadFixtures('add');
      var imgr = new Imager('.delayed-image-load');
      imgr.ready(function () {
        var elements = document.querySelectorAll('#test-case div');
        elements = applyEach(elements, element => element);

        imgr.add(elements);
        expect(imgr.divs).to.have.length(4);
        done();
      });
    });

    it('should handle "null" selector scenario gracefully', function () {
      fixtures = loadFixtures('add');
      var imgr = new Imager([]);

      expect(() => imgr.add(null)).to.throwError();
    });
  });

  describe('determineAppropriateResolution', function () {
    var imgr, windowWidth, availableWidths = [320, 640, 1024];

    beforeEach(function () {
      fixtures = loadFixtures('widths');
      imgr = new Imager('.delayed-image-load', {availableWidths: availableWidths});
      windowWidth = window.innerWidth;
    });

    it('should pick the closest value from the container\'s width (no container size)', function () {
      var maxContainerWidth = getClosestValue(windowWidth, availableWidths);
      expect(imgr.determineAppropriateResolution(imgr.divs[0])).to.equal(maxContainerWidth);
    });

    it('should pick the data-width and not the container\'s size (no container size)', function () {
      expect(imgr.determineAppropriateResolution(imgr.divs[1])).to.equal(640);
    });

    it('should pick the closest value from the container\'s width (container\'s size contained in availableWidths)', function () {
      expect(imgr.determineAppropriateResolution(imgr.divs[2])).to.equal(640);
    });

    it('should pick the data-width and not the container\'s size (container\'s size contained in availableWidths)', function () {
      expect(imgr.determineAppropriateResolution(imgr.divs[3])).to.equal(640);
    });

    it('should pick the closest value from the container\'s width (container\'s size smaller than availableWidths)', function () {
      expect(imgr.determineAppropriateResolution(imgr.divs[4])).to.equal(320);
    });

    it('should pick the data-width and not the container\'s size (container\'s size smaller than availableWidths)', function () {
      expect(imgr.determineAppropriateResolution(imgr.divs[5])).to.equal(640);
    });
  });

  xdescribe('devicePixelRatio', function () {
    var imgrOptions = {availablePixelRatios: [1, 1.3, 2]};

    it('should pick a value of 1 if the device pixel ratio is lower than 1', function () {
      sandbox.stub(Imager, 'getPixelRatio', function () {
        return 0.8
      });
      expect(new Imager(imgrOptions)).to.have.property('devicePixelRatio', 1);
    });

    it('should pick a value of 1.3 if the device pixel ratio is equal to 1.3', function () {
      sandbox.stub(Imager, 'getPixelRatio', function () {
        return 1.3
      });
      expect(new Imager(imgrOptions)).to.have.property('devicePixelRatio', 1.3);
    });

    it('should pick the biggest ratio if the device pixel ratio is greater than the biggest available one', function () {
      sandbox.stub(Imager, 'getPixelRatio', function () {
        return 3
      });
      expect(new Imager(imgrOptions)).to.have.property('devicePixelRatio', 2);
    });
  });
});
