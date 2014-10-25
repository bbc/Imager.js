'use strict';

/* globals describe, beforeEach, afterEach, it, expect, Imager, jQuery, document, sinon */

describe('utils', function () {
    describe('getNaturalWidth', function () {
        it('should return a natural width of 640 on an image set to a 40px width', function (done) {
            this.timeout(10000);

            var img = document.createElement('img');
            img.src = 'base/test/fixtures/media/B-640.jpg';
            img.onload = function () {
                expect(Imager.getNaturalWidth(img)).to.equal(640);

                done();
            };
        });
    });
});