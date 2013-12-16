'use strict';

/* globals describe, it, beforeEach, afterEach, sinon, Imager */

describe('Imager.js HTML data-* API', function(){

  describe('handling {width} in data-src', function(){
    var fixtures;

    afterEach(function(){
      if(fixtures){
        document.body.removeChild(fixtures);
      }
    });

    it('should not use RegExp anymore', function(done){
      fixtures = loadFixtures('data-src-old');
      var imgr = new Imager({ availableWidths: [320, 640] });

      runAfterAnimationFrame(function(){
        imgr.divs.forEach(function(el){
	  expect(el).to.have.property('nodeName', 'IMG');
	  expect(el).to.have.property('src').to.have.string(el.getAttribute('data-src'));
        });

        done();
      });
    });

    it('should replace {width} by the computed width or a fallback', function(done){
      fixtures = loadFixtures('data-src-new');
      var imgr = new Imager({ availableWidths: [640, 320] });

      runAfterAnimationFrame(function(){
        var src = imgr.divs.map(function(el){ return el.getAttribute('src'); });

        expect(src).to.eql([
          'base/test/fixtures/media/C-320.jpg',
          'base/test/fixtures/media/B-640.jpg',
          'base/test/fixtures/media-320/fillmurray.jpg'
        ]);

        done();
      });
    });

    it('should interpolate {width} with an alternate string value', function(done){
      fixtures = loadFixtures('data-src-interpolate');
      var imgr = new Imager({ availableWidths: {1024: '', 320: 'n_d', 640: 'z_d'} });

      runAfterAnimationFrame(function(){
        var src = imgr.divs.map(function(el){ return el.getAttribute('src'); });

        expect(src).to.eql([
          'base/test/fixtures/interpolated/B-n_d.jpg',
          'base/test/fixtures/interpolated/B-z_d.jpg',
          'base/test/fixtures/1024/1024.jpg'
        ]);

        done();
      });
    });
  });

  describe('Imager.getPixelRatio', function(){
      var sandbox;

      beforeEach(function(){
          sandbox = sinon.sandbox.create();
      });

      afterEach(function(){
          sandbox.restore();
      });

      it('should return a numeric value', function(){
        expect(Imager.getPixelRatio()).to.be.above(0);
      });

      it('should return a default value of 1 for old browser', function (){
        expect(Imager.getPixelRatio({})).to.be.eq(1);
      });
  });

  describe('handling {pixel_ratio} in data-src', function(){
    var sandbox;

    beforeEach(function(){
      sandbox = sinon.sandbox.create();
    });

    afterEach(function(){
      sandbox.restore();
    });

    it('should transform {pixel_ratio} as "" or "-<pixel ratio value>x"', function(){
      expect(Imager.transforms.pixelRatio(1)).to.eq('');
      expect(Imager.transforms.pixelRatio(0.5)).to.eq('-0.5x');
      expect(Imager.transforms.pixelRatio(1.5)).to.eq('-1.5x');
    });

    it('should replace {pixel_ratio} from the `data-src`', function(){
      var dataSrc,
          imgr = new Imager();

      dataSrc = 'http://example.com/img{pixel_ratio}/A-{width}.jpg';
      sandbox.stub(imgr, 'devicePixelRatio', 1);
      expect(imgr.changeImageSrcToUseNewImageDimensions(dataSrc, 320)).to.eq('http://example.com/img/A-320.jpg');
      sandbox.stub(imgr, 'devicePixelRatio', 2);
      expect(imgr.changeImageSrcToUseNewImageDimensions(dataSrc, 320)).to.eq('http://example.com/img-2x/A-320.jpg');

      dataSrc = 'http://example.com/img{pixel_ratio}/A.jpg';
      sandbox.stub(imgr, 'devicePixelRatio', 1);
      expect(imgr.changeImageSrcToUseNewImageDimensions(dataSrc, 320)).to.eq('http://example.com/img/A.jpg');
      sandbox.stub(imgr, 'devicePixelRatio', 2);
      expect(imgr.changeImageSrcToUseNewImageDimensions(dataSrc, 320)).to.eq('http://example.com/img-2x/A.jpg');
    });
  });

  describe('handling data-alt', function(){
    var fixtures;

    afterEach(function(){
      if(fixtures){
        document.body.removeChild(fixtures);
      }
    });

    it('should generate an empty alt attribute for the responsive image', function(done){
        fixtures = loadFixtures('regular');
        var imgr = new Imager('#main .delayed-image-load');

        expect(imgr.gif.alt).to.eql('');

        runAfterAnimationFrame(function(){
            expect(imgr.divs[0]).to.have.property('alt', imgr.gif.alt);

            done();
        });
    });

    it('should generate an alt attribute with the same value as the placeholder data-alt attribute', function(done){
      fixtures = loadFixtures('regular');
      var imgr = new Imager('#main .delayed-image-load');

      expect(imgr.gif.alt).to.eql('');

      runAfterAnimationFrame(function(){
        expect(imgr.divs[1]).to.have.property('alt', 'Responsive Image alternative');

        done();
      });
    });
  });
});