'use strict';

import { applyEach } from '../shims';

export function register (imgr) {
  imgr.scrolled = false;

  imgr.interval = window.setInterval(() => scrollCheck(imgr), imgr.scrollDelay);

  window.addEventListener('scroll', () => {
    imgr.scrolled = true
  });

  window.addEventListener('resize', () => {
    imgr.viewportHeight = document.documentElement.clientHeight;
    imgr.scrolled = true;
  });

  // to execute once ready
  return () => {
    imgr.scrolled = true;
    scrollCheck(imgr);
  };
}

// This form is used because it seems impossible to stub `window.pageYOffset`
export const getPageOffset = getPageOffsetGenerator(Object.prototype.hasOwnProperty.call(window, 'pageYOffset'));

export function getPageOffsetGenerator (testCase) {
  if (testCase) {
    return function () {
      return window.pageYOffset;
    };
  }
  else {
    return function () {
      return document.documentElement.scrollTop;
    };
  }
}

function scrollCheck (imgr) {
  const elements = [];

  if (imgr.scrolled) {
    const imgrAttributes = {
      lazyloadOffset: imgr.lazyloadOffset,
      viewportHeight: imgr.viewportHeight
    };

    // collects a subset of not-yet-responsive images and not offscreen anymore
    applyEach(imgr.divs, element => {
      if (imgr.isPlaceholder(element) && isThisElementOnScreen(element, imgrAttributes)) {
        elements.push(element);
      }
    });

    if (elements.length) {
      window.clearInterval(imgr.interval);
    }

    imgr.changeDivsToEmptyImages(elements);
    imgr.scrolled = false;
  }
}

/**
 * Returns true if an element is located within a screen offset.
 *
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isThisElementOnScreen (element, options = { lazyloadOffset: 0, viewportHeight: 0 }) {
  // document.body.scrollTop was working in Chrome but didn't work on Firefox, so had to resort to window.pageYOffset
  // but can't fallback to document.body.scrollTop as that doesn't work in IE with a doctype (?) so have to use document.documentElement.scrollTop
  var elementOffsetTop = 0;
  var offset = getPageOffset() + options.lazyloadOffset;

  if (element.offsetParent) {
    do {
      elementOffsetTop += element.offsetTop;
    }
    while (element = element.offsetParent);
  }

  return elementOffsetTop < (options.viewportHeight + offset);
}
