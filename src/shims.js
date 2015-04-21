'use strict';

export var addEvent = (function () {
    if (document.addEventListener) {
	return function addStandardEventListener(el, eventName, fn) {
	    return el.addEventListener(eventName, fn, false);
	};
    }
    else {
	return function addIEEventListener(el, eventName, fn) {
	    return el.attachEvent('on' + eventName, fn);
	};
    }
})();

export function applyEach(collection, callbackEach) {
    var i = 0,
	length = collection.length,
	new_collection = [];

    for (; i < length; i++) {
	new_collection[i] = callbackEach(collection[i], i);
    }

    return new_collection;
};

export var getKeys = typeof Object.keys === 'function' ? Object.keys : function (object) {
    var keys = [],
	key;

    for (key in object) {
	keys.push(key);
    }

    return keys;
};
