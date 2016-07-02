'use strict';

module.exports = function (grunt) {

    // Load all Grunt tasks matching the `grunt-*` pattern.
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times.
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            gruntfile: {
                files: ['Gruntfile.js', '.babelrc'],
                tasks: ['default']
            },
            js: {
                files: ['tests/fixtures/src/**/*.js'],
                tasks: ['default']
            }
        },
        clean: {
            'es6': 'tests/fixtures/es6'
        },
        babel: {
            options: {
                "sourceMap": false,
                "minified": false,
                "comments": true,
                "sourceRoot": "tests/fixtures/src",
                "moduleIds": false,
                "moduleRoot": null,
                "presets": [
                    "es2015"
                ],
                "plugins": [
                    "transform-es2015-modules-systemjs"
                ]
            },
            anon: {
                files: [{
                    "expand": true,
                    "cwd": "tests/fixtures/src",
                    "src": ["*.js"],
                    "dest": "tests/fixtures/es6",
                    "ext": ".js"
                }]
            },
            bundle: {
                options: {
                    "sourceRoot": "tests/fixtures/src/bundle",
                    "moduleIds": true,
                    "moduleRoot": 'es6'
                },
                files: [{
                    "expand": true,
                    "cwd": "tests/fixtures/src/bundle",
                    "src": ["*.js"],
                    "dest": "tests/fixtures/es6/bundle",
                    "ext": ".js"
                }]
            }

        },
        concat: {
            fixtures: {
                src: 'tests/fixtures/es6/bundle/*.js',
                dest: 'tests/fixtures/es6/named.js'
            }
        },
        uglify: {
            options: {
                mangle: true,
                beautify: false,
                compress: {
                    sequences: true,
                    properties: true,
                    dead_code: true,
                    conditionals: true,
                    booleans: true,
                    loops: true,
                    unused: true,
                    hoist_funs: true,
                    if_return: true,
                    join_vars: true,
                    cascade: true,
                    collapse_vars: true,
                    warnings: false,
                    negate_iife: true,
                    pure_getters: true,
                    drop_console: true
                }
            },
            dist: {
                files: {
                    "garden-loader.min.js": ['garden-loader.js']
                }
            }
        },
    });

    grunt.registerTask('default', ['clean', 'babel', 'concat', 'uglify']);
};