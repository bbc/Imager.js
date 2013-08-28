"use strict";

// jshint -W030: true
/* globals describe, it, expect */

describe("Imager Container Replacer", function () {
    var doc, sandbox, strategy = Imager.strategies.container;

    beforeEach(function(){
        var fixtures = window.__html__['test/fixtures/strategy-container.html'];
        doc = document.createElement('div');
        doc.innerHTML = fixtures;

        sandbox = sinon.sandbox.create();
    });

    afterEach(function(){
        sandbox.restore();
    });

    describe('matches', function(){
        it('should match allowed tag containers', function(){
            var el;

            el = document.createElement('div');
            expect(strategy.matches(el)).to.be.false;

            el = document.createElement('div');
            el.dataset.src = 'http://example.com';
            expect(strategy.matches(el)).to.be.true;

            el = document.createElement('span');
            el.dataset.src = 'http://example.com';
            expect(strategy.matches(el)).to.be.true;

            el = document.createElement('figure');
            el.dataset.src = 'http://example.com';
            expect(strategy.matches(el)).to.be.true;
        });
    });

    describe('createPlaceholder', function(){
        it('should create placeholder pictures in the container', function(){
            var placeholder;
            var elements = doc.querySelectorAll('#container .delayed-image-load');
            var strategySpy = sandbox.spy(strategy, 'createPlaceholder');

            Imager.init(elements);

            placeholder = elements[0].querySelector('img');

            expect(placeholder).to.be.instanceOf(HTMLElement);
            expect(placeholder.src).to.equal('data:image/gif;base64,R0lGODlhEAAJAIAAAP///wAAACH5BAEAAAAALAAAAAAQAAkAAAIKhI+py+0Po5yUFQA7');
            expect(placeholder.className).to.equal('responsive-img');

            //we make sure we have two distinct image objects
            expect(placeholder).not.to.equal(elements[1].querySelector('img'));
            expect(strategySpy.callCount).to.equal(2);
        });

        it('should not create two placeholder for the same container', function(){
            var elements = doc.querySelectorAll('#container .delayed-image-load');
            var strategySpy = sandbox.spy(strategy, 'createPlaceholder');

            var instance = Imager.init(elements);
            instance.process();

            expect(elements[0].querySelectorAll('img')).to.have.length.of(1);
            expect(strategySpy.callCount).to.equal(2);
        });
    });
});