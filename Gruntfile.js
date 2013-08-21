module.exports = function (grunt) {
    "use strict";

    // Project configuration.
    grunt.initConfig({

        // Store your Package file so you can reference its specific data whenever necessary
        pkg: grunt.file.readJSON('package.json'),

        imageDirectory: 'Demo - Grunt/Assets/Images/',

        responsive_images: {
            dev: {
                options: {
                    sizes: [
                        {
                            width: 320,
                        },
                        {
                            width: 640
                        },
                        {
                            width: 1024
                        }
                    ]
                },
                files: [{
                    expand: true,
                    cwd: '<%= imageDirectory %>',
                    src: ['*.{jpg,gif,png}'],
                    dest: '<%= imageDirectory %>Generated/'
                }]
            }
        },

        watch: {
            source: {
                files: "<%= typescript.src %>",
                tasks: ['typescript']
            }
        }

    });

    // Load NPM Tasks
    grunt.loadNpmTasks('grunt-responsive-images');
    grunt.loadNpmTasks("grunt-contrib-watch");

    // Default Task
    grunt.registerTask('default', ['responsive_images:dev']);

};
