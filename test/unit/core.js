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

            imgr.ready(function () {
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

            imgr.ready(function () {
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

            imgr.ready(function () {
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

            imgr.ready(function () {
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

            imgr.ready(function () {
                expect(imgr.initialized).to.equal(true);
                expect(imgr.scrolled).to.equal(false);
                expect(imgr.divs).to.have.length(3);
                expect(imgr.selector).to.equal(null);

                done();
            });
        });
    });

    describe('getClosestValue', function () {
        var availableWidths = [320, 640, 1024];

        it('should pick the closest upper value when below the lowest value', function(){
          expect(Imager.getClosestValue(300, availableWidths)).to.equal(320);
        });

        it('should stick to the same value if it corresponds to an available width', function(){
            expect(Imager.getClosestValue(320, availableWidths)).to.equal(320);
        });

        it('should pick the closest upper value if above an existing one', function(){
            expect(Imager.getClosestValue(321, availableWidths)).to.equal(640);
        });

        it('should fallback to the topmost available width if the value is out of range', function(){
            expect(Imager.getClosestValue(1240, availableWidths)).to.equal(1024);
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
