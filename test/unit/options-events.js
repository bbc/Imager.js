'use strict';

/* globals describe, it, beforeEach, afterEach, sinon, Imager */

describe('Imager.js Events', function () {
    var fixtures, sandbox;

    beforeEach(function () {
        fixtures = undefined;
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
        cleanFixtures(fixtures);
    });

    describe('Constructor Options', function () {
        it('should register the relevant events by default', function () {
            var imgr = new Imager();

            expect(imgr.onResize).to.equal(true);
            expect(imgr.lazyload).to.equal(false);
        });

        it('should handle onResize only', function (done) {
            var imgr = new Imager({ onResize: true, lazyload: false });
            var resizeSpy = sandbox.spy(imgr, 'registerResizeEvent');
            var scrollSpy = sandbox.spy(imgr, 'registerScrollEvent');

            expect(resizeSpy.called).to.equal(false);
            expect(scrollSpy.called).to.equal(false);

            imgr.ready(function () {
                expect(resizeSpy.callCount).to.equal(1);
                expect(scrollSpy.callCount).to.equal(0);

                done();
            });
        });

        it('should handle onScroll only', function (done) {
            var imgr = new Imager({ onResize: false, lazyload: true });
            var resizeSpy = sandbox.spy(imgr, 'registerResizeEvent');
            var scrollSpy = sandbox.spy(imgr, 'registerScrollEvent');

            expect(resizeSpy.called).to.equal(false);
            expect(scrollSpy.called).to.equal(false);

            imgr.ready(function () {
                expect(resizeSpy.callCount).to.equal(0);
                expect(scrollSpy.callCount).to.equal(1);

                done();
            });
        });

        describe('onImagesReplaced', function () {
            it('should run during the init process', function (done) {
                var replaceImagesSpy = sandbox.spy();
                var imgr = new Imager({ onImagesReplaced: replaceImagesSpy });

                expect(replaceImagesSpy.called).to.equal(false);

                imgr.ready(function () {
                    expect(replaceImagesSpy.callCount).to.equal(1);

                    done();
                });
            });

            it('should receive the targeted list of images as sole argument', function (done) {
                loadFixtures('regular');
                var replaceImagesSpy = sandbox.spy();
                var imgr = new Imager({ selector: '#main .delayed-image-load', onImagesReplaced: replaceImagesSpy });

                imgr.ready(function () {
                    var args = replaceImagesSpy.getCall(0).args;

                    expect(args).to.have.length(1);
                    expect(args[0]).to.have.length(3);

                    done();
                });
            });
        });

        describe('onresize', function () {
            it('should update the viewportHeight internal on window resize if lazyloading is enabled', function(){
                var imgr = new Imager({ lazyload: true });

                // we could do better but trigger window.onresize is not the most funny thing
                expect(imgr.registerScrollEvent.toString()).to.match(/viewportHeight = document.documentElement.clientHeight/);
            });
        });
    });
});