"use strict";

// jshint -W030: true
/* globals describe, it, expect */

describe("Imager Container Replacer", function () {
    var doc, sandbox, instance, fixtures;

    beforeEach(function(){
        doc = document.createElement('div');
        doc.innerHTML = window.__html__['test/fixtures/strategy-container.html'];

        sandbox = sinon.sandbox.create();
        fixtures = doc.querySelectorAll('#container .delayed-image-load');

        instance = new Imager(fixtures);
    });

    afterEach(function(){
        sandbox.restore();
    });

    describe('createPlaceholder', function(){
        it('should create placeholder pictures in the container', function(){
            var placeholder;
            var strategySpy = sandbox.spy(instance.strategy, 'createPlaceholder');

            instance.process();

            placeholder = fixtures[0].querySelector('img');

            expect(placeholder).to.be.instanceOf(HTMLElement);
            expect(placeholder.src).to.equal('data:image/gif;base64,R0lGODlhEAAJAIAAAP///wAAACH5BAEAAAAALAAAAAAQAAkAAAIKhI+py+0Po5yUFQA7');
            expect(placeholder.classList.contains('responsive-img')).to.be.true;

            //we make sure we have two distinct image objects
            expect(placeholder).not.to.equal(fixtures[1].querySelector('img'));
            expect(strategySpy.callCount).to.equal(2);
        });

        it('should not create two placeholder for the same container', function(){
            var strategySpy = sandbox.spy(instance.strategy, 'createPlaceholder');

            instance.process();
            instance.process();

            expect(fixtures[0].querySelectorAll('img')).to.have.length.of(1);
            expect(strategySpy.callCount).to.equal(2);
        });
    });
});