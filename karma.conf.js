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
        frameworks: ['mocha', 'mocha', 'expect', 'sinon'],


        // list of files / patterns to load in the browser
        files:      [
            'node_modules/components-jquery/jquery.min.js',
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
        transports:    ['websocket', 'htmlfile', 'jsonp-polling'],

        // web server port
        port:          9876,


        // enable / disable colors in the output (reporters and logs)
        colors:        true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel:      config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch:     false,

        sauceLabs: {
            tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER || null,
            accessKey:        process.env.SAUCE_ACCESS_KEY,
            testName:         'BBC-News/Imager.js',
            startConnect:     false
        },

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
                os_version: '6.1'
            },
            BSOS7:             {
                base:       'BrowserStack',
                device:     'iPad mini Retina',
                os:         'ios',
                os_version: '7.0'
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
            BSFirefox:         {
                base:            'BrowserStack',
                browser:         'firefox',
                browser_version: '22.0',
                os:              'Windows',
                os_version:      '7'
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
            // Saucelabs
            SauceIE6:          {
                base:        'SauceLabs',
                browserName: 'internet explorer',
                platform:    'Windows XP',
                version:     '6'
            },
            SauceIE7:          {
                base:        'SauceLabs',
                browserName: 'internet explorer',
                platform:    'Windows XP',
                version:     '7'
            },
            SauceIE8:          {
                base:        'SauceLabs',
                browserName: 'internet explorer',
                platform:    'Windows 7',
                version:     '8'
            },
            SauceIE9:          {
                base:        'SauceLabs',
                browserName: 'internet explorer',
                platform:    'Windows 7',
                version:     '9'
            },
            SauceIE10:         {
                base:        'SauceLabs',
                browserName: 'internet explorer',
                platform:    'Windows 8',
                version:     '10'
            },
            SauceIE11:         {
                base:        'SauceLabs',
                browserName: 'internet explorer',
                platform:    'Windows 8.1',
                version:     '11'
            },
            SauceFirefox:      {
                base:        'SauceLabs',
                browserName: 'firefox',
                platform:    'Windows 7',
                version:     '21'
            },
            SauceAndroid:      {
                base:        'SauceLabs',
                browserName: 'android',
                platform:    'Linux',
                version:     '4.0'
            },
            SauceiOS7:         {
                base:        'SauceLabs',
                browserName: 'iphone',
                platform:    'OS X 10.9',
                version:     '7.1'
            },
            SauceiOS6:         {
                base:        'SauceLabs',
                browserName: 'iphone',
                platform:    'OS X 10.8',
                version:     '6.1'
            },
            SauceiOS5:         {
                base:        'SauceLabs',
                browserName: 'iphone',
                platform:    'OS X 10.8',
                version:     '5.1'
            },
            SauceiOS4:         {
                base:        'SauceLabs',
                browserName: 'iphone',
                platform:    'OS X 10.6',
                version:     '4.3'
            },
            SauceSafari5:      {
                base:        'SauceLabs',
                browserName: 'safari',
                platform:    'OS X 10.6'
            }
        },

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun:                  true,

        browserNoActivityTimeout:   45000
    });

    config.set({
        browsers: browsers || (isCI
            ? filterBrowsers(config.customLaunchers, /^BS/)
            : ['PhantomJSCustom', 'Firefox'])
    });
};
