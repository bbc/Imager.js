'use strict';

/* globals describe, beforeEach, afterEach, it, expect, Imager, jQuery, document, sinon */

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
            var imgr = new Imager({selector: '#main .delayed-image-load'});
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

    describe('add', function () {

        it('should add additional images based on a custom selector', function (done) {
            fixtures = loadFixtures('add');
            var imgr = new Imager();
            imgr.ready(function () {
                expect(imgr.divs).to.have.length(2);
                imgr.add('.triggered-image-load');
                expect(imgr.divs).to.have.length(4);
                done();
            });
        });

        it('should add additional images based on the default selector', function (done) {
            fixtures = loadFixtures('add');
            var imgr = new Imager();
            imgr.ready(function () {
                var elements = document.querySelectorAll('#test-case div');
                Imager.applyEach(elements, function (element) {
                  element.className = 'delayed-image-load';
                });
                imgr.add();
                expect(imgr.divs).to.have.length(4);
                done();
            });
        });

        it('should add additional images based on NodeList passed in', function (done) {
            fixtures = loadFixtures('add');
            var imgr = new Imager();
            imgr.ready(function () {
                var elements = document.querySelectorAll('#test-case div');
                imgr.add(elements);
                expect(imgr.divs).to.have.length(4);
                done();
            });
        });

        it('should add additional images based on Node array passed in', function (done) {
            fixtures = loadFixtures('add');
            var imgr = new Imager();
            imgr.ready(function () {
                var elements = document.querySelectorAll('#test-case div');
                elements = Imager.applyEach(elements, function (element) { return element; });
                imgr.add(elements);
                expect(imgr.divs).to.have.length(4);
                done();
            });
        });

        it('should handle "null" selector scenario gracefully', function (done) {
            fixtures = loadFixtures('add');
            var imgr = new Imager([]);
            imgr.ready(function () {
                imgr.add();
                expect(imgr.divs).to.have.length(0);
                done();
            });
        });
    });

    describe('determineAppropriateResolution', function () {
        var imgr, windowWidth, availableWidths = [320, 640, 1024];

        beforeEach(function () {
            fixtures = loadFixtures('widths');
            imgr = new Imager({availableWidths: availableWidths});
            windowWidth = window.innerWidth;
        });

        it('should pick the closest value from the container\'s width (no container size)', function () {
            var maxContainerWidth = Imager.getClosestValue(windowWidth, availableWidths);
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

    describe('devicePixelRatio', function () {
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

    describe('getPageOffsetGenerator', function () {
        it('should use `window.pageYOffset` if the property is available', function () {
            var pageYOffsetIsAvailable = true;
            var generator = Imager.getPageOffsetGenerator(pageYOffsetIsAvailable);

            expect(generator.toString()).to.have.string('.pageYOffset');
        });

        it('should rather use `document.documentElement.scrollTop` if `window.pageYOffset` is not available', function () {
            var pageYOffsetIsAvailable = false;
            var generator = Imager.getPageOffsetGenerator(pageYOffsetIsAvailable);

            expect(generator.toString()).to.have.string('.documentElement.scrollTop');
        });
    });

    describe('isThisElementOnScreen', function(){
        var offsetStub, imgr;

        beforeEach(function(){
            imgr = new Imager();
            offsetStub = sandbox.stub(imgr, 'viewportHeight', 1024);


        });

        it('should not detect an element if itself and its parent outreach the viewport height', function(){
            var element = {
                offsetTop: 100,
                offsetParent: {
                    offsetTop: 1024
                }
            };

            expect(imgr.isThisElementOnScreen(element)).to.equal(false);
        });

        it('should detect an element on screen if its offsetPosition is located within the viewport', function(){
            var element = {
                offsetTop: 100,
                offsetParent: {
                    offsetTop: 0
                }
            };

            expect(imgr.isThisElementOnScreen(element)).to.equal(true);
        });

        it('should detect an element on screen if its offsetPosition is out of the viewport but within the viewport+lazyloadOffset', function(){
            var element = {
                offsetTop: 100,
                offsetParent: {
                    offsetTop: 1024
                }
            };

            imgr.lazyloadOffset = 300;

            expect(imgr.isThisElementOnScreen(element)).to.equal(true);
        });
    });
});
