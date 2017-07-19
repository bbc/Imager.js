'use strict';

/* globals describe, it, cleanFixtures, beforeEach, expect, afterEach, sinon, Imager */

describe('Imager.js HTML data-* API', function () {
    // Simili-Array.map for IE8 compat purpose
    var applyEach = Imager.applyEach;
    var fixtures, sandbox;

    beforeEach(function () {
        fixtures = undefined;
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
        cleanFixtures(fixtures);
    });

    describe('handling {width} in data-src', function () {
        it('should not use RegExp anymore', function (done) {
            fixtures = loadFixtures('data-src-old');
            var imgr = new Imager({availableWidths: [320, 640]});

            imgr.ready(function () {
                applyEach(imgr.divs, function (el) {
                    expect(el).to.have.property('nodeName', 'IMG');
                    expect(el.src).to.contain(el.getAttribute('data-src'));
                });

                done();
            });
        });

        it('should replace {width} by the computed width or a fallback', function (done) {
            fixtures = loadFixtures('data-src-new');
            var imgr = new Imager({availableWidths: [640, 320]});

            imgr.ready(function () {
                var src = applyEach(imgr.divs, function (el) {
                    return el.getAttribute('src');
                });

                expect(src).to.eql([
                    'base/test/fixtures/media/C-640.jpg',
                    'base/test/fixtures/media/B-640.jpg',
                    'base/test/fixtures/media-320/fillmurray.jpg'
                ]);

                done();
            });
        });

        it('should interpolate {width} with an alternate string value', function (done) {
            fixtures = loadFixtures('data-src-interpolate');
            var imgr = new Imager({availableWidths: {1024: '', 320: 'n_d', 640: 'z_d'}});

            imgr.ready(function () {
                var src = applyEach(imgr.divs, function (el) {
                    return el.getAttribute('src');
                });

                expect(src).to.eql([
                    'base/test/fixtures/interpolated/B-z_d.jpg',
                    'base/test/fixtures/1024/1024.jpg'
                ]);

                done();
            });
        });

        it('should interpolate {width} with a function computed value', function (done) {
            fixtures = loadFixtures('data-src-new');
            var imgr = new Imager({
                availableWidths: function (image) {
                    return 640;
                }
            });

            imgr.ready(function () {
                var src = applyEach(imgr.divs, function (el) {
                    return el.getAttribute('src');
                });

                expect(src).to.eql([
                    'base/test/fixtures/media/C-640.jpg',
                    'base/test/fixtures/media/B-640.jpg',
                    'base/test/fixtures/media-640/fillmurray.jpg'
                ]);

                done();
            });
        });

        it('should interpolate {width} based on an interpolation function', function (done) {
            fixtures = loadFixtures('data-src-interpolate');
            var imgr = new Imager({
                availableWidths: [320, 640, 1024],
                widthInterpolator: function (w) {
                    if (w === 320) {
                        return 'n_d';
                    }
                    if (w === 640) {
                        return 'z_d';
                    }
                    return w;
                }
            });

            imgr.ready(function () {
                var src = applyEach(imgr.divs, function (el) {
                    return el.getAttribute('src');
                });

                expect(src).to.eql([
                    'base/test/fixtures/interpolated/B-z_d.jpg',
                    'base/test/fixtures/1024/1024.jpg'
                ]);

                done();
            });
        });

        it('should provide both width and pixelRatio to the widthInterpolator function', function(){
            var interpolatorStub = sandbox.stub();
            var pixelRatioStub = sandbox.stub(Imager, 'getPixelRatio');
            pixelRatioStub.returns(2);

            new Imager({
                availableWidths: [320, 640],
                widthInterpolator: interpolatorStub
            });

            expect(interpolatorStub.firstCall.args).to.have.length(2);
            expect(interpolatorStub.firstCall.args[0]).to.equal(640);
            expect(interpolatorStub.firstCall.args[1]).to.equal(2);
        });
    });

    describe('Imager.getPixelRatio', function () {
        it('should return a numeric value', function () {
            expect(Imager.getPixelRatio()).to.be.above(0);
        });

        it('should return a default value of 1 for old browser', function () {
            expect(Imager.getPixelRatio({})).to.equal(1);
        });
    });

    describe('handling {pixel_ratio} in data-src', function () {
        it('should transform {pixel_ratio} as "" or "-<pixel ratio value>x"', function () {
            expect(Imager.transforms.pixelRatio(1)).to.equal('');
            expect(Imager.transforms.pixelRatio(0.5)).to.equal('-0.5x');
            expect(Imager.transforms.pixelRatio(1.5)).to.equal('-1.5x');
        });

        it('should replace {pixel_ratio} from the `data-src`', function () {
            var dataSrc,
                imgr = new Imager();

            dataSrc = 'http://example.com/img{pixel_ratio}/A-{width}.jpg';
            sandbox.stub(imgr, 'devicePixelRatio', 1);
            expect(imgr.changeImageSrcToUseNewImageDimensions(dataSrc, 320)).to.equal('http://example.com/img/A-320.jpg');
            sandbox.stub(imgr, 'devicePixelRatio', 2);
            expect(imgr.changeImageSrcToUseNewImageDimensions(dataSrc, 320)).to.equal('http://example.com/img-2x/A-320.jpg');

            dataSrc = 'http://example.com/img{pixel_ratio}/A.jpg';
            sandbox.stub(imgr, 'devicePixelRatio', 1);
            expect(imgr.changeImageSrcToUseNewImageDimensions(dataSrc, 320)).to.equal('http://example.com/img/A.jpg');
            sandbox.stub(imgr, 'devicePixelRatio', 2);
            expect(imgr.changeImageSrcToUseNewImageDimensions(dataSrc, 320)).to.equal('http://example.com/img-2x/A.jpg');
        });
    });

    describe('handling data-alt', function () {
        it('should generate an empty alt attribute for the responsive image', function (done) {
            fixtures = loadFixtures('regular');
            var imgr = new Imager('#main .delayed-image-load');

            expect(imgr.gif).to.have.property('alt', '');

            imgr.ready(function () {
                expect(imgr.divs[0]).to.have.property('alt', imgr.gif.alt);

                done();
            });
        });

        it('should generate an alt attribute with the same value as the placeholder data-alt attribute', function (done) {
            fixtures = loadFixtures('regular');
            var imgr = new Imager('#main .delayed-image-load');

            expect(imgr.gif).to.have.property('alt', '');

            imgr.ready(function () {
                expect(imgr.divs[1]).to.have.property('alt', 'Responsive Image alternative');

                done();
            });
        });

        it('should honour the existing alt attribute if no data-alt attribute is available', function (done) {
            fixtures = loadFixtures('img-placeholders');
            var imgr = new Imager('#main .delayed-image-load');

            expect(imgr.gif).to.have.property('alt', '');

            imgr.ready(function () {
                expect(imgr.divs[1]).to.have.property('alt', 'Responsive Image alternative');
                expect(imgr.divs[2]).to.have.property('alt', 'Placeholder image alternative');

                done();
            });
        });
    });

    describe('handling data-width', function () {
        beforeEach(function () {
            fixtures = loadFixtures('regular');
        });

        it('should set the responsive image width attribute if provided', function () {
            var imgr = new Imager('#main .delayed-image-load');

            expect(imgr.divs[1].getAttribute('width')).to.be.above(0);
        });

        it('should not set the responsive image width attribute if not provided', function () {
            var imgr = new Imager('#main .delayed-image-load');

            expect(imgr.divs[0].getAttribute('width')).to.equal(null);
        });
    });

    describe('handling data-class', function () {
        it('should not differ from the placeholder className if not set', function () {
            fixtures = loadFixtures('data-class');
            var imgr = new Imager('#main .delayed-image-load');

            expect(imgr.divs[0]).to.have.property('className', imgr.className);
        });

        it('should unshift one or many class in the placeholder className attribute if set', function () {
            fixtures = loadFixtures('data-class');
            var imgr = new Imager('#main .delayed-image-load');

            expect(imgr.divs[1]).to.have.property('className', 'first-class second-class ' + imgr.className);
        });
    });
});
