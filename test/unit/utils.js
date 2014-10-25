'use strict';

/* globals describe, beforeEach, afterEach, it, expect, Imager, jQuery, document, sinon */

describe('utils', function () {
    var fixtures;

    describe('getNaturalWidth', function () {
        before(function () {
            fixtures = loadFixtures('natural-width');
        });

        it('should return a natural width of 640 on an image set to a 40px width', function (done) {
            var img = fixtures.querySelector('img');
            runAfterAnimationFrame(function () {
                expect(Imager.getNaturalWidth(img)).to.equal(640);

                done();
            });
        });
    });
});