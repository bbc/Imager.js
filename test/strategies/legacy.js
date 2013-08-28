"use strict";

// jshint -W030: true
/* globals describe, it, expect */

describe("Imager Legacy Strategy", function () {
    var doc, sandbox, instance, fixtures;

    beforeEach(function () {
        doc = document.createElement('div');
        doc.innerHTML = window.__html__['test/fixtures/strategy-container.html'];

        sandbox = sinon.sandbox.create();
        fixtures = doc.querySelector('#container').getElementsByClassName('delayed-image-load');

        instance = new Imager(fixtures, { strategy: 'legacy' });
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('createPlaceholder', function () {
        it('should replace container elements by placeholder', function () {
            var placeholder,
                strategySpy = sandbox.spy(instance.strategy, 'createPlaceholder');

            instance.process();

            placeholder = fixtures[0];

            expect(placeholder).to.be.instanceOf(HTMLElement);
            expect(placeholder.src).to.equal('data:image/gif;base64,R0lGODlhEAAJAIAAAP///wAAACH5BAEAAAAALAAAAAAQAAkAAAIKhI+py+0Po5yUFQA7');
            expect(placeholder.classList.contains('responsive-img')).to.be.true;

            //we make sure we have two distinct image objects
            expect(placeholder).not.to.equal(fixtures[1]);
            expect(strategySpy.callCount).to.equal(2);
        });
    });
});
