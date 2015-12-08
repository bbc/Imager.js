'use strict';

import Imager from '../../index';
import { getClosestValue } from '../../src/calc'
import { getPixelRatio } from '../../src/dom'
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

    it('should have an initialised status "onReady"', function (done) {
      new Imager('.delayed-image-load').ready(imgr => {
        expect(imgr.initialized).to.equal(true);
        done();
      })
    });

    it('should initialise without arguments', function (done) {
      fixtures = loadFixtures('regular');
      var imgr = new Imager('.delayed-image-load');

      imgr.ready(function () {
        expect(imgr.scrolled).to.be(undefined);
        expect(imgr.divs).to.have.length(5);

        done();
      });
    });

    it('should target elements with a string as first argument', function (done) {
      fixtures = loadFixtures('regular');
      var imgr = new Imager('#main .delayed-image-load');

      imgr.ready(function () {
        expect(imgr.divs).to.have.length(3);

        done();
      });
    });

    it('should target elements contained in a static NodeList collection', function (done) {
      fixtures = loadFixtures('regular');
      var imgr = new Imager(document.querySelectorAll('#main .delayed-image-load'));

      imgr.ready(function () {
        expect(imgr.divs).to.have.length(3);

        done();
      });
    });

    it('should target elements contained in a live NodeList collection', function (done) {
      fixtures = loadFixtures('regular');
      var imgr = new Imager(document.getElementById('main').getElementsByTagName('div'));

      imgr.ready(function () {
        expect(imgr.divs).to.have.length(3);

        done();
      });
    });

    it('should target elements contained in a third-party library collection', function (done) {
      fixtures = loadFixtures('regular');
      var imgr = new Imager(jQuery('#main .delayed-image-load'));

      imgr.ready(function () {
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

        imgr.add([].slice.call(elements));
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
    var imgr, availableWidths = [320, 640, 1024];

    beforeEach(function () {
      fixtures = loadFixtures('widths');
      imgr = new Imager('.delayed-image-load', { availableWidths });
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

  describe('devicePixelRatio', function () {
    it('should compute and store a device specific devicePixelRatio after initialisation', function (done) {
      (new Imager('.delayed-image-load')).ready((imgr) => {
        expect(imgr.devicePixelRatio).to.be.within(1, Infinity);
        done();
      });
    });
  });
});
