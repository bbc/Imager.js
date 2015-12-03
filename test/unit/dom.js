'use strict';

import { getNaturalWidth, getPixelRatio } from '../../src/dom';

describe('dom', function () {
    describe('getNaturalWidth', function () {
        it('should return a natural width of 640 on an image set to a 40px width', function (done) {
            this.timeout(10000);

            var img = document.createElement('img');
            img.src = 'base/test/fixtures/media/B-640.jpg';
            img.onload = function () {
                expect(getNaturalWidth(img)).to.equal(640);

                done();
            };
        });
    });

    describe('getPixelRatio', function () {
        it('should return a numeric value', function () {
            expect(getPixelRatio()).to.be.above(0);
        });

        it('should return a default value of 1 for old browser', function () {
            expect(getPixelRatio({})).to.equal(1);
        });
    });
});
