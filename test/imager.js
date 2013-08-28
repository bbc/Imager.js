'use strict';

// jshint -W030: true
/* globals describe, it, expect */

describe('Imager', function () {
    function generateNodes(count, url){
        return Array.apply(null, Array(count));
    }

    describe('constructor', function(){
       var nodeList = [document.createElement('div'), document.createElement('div'), document.createElement('div')];

       it('should compute the proper attributes', function(){
           var instance = new Imager(generateNodes(3));

           expect(instance.nodes).to.be.an('array').and.to.have.length.of(3);

           expect(instance.availableWidths).to.be.an('array').and.to.contain(235);

           expect(instance.placeholder).to.be.an.instanceof(HTMLElement);
           expect(instance.placeholder.src).to.equal('data:image/gif;base64,R0lGODlhEAAJAIAAAP///wAAACH5BAEAAAAALAAAAAAQAAkAAAIKhI+py+0Po5yUFQA7');
           expect(instance.placeholder.className).to.equal('responsive-img');
       });

       it('should configure properly its attributes based on an optional config argument', function(){
           var placeholder = document.createElement('img');
           placeholder.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';

           var instance = new Imager(generateNodes(5), {
               availableWidths: [50, 99, 120, 500],
               placeholder: placeholder,
               placeholderClassName: 'responsive-img-alt'
           });

           expect(instance.nodes).to.be.an('array').and.to.have.length.of(5);

           expect(instance.availableWidths).to.be.an('array').and.to.contain(99).and.not.to.contain(235);

           expect(instance.placeholder).to.be.an.instanceof(HTMLElement);
           expect(instance.placeholder.src).to.equal('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=');
           expect(instance.placeholder.className).to.equal('responsive-img-alt');
       });
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
    });

    describe('getReplacer', function(){
        it('should provide a proper registered replacer for an HTML element', function(){
            var el, instance;

            instance = Imager.init([]);

            expect(Imager.replacers).to.be.an('object').and.not.to.be.empty;

            el = document.createElement('div');
            expect(instance.getReplacer(el)).to.be.null;

            el = document.createElement('div');
            el.dataset.src = 'http://placekitten.com';
            expect(instance.getReplacer(el)._id).to.equal('container');

            el = document.createElement('img');
            el.dataset.src = 'http://placekitten.com';
            expect(instance.getReplacer(el)._id).to.equal('img');
        });
    });

    describe('replaceUri', function(){
        it('should replace existing pattern replacers', function(){
            var values = {width: 350, pixel_ratio: '2x'};

            expect(Imager.replaceUri('http://placekitten.com/{width}/picture.jpeg', values)).to.equal('http://placekitten.com/350/picture.jpeg');
            expect(Imager.replaceUri('http://placekitten.com/width/picture.jpeg', values)).to.equal('http://placekitten.com/width/picture.jpeg');
            expect(Imager.replaceUri('http://placekitten.com/{width}-{pixel_ratio}/picture.jpeg', values)).to.equal('http://placekitten.com/350-2x/picture.jpeg');
        });

        it('should not replace an unexisting pattern replacer', function(){
            expect(Imager.replaceUri('http://placekitten.com/{width}/picture.jpeg', {})).to.equal('http://placekitten.com/{width}/picture.jpeg');
        });
    });
});