'use strict';

/* jshint node:true */

function filterBrowsers (browsers, re) {
    return Object.keys(browsers).filter(function (key) {
        return re.test(key);
    });
}

module.exports = function (config) {
    var isCI = (Boolean(process.env.CI) && Boolean(process.env.BROWSER_STACK_ACCESS_KEY)) === true;
    var browsers = process.env.BROWSERS ? process.env.BROWSERS.split(',') : null;

    config.set({

        // base path, that will be used to resolve files and exclude
        basePath:   '',


        // frameworks to use
	frameworks: ['mocha', 'expect', 'sinon'],


        // list of files / patterns to load in the browser
        files:      [
	    'node_modules/jquery/dist/jquery.min.js',
            'test/fixtures/jquery-noconflict.js',
            'test/fixtures/*.html',
            'Imager.js',
            'test/*.js',
            'test/unit/**/*.js',
            { 'pattern': 'Demo - Grunt/Assets/Images/**/*.jpg', 'included': false, 'served': true },
            { 'pattern': 'test/fixtures/**/*.jpg', 'included': false, 'served': true },
            { 'pattern': 'test/fixtures/oldformat/*', 'included': false, 'served': true }
        ],

        preprocessors: {
            '**/*.html': ['html2js']
        },

        // list of files to exclude
        exclude:       [

        ],


        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters:     ['progress'],

        // essential for non xhr2 browsers
	transports:    ['polling'],

        // web server port
        port:          9876,


        // enable / disable colors in the output (reporters and logs)
        colors:        true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel:      config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch:     false,

        browserStack: {
            project: 'BBC-News/Imager.js',
            build:   process.env.CONTINUOUS_INTEGRATION ? null : ('Local testing - ' + Date.now())
        },

        customLaunchers: {
            'PhantomJSCustom': {
                base:    'PhantomJS',
                options: {
                    viewportSize: {
                        width:  1024,
                        height: 768
                    }
                }
            },
            // Browserstack
//      BSIE6: {
//        base: 'BrowserStack',
//        browser: 'ie',
//        browser_version: '6.0',
//        os: 'Windows',
//        os_version: 'XP'
//      },
            BSIE7:             {
                base:            'BrowserStack',
                browser:         'ie',
                browser_version: '7.0',
                os:              'Windows',
                os_version:      'XP'
            },
            BSIE8:             {
                base:            'BrowserStack',
                browser:         'ie',
                browser_version: '8.0',
                os:              'Windows',
                os_version:      '7'
            },
            BSIE9:             {
                base:            'BrowserStack',
                browser:         'ie',
                browser_version: '9.0',
                os:              'Windows',
                os_version:      '7'
            },
            BSIE10:            {
                base:            'BrowserStack',
                browser:         'ie',
                browser_version: '10.0',
                os:              'Windows',
                os_version:      '8'
            },
            BSIE11:            {
                base:            'BrowserStack',
                browser:         'ie',
                browser_version: '11.0',
                os:              'Windows',
                os_version:      '8.1'
            },
		  BSEDGE12:            {
		base:            'BrowserStack',
		browser:         'edge',
		browser_version: '12.0',
		os:              'Windows',
		os_version:      '10'
	    },
            BSOS4:             {
                base:       'BrowserStack',
                device:     'iPhone 4',
                os:         'ios',
                os_version: '4.0'
            },
            BSOS5:             {
                base:       'BrowserStack',
                device:     'iPhone 4S',
                os:         'ios',
                os_version: '5.1'
            },
            BSOS6:             {
                base:       'BrowserStack',
                device:     'iPhone 5',
                os:         'ios',
		os_version: '6.0'
            },
            BSOS7:             {
                base:       'BrowserStack',
		device:     'iPad 4th',
                os:         'ios',
                os_version: '7.0'
            },
	    BSOS8:             {
		base:       'BrowserStack',
		device:     'iPhone 6',
		os:         'ios',
		os_version: '8.3'
	    },
            BSAndroid2:        {
                base:       'BrowserStack',
                device:     'Samsung Galaxy S II',
                browser:    'android',
                os:         'android',
                os_version: '2.3'
            },
            BSAndroid4:        {
                base:       'BrowserStack',
                device:     'Samsung Galaxy Nexus',
                browser:    'android',
                os:         'android',
                os_version: '4.0'
            },
	    BSAndroid5:        {
		base:       'BrowserStack',
		device:     'Google Nexus 5',
		browser:    'android',
		os:         'android',
		os_version: '5.0'
	    },
            BSFirefox:         {
                base:            'BrowserStack',
                browser:         'firefox',
                browser_version: '22.0',
                os:              'Windows',
                os_version:      '7'
            },
	    BSChrome:         {
		base:            'BrowserStack',
		browser:         'chrome',
		browser_version: '33',
		os:              'OS X',
		os_version:      'Yosemite'
	    },
	    BSOpera:         {
		base:            'BrowserStack',
		browser:         'opera',
		browser_version: '12.15',
		os:              'OS X',
		os_version:      'Yosemite'
	    },
            BSSafari5:         {
                base:            'BrowserStack',
                browser:         'safari',
                browser_version: '5.1',
                os:              'OS X',
                os_version:      'Snow Leopard'
            },
            BSSafari6:         {
                base:            'BrowserStack',
                browser:         'safari',
                browser_version: '6.1',
                os:              'OS X',
                os_version:      'Mountain Lion'
            },
            BSSafari7:         {
                base:            'BrowserStack',
                browser:         'safari',
                browser_version: '7.0',
                os:              'OS X',
                os_version:      'Mavericks'
	    },
	    BSSafari8:         {
		base:            'BrowserStack',
		browser:         'safari',
		browser_version: '8.0',
		os:              'OS X',
		os_version:      'Yosemite'
	    },
	    BSSafari9:         {
		base:            'BrowserStack',
		browser:         'safari',
		browser_version: '9.0',
		os:              'OS X',
		os_version:      'El Capitan'
            }
        },

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun:                  true,

	browserNoActivityTimeout:   45000,

	captureTimeout: isCI ? 120000 : 5000
    });

    config.set({
        browsers: browsers || (isCI
            ? filterBrowsers(config.customLaunchers, /^BS/)
	    : ['PhantomJSCustom'])
    });
};
