module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({

        // Store your Package file so you can reference its specific data whenever necessary
        pkg: grunt.file.readJSON('package.json'),

        imageDirectory: {
            default: 'Demo - Grunt/Assets/Images/',
            lazyload: 'Demo - Lazy Load/Assets/Images/'
        },

        // grunt responsive_images:dev:default
        // grunt responsive_images:dev:lazyload
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
                    cwd: '<%= imageDirectory[grunt.task.current.args[0]] %>',
                    src: ['*.{jpg,gif,png}'],
                    dest: '<%= imageDirectory[grunt.task.current.args[0]] %>Generated/'
                }]
            }
        }

    });

    // Load NPM Tasks
    grunt.loadNpmTasks('grunt-responsive-images');

    // Default Task
    grunt.registerTask('default', ['responsive_images:dev']);

};
