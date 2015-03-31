var fs = require('fs'),
    pkg = require('./package'),
    minor_version = pkg.version.replace(/\.(\d)*$/, ''),
    major_version = pkg.version.replace(/\.(\d)*\.(\d)*$/, ''),
    path = require('path');

function rename_release (v) {
    return function (d, f) {
        var dest = path.join(d, f.replace(/(\.min)?\.js$/, '-'+ v + '$1.js').replace('sample-app-', ''));
        return dest;
    };
}

module.exports = function(grunt) {
    grunt.initConfig({
        bower_concat: {
            all: {
                dest: 'public/js/vendor/vendor.js',
                cssDest: 'css/vendor.scss',
                dependencies: {
                },
                exclude: [
                ]
            }
        },
        env : {
            options : {
                //Shared Options Hash
            },
            dev : {
                src: 'dev-env.json'
            }
        },
        express: {
            options: {},
            dev: {
                options: {
                    script: 'server.js',
                    nospawn: true,
                    delay: 5
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                ignores: [],
                additionalSuffixes: ['.js']
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            test: {
                src: [
                    'lib/**/*.js',
                    'index.js',
                    'server.js',
                    'standalone.js'
                ]
            }
        },
        browserify: {
            release: {
                files: {
                    'build/application.js': ['standalone.js']
                },
                options: {
                    transform: ['reactify', 'brfs', 'packageify', 'browserify-shim']
                }
            },
            debug: {
                files: {
                    'build/application.js': ['standalone.js']
                },
                options: {
                    bundleOptions: {
                        debug: true
                    },
                    watch: true,
                    transform: ['reactify', 'brfs', 'packageify', 'browserify-shim']
                }
            }
        },
        less: {
            dist: {
                options: {
                    paths: ['lib/css']
                },
                files: {
                    'lib/css/main.css': 'lib/css/main.less'
                }
            }
        },
        cssmin: {
            minify: {
                options: {
                    keepSpecialComments: 0
                },
                files: {
                    'public/css/main.min.css': ['lib/css/main.css']
                }
            }
        },
        copy: {
            dev: {
                files: {
                    'public/js/application.min.js': 'build/application.min.js',
                    'public/js/application.js':     'build/application.js'
                }
            },
            release: {
                files: [
                    { expand: true, flatten: true, src: 'build/*', dest: 'release/', rename: rename_release(pkg.version) },
                    { expand: true, flatten: true, src: 'build/*', dest: 'release/', rename: rename_release(minor_version) },
                    { expand: true, flatten: true, src: 'build/*', dest: 'release/', rename: rename_release(major_version) }
                ]
            }
        },
        exec: {
            'uglify': {
                cmd: 'node_modules/.bin/uglifyjs build/application.js  -b beautify=false,ascii_only=true > build/application.min.js',
                stdout: true,
                stderr: true
            }
        },
        clean: {
            css: ['lib/css/main.css', 'public/css/main.min.css'],
            js: ['release/', 'build/', 'public/js/application.js', 'public/js/application.min.js']
        },
        watch: {
            js: {
                files: ['build/application.js'],
                tasks: ['copy:dev'],
                options: {
                    livereload: true
                }
            },
            less: {
                files: [
                    'lib/**/*.less'
                ],
                tasks: ['build'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: [
                    'public/css/*.less'
                ],
                tasks: [],
                options: {
                    livereload: true
                }
            },
            express: {
                files: ['server.js', 'views/**/*.jade', 'lib/**/*.js'],
                tasks: ['jasmine_node', 'express:dev'],
                options: {
                    nospawn: true
                }
            }
        },
        compress: {
            main: {
                options: {
                    mode: 'gzip'
                },
                expand: true,
                cwd: 'release/',
                src: ['**/*'],
                dest: 'release-gzip/'
            }
        }
    });

    for (var key in grunt.file.readJSON('package.json').devDependencies) {
        if (key !== 'grunt' && key !== 'grunt-cli' && key.indexOf('grunt') === 0) { grunt.loadNpmTasks(key); }
    }

    grunt.registerTask('css',   ['clean:css', 'less:dist', 'cssmin:minify']);
    grunt.registerTask('js',    ['clean:js', 'jshint', 'bower_concat', 'jest', 'browserify:debug', 'exec:uglify', 'copy:dev']);
    grunt.registerTask('js-release',    ['clean:js', 'jshint', 'bower_concat', 'jest', 'jasmine_node', 'browserify:release', 'exec:uglify', 'copy:dev']);

    grunt.registerTask('build', ['css', 'js']);
    grunt.registerTask('build-release', ['css', 'js-release']);

    grunt.registerTask('dev',   ['env', 'express:dev', 'build', 'watch']);
    grunt.registerTask('release',   ['build-release']);
};