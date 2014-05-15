;(function () {

    'use strict';
    
    var instancesBySelector = {},
        Factory = {
            getSelectorSpecific: function (opts) {
                require(['imager'], function (Imager) {
                    if (!instancesBySelector[opts.selector]) {
                        instancesBySelector[opts.selector] = new Imager(opts);
                    }
                    return instancesBySelector[opts.selector];
                });
            },
            
            refreshAllImages: function () {
                var key;
                for (key in instancesBySelector) {
                    instancesBySelector[key].refreshImages();
                }
            }
        };    

    /* global module, exports: true, define */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        // CommonJS, just export
        module.exports = exports = Factory;
    } else if (typeof define === 'function' && define.amd) {
        // AMD support
        define('imager-factory', [], function () { return Factory; }); // Defining as a named module temporary because of juicer
    }
    /* global -module, -exports, -define */

}());
