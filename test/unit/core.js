'use strict';

/* globals describe, beforeEach, afterEach, it, expect, Imager, jQuery, document, sinon */

describe('Imager.js', function () {
    var fixtures, sandbox;

    beforeEach(function(){
      fixtures = undefined;
      sandbox = sinon.sandbox.create();
    });

    afterEach(function(){
      sandbox.restore();
      cleanFixtures(fixtures);
    });

    describe('constructor', function () {
        it('should initialise without arguments', function (done) {
            fixtures = loadFixtures('regular');
            var imgr = new Imager();

            runAfterAnimationFrame(function () {
                expect(imgr.initialized).to.equal(true);
                expect(imgr.scrolled).to.equal(false);
                expect(imgr.divs).to.have.length(5);
                expect(imgr.selector).to.equal('.delayed-image-load');

                done();
            });
        });

        it('should initialise with one argument, the options', function () {
            fixtures = loadFixtures('regular');
            var imgr = new Imager({ selector: '#main .delayed-image-load' });

            expect(imgr.divs).to.have.length(3);
            expect(imgr.selector).to.equal('#main .delayed-image-load');
        });

        it('should target elements with a string as first argument', function (done) {
            fixtures = loadFixtures('regular');
            var imgr = new Imager('#main .delayed-image-load');

            runAfterAnimationFrame(function () {
                expect(imgr.initialized).to.equal(true);
                expect(imgr.scrolled).to.equal(false);
                expect(imgr.divs).to.have.length(3);
                expect(imgr.selector).to.equal('#main .delayed-image-load');

                done();
            });
        });

        it('should target elements contained in a static NodeList collection', function (done) {
            fixtures = loadFixtures('regular');
            var imgr = new Imager(document.querySelectorAll('#main .delayed-image-load'));

            runAfterAnimationFrame(function () {
                expect(imgr.initialized).to.equal(true);
                expect(imgr.scrolled).to.equal(false);
                expect(imgr.divs).to.have.length(3);
                expect(imgr.selector).to.equal(null);

                done();
            });
        });

        it('should target elements contained in a live NodeList collection', function (done) {
            fixtures = loadFixtures('regular');
            var imgr = new Imager(document.getElementById('main').getElementsByTagName('div'));

            runAfterAnimationFrame(function () {
                expect(imgr.initialized).to.equal(true);
                expect(imgr.scrolled).to.equal(false);
                expect(imgr.divs).to.have.length(3);
                expect(imgr.selector).to.equal(null);

                done();
            });
        });

        it('should target elements contained in a third-party library collection', function (done) {
            fixtures = loadFixtures('regular');
            var imgr = new Imager(jQuery('#main .delayed-image-load'));

            runAfterAnimationFrame(function () {
                expect(imgr.initialized).to.equal(true);
                expect(imgr.scrolled).to.equal(false);
                expect(imgr.divs).to.have.length(3);
                expect(imgr.selector).to.equal(null);

                done();
            });
        });
    });

    describe('determineAppropriateResolution', function () {
        var imgr, windowWidth, availableWidths = [320, 640, 1024];

        beforeEach(function(){
            fixtures = loadFixtures('widths');
            imgr = new Imager({ availableWidths: availableWidths });
            windowWidth = window.innerWidth;
        });

        it('should pick the closest value from the container\'s width (no container size)', function(){
          var maxContainerWidth = Imager.getClosestValue(windowWidth, availableWidths);
          expect(imgr.determineAppropriateResolution(imgr.divs[0])).to.equal(maxContainerWidth);
        });

        it('should pick the data-width and not the container\'s size (no container size)', function(){
          expect(imgr.determineAppropriateResolution(imgr.divs[1])).to.equal(640);
        });

        it('should pick the closest value from the container\'s width (container\'s size contained in availableWidths)', function(){
          expect(imgr.determineAppropriateResolution(imgr.divs[2])).to.equal(640);
        });

        it('should pick the data-width and not the container\'s size (container\'s size contained in availableWidths)', function(){
          expect(imgr.determineAppropriateResolution(imgr.divs[3])).to.equal(640);
        });

        it('should pick the closest value from the container\'s width (container\'s size smaller than availableWidths)', function(){
          expect(imgr.determineAppropriateResolution(imgr.divs[4])).to.equal(320);
        });

        it('should pick the data-width and not the container\'s size (container\'s size smaller than availableWidths)', function(){
          expect(imgr.determineAppropriateResolution(imgr.divs[5])).to.equal(640);
        });
    });

    describe('devicePixelRatio', function(){
        var imgrOptions = { availablePixelRatios: [1, 1.3, 2] };

        it('should pick a value of 1 if the device pixel ratio is lower than 1', function(){
            sandbox.stub(Imager, 'getPixelRatio', function(){ return 0.8 });
            expect(new Imager(imgrOptions)).to.have.property('devicePixelRatio', 1);
        });

        it('should pick a value of 1.3 if the device pixel ratio is equal to 1.3', function(){
            sandbox.stub(Imager, 'getPixelRatio', function(){ return 1.3 });
            expect(new Imager(imgrOptions)).to.have.property('devicePixelRatio', 1.3);
        });

        it('should pick the biggest ratio if the device pixel ratio is greater than the biggest available one', function(){
            sandbox.stub(Imager, 'getPixelRatio', function(){ return 3 });
            expect(new Imager(imgrOptions)).to.have.property('devicePixelRatio', 2);
        });
    });

  describe('getPageOffsetGenerator', function(){
    it('should use `window.pageYOffset` if the property is available', function(){
        var pageYOffsetIsAvailable = true;
        var generator = Imager.getPageOffsetGenerator(pageYOffsetIsAvailable);

        expect(generator.toString()).to.have.string('.pageYOffset');
    });

    it('should rather use `document.documentElement.scrollTop` if `window.pageYOffset` is not available', function(){
        var pageYOffsetIsAvailable = false;
        var generator = Imager.getPageOffsetGenerator(pageYOffsetIsAvailable);

        expect(generator.toString()).to.have.string('.documentElement.scrollTop');
    });
  });
});