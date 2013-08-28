'use strict';

// jshint -W030: true
/* globals describe, it, expect */

describe('Imager', function () {
    var sandbox, fixtures;

    beforeEach(function(){
        var doc = document.createElement('div');
        doc.innerHTML = window.__html__['test/fixtures/imager.html'];

        sandbox = sinon.sandbox.create();
        fixtures = doc.querySelectorAll('div.delayed-image-load');
    });

    afterEach(function(){
        sandbox.restore();
    });

    function generateNodes(count, url){
        return Array.apply(null, Array(count));
    }

    describe('constructor', function(){
       var nodeList = [document.createElement('div'), document.createElement('div'), document.createElement('div')];

       it('should compute the proper attributes', function(){
           var instance = new Imager(generateNodes(3));

           expect(instance.nodes).to.be.an('array').and.to.have.length.of(3);
           expect(instance.availableWidths).to.be.an('array').and.to.contain(235);
           expect(instance.strategy.constructor).to.have.property('_id');
       });

       it('should configure properly its attributes based on an optional config argument', function(){
           var placeholder = document.createElement('img');
           placeholder.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';

           var instance = new Imager(generateNodes(5), {
               availableWidths: [50, 99, 120, 500],
               placeholder: {
                   element: placeholder,
                   matchingClassName: 'responsive-img-alt'
               }
           });

           expect(instance.nodes).to.be.an('array').and.to.have.length.of(5);
           expect(instance.availableWidths).to.be.an('array').and.to.contain(99).and.not.to.contain(235);
           expect(instance.strategy.constructor).to.have.property('_id');
       });
    });

    describe('process', function(){
        it('should create placeholders prior to replacing responsive URIs', function(done){
            var instance = new Imager(fixtures),
                createPlaceholderStub = sandbox.stub(instance.strategy, 'createPlaceholder'),
                updateImagesSourceStub = sandbox.stub(instance, 'updateImagesSource');

            instance.process(function(){
                expect(updateImagesSourceStub.called).to.be.true;
                expect(updateImagesSourceStub.calledAfter(createPlaceholderStub)).to.be.true;

                done();
            });

            expect(createPlaceholderStub.called).to.be.true;
            expect(updateImagesSourceStub.called).to.be.false;
        });
    });

    describe('updateImagesSource', function(){

    });

    describe('getBestWidth', function(){
        it('should return the closest available width to fit in', function(){
            var instance = Imager.init([]);

            expect(instance.getBestWidth(1024)).to.equal(736);
            expect(instance.getBestWidth(800)).to.equal(736);
            expect(instance.getBestWidth(415)).to.equal(445);
            expect(instance.getBestWidth(410)).to.equal(410);
            expect(instance.getBestWidth(409)).to.equal(410);
            expect(instance.getBestWidth(50)).to.equal(96);
        });

        it('should use the default max width value if provided', function(){
            var instance = Imager.init([]);

            expect(instance.getBestWidth(50, 300)).to.equal(96);
            expect(instance.getBestWidth(800, 300)).to.equal(300);
        });
    });

    describe('replaceUri', function(){
        it('should replace URI variables with defined values', function(){
            var values = {width: 350, pixel_ratio: '2x'};

            expect(Imager.replaceUri('http://placekitten.com/{width}/picture.jpeg', values)).to.equal('http://placekitten.com/350/picture.jpeg');
            expect(Imager.replaceUri('http://placekitten.com/width/picture.jpeg', values)).to.equal('http://placekitten.com/width/picture.jpeg');
            expect(Imager.replaceUri('http://placekitten.com/{width}-{pixel_ratio}/picture.jpeg', values)).to.equal('http://placekitten.com/350-2x/picture.jpeg');
        });

        it('should not replace an URI variable which has not been defined', function(){
            expect(Imager.replaceUri('http://placekitten.com/{width}/picture.jpeg', {})).to.equal('http://placekitten.com/{width}/picture.jpeg');
        });
    });
});