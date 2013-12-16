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
          expect(el.nodeName).to.eq('IMG');
          expect(el.getAttribute('src')).to.eq(el.getAttribute('data-src'));
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
          'base/Demo - Grunt/Assets/Images/Generated/C-320.jpg',
          'base/Demo - Grunt/Assets/Images/Generated/B-640.jpg',
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
          '//farm5.staticflickr.com/4148/4990539658_a38ed4ec6e_n_d.jpg',
          '//farm4.staticflickr.com/3773/9676470682_3d418eeb40_z_d.jpg',
          'http://www.fillmurray.com/1024/1024'
        ]);

        done();
      });
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

    it('should always return a pixelRatio', function(){
      expect(Imager.getPixelRatio()).to.be.above(0);

      sandbox.stub(window, 'devicePixelRatio', undefined);
      expect(window.devicePixelRatio).to.be.an('undefined');
      expect(Imager.getPixelRatio()).to.be.eq(1);
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

    it('should replace data-alt with alt', function(done){
      fixtures = loadFixtures('data-alt');

      var before = [];
      var originElements = document.getElementsByClassName('delayed-image-load');
      for (var i = 0; i < originElements.length; i++) {
        before[i] = originElements[i].getAttribute('data-alt') || '';
      }

      var imgr = new Imager();

      runAfterAnimationFrame(function(){
        for (var i = 0; i < imgr.divs.length; i++) {
          expect(imgr.divs[i].getAttribute('alt')).to.eq(before[i]);
        }

        done();
      });
    });
  });
});