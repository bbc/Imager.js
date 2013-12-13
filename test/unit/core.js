'use strict';

/* globals describe, beforeEach, afterEach, it, expect, Imager, jQuery, document, sinon */

function loadFixtures(location){
    var fixtures = document.createElement('div');
    fixtures.id = 'karma-fixtures';
    fixtures.innerHTML = window.__html__['test/fixtures/'+location+'.html'];
    document.body.appendChild(fixtures);

    return fixtures;
}

/**
 * Runs a bit of code after an Animation Frame. Supposedly.
 *
 * @param {Function} fn
 * @returns {Number} Timeout ID
 */
function runAfterAnimationFrame(fn){
    return setTimeout(fn, 20);
}

describe('Imager.js', function(){
  describe('constructor', function(){
    var fixtures;

    afterEach(function(){
      if(fixtures){
        document.body.removeChild(fixtures);
      }
    });

    it('should initialise without arguments', function(done){
      fixtures = loadFixtures('regular');
      var imgr = new Imager();

      runAfterAnimationFrame(function(){
        expect(imgr.initialized).to.be.true;
        expect(imgr.scrolled).to.be.false;
        expect(imgr.divs).to.have.length.of(5);
        expect(imgr.selector).to.eq('.delayed-image-load');

        done();
      });
    });

    it('should initialise with one argument, the options', function(){
      fixtures = loadFixtures('regular');
      var imgr = new Imager({ selector: '#main .delayed-image-load' });

      expect(imgr.divs).to.have.length.of(3);
      expect(imgr.selector).to.eq('#main .delayed-image-load');
    });

    it('should target elements with a string as first argument', function(done){
      fixtures = loadFixtures('regular');
      var imgr = new Imager('#main .delayed-image-load');

      runAfterAnimationFrame(function(){
        expect(imgr.initialized).to.be.true;
        expect(imgr.scrolled).to.be.false;
        expect(imgr.divs).to.have.length.of(3);
        expect(imgr.selector).to.eq('#main .delayed-image-load');

        done();
      });
    });

    it('should target elements contained in a static NodeList collection', function(done){
      fixtures = loadFixtures('regular');
      var imgr = new Imager(document.querySelectorAll('#main .delayed-image-load'));

      runAfterAnimationFrame(function(){
        expect(imgr.initialized).to.be.true;
        expect(imgr.scrolled).to.be.false;
        expect(imgr.divs).to.have.length.of(3);
        expect(imgr.selector).to.be.null;

        done();
      });
    });

    it('should target elements contained in a live NodeList collection', function(done){
      fixtures = loadFixtures('regular');
      var imgr = new Imager(document.getElementById('main').getElementsByClassName('delayed-image-load'));

      runAfterAnimationFrame(function(){
        expect(imgr.initialized).to.be.true;
        expect(imgr.scrolled).to.be.false;
        expect(imgr.divs).to.have.length.of(3);
        expect(imgr.selector).to.be.null;

        done();
      });
    });

    it('should target elements contained in a third-party library collection', function(done){
      fixtures = loadFixtures('regular');
      var imgr = new Imager(jQuery('#main .delayed-image-load'));

      runAfterAnimationFrame(function(){
        expect(imgr.initialized).to.be.true;
        expect(imgr.scrolled).to.be.false;
        expect(imgr.divs).to.have.length.of(3);
        expect(imgr.selector).to.be.null;

        done();
      });
    });
  });

  describe('availableWidths', function(){
    var sandbox;

    beforeEach(function(){
      sandbox = sinon.sandbox.create();
    });

    afterEach(function(){
      sandbox.restore();
    });

    it('should select the closest smallest available image width', function(){
      var imgr = new Imager({ availableWidths: [320, 640, 1024] });
      var img = { clientWidth: 320 };   // stubbing the clientWidth read-only value does not work

      sandbox.stub(img, 'clientWidth', 319);
      expect(imgr.determineAppropriateResolution(img)).to.eq(320);

      sandbox.stub(img, 'clientWidth', 320);
      expect(imgr.determineAppropriateResolution(img)).to.eq(320);

      sandbox.stub(img, 'clientWidth', 639);
      expect(imgr.determineAppropriateResolution(img)).to.eq(640);

      sandbox.stub(img, 'clientWidth', 640);
      expect(imgr.determineAppropriateResolution(img)).to.eq(640);

      sandbox.stub(img, 'clientWidth', 1030);
      expect(imgr.determineAppropriateResolution(img)).to.eq(1024);
    });

    it('can be a function computing a value for you', function(done){
      // this example will always compute sizes 8 pixels by 8 pixels
      // we need to stub it for now as events are triggered automatically and generates exceptions we can escape
      var imgr = new Imager();

      setTimeout(function(){
        imgr.availableWidths = function(image){
          return image.clientWidth - image.clientWidth % 8 + (1 * (image.clientWidth % 8 ? 8 : 0));
        };

        var img = { clientWidth: 320 };
        var spy = sandbox.spy(imgr, 'availableWidths');

        // sinon stub api wasn't working so we're manually stubbing instead
        img.clientWidth = 7;
        expect(function(){ imgr.replaceImagesBasedOnScreenDimensions(img); }).to.throw();
        expect(spy.returned(8)).to.be.true;

        img.clientWidth = 8;
        expect(function(){ imgr.replaceImagesBasedOnScreenDimensions(img); }).to.throw();
        expect(spy.returned(8)).to.be.true;

        img.clientWidth = 9;
        expect(function(){ imgr.replaceImagesBasedOnScreenDimensions(img); }).to.throw();
        expect(spy.returned(16)).to.be.true;

        done();
      }, 100);

    });
  });

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

  describe('handling {pixel_ratio}', function(){
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
});