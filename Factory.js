;(function () {

    'use strict';
    
    var instancesBySelector = [];
    
    Factory = {
        getSelectorSpecific: function (opts) {
            require('Imager', function (Imager) {
                if (!instancesBySelector[opts.selector]) {
                    instancesBySelector[opts.selector] = new Imager(opts);
                }
                return instancesBySelector[opts.selector];
            });
        }
    };    

    /* global module, exports: true, define */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        // CommonJS, just export
        module.exports = exports = Factory;
    } else if (typeof define === 'function' && define.amd) {
        // AMD support
        define('ImagerFactory', [], function () { return Factory; }); // Defining as a named module temporary because of juicer
    }
    /* global -module, -exports, -define */

}());
