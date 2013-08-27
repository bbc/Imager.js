'use strict';

// jshint -W030: true
/* globals describe, it, expect */

describe('Imager', function () {
    function generateNodes(count, url){
        var nodes = Array.apply(null, Array(count));

        return nodes.map(function(node, i){
            node = document.createElement('div');
            node.id = 'container'+i;
            node.className = 'delayed-image-load';
            node.dataset.src = url || 'http://placekitten.com/{width}/picture.jpg';

            return node;
        });
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
});