module.exports = function(grunt) {
    grunt.initConfig({
        min: {
            dist: {
                src: ['src/tsquery.js'],
                dest: 'build/tsquery.min.js'
            }
        },
        lint: {
            all: ['src/tsquery.js']
        },
        jshint: {
            options: {
                browser: true
            }
        }
    });

    grunt.registerTask('default', 'lint min');
};
