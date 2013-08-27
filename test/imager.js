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