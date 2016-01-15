var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate'),
    jshint = require('gulp-jshint'),
    html2js = require('gulp-html2js'),
    less = require('gulp-less'),
    merge = require('merge-stream'),
    rename = require("gulp-rename"),
    KarmaServer = require('karma').Server,
    wiredep = require('wiredep').stream,
    _ = require('lodash'),
    gzip = require('gulp-gzip'),
    rimraf = require('rimraf'),
    git = require('gulp-git'),
    filter = require('gulp-filter'),
    runSequence = require('run-sequence'),
    bump = require('gulp-bump'),
    gutil = require('gulp-util'),
    fs = require('fs');

var paths = {
    dist: 'dist/',
    libs: [
        // bower:js
        'bower_components/angular/angular.js',
        'bower_components/lodash/lodash.js',
        'bower_components/jquery/dist/jquery.js',
        'bower_components/bootstrap/dist/js/bootstrap.js',
        'bower_components/rrule/lib/rrule.js',
        'bower_components/rrule/lib/nlp.js',
        'bower_components/moment/moment.js',
        'bower_components/moment-timezone/builds/moment-timezone-with-data-2010-2020.js',
        // endbower
    ],
    libsCss: [
        // bower:css
        'bower_components/bootstrap/dist/css/bootstrap.css',
        // endbower
    ],
    scripts: [
        'src/app.js',
        'src/**/*.js',
        '!**/*Spec.js'
    ],
    less: 'src/angularUiScheduler.less',
    tests: [
        'src/**/*Spec.js'
    ],
    partials: [
        'src/**/*.html'
    ],
    scriptsOut: 'angular-ui-scheduler.js',
    partialsOut: 'angular-ui-scheduler-tpl.js',
    lessOut: 'angular-ui-scheduler.css'
};

function scriptsPipeFactory(src, dest, filename) {
    return function () {
        return gulp.src(src)
            .pipe(jshint())                           // lint out file
            .pipe(jshint.reporter('jshint-stylish'))  // output to stylish
            //.pipe(jshint.reporter('fail'))          // prevent from continuing in case of jsHint Errors
            .pipe(ngAnnotate())
            .pipe(sourcemaps.init())
            .pipe(concat(filename))
            .pipe(gulp.dest(dest))
            .pipe(rename({extname: '.min.js'}))
            .pipe(uglify())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(dest))
            .pipe(gzip())
            .pipe(gulp.dest(dest));
    }
}

function lessPipeFactory(src, dest, basename) {
    return function () {
        return gulp.src(src)
            .pipe(less({
                paths: [__dirname]
            }))
            .pipe(rename(basename))
            .pipe(gulp.dest(dest));
    }
}

function html2jsPipeFactory(src, dest, basename) {
    return function () {
        gulp.src(src)
            .pipe(html2js({
                base: '.',
                rename: function (moduleName) {
                    return 'angular-ui-scheduler/' + moduleName;
                },
                outputModuleName: 'angular-ui-scheduler',
                useStrict: true,
                singleModule: true,
                htmlmin: {
                    //collapseBooleanAttributes: true,
                    //collapseWhitespace: true
                    //removeAttributeQuotes: true,
                    //removeComments: true
                    //removeEmptyAttributes: true,
                    //removeRedundantAttributes: true,
                    //removeScriptTypeAttributes: true,
                    //removeStyleLinkTypeAttributes: true
                }
            }))
            .pipe(concat(basename))
            .pipe(gulp.dest(dest))
            .pipe(gzip())
            .pipe(gulp.dest(dest));
    }
}

function testPipeFactory(tests, scripts, partials, karmaConfigName) {
    var es = require('event-stream');
    var Q = require('q');

    function resolve(files) {

        var deferred = Q.defer();
        var resolvedScripts = [];

        gulp.src(files)
            .pipe(es.through(function write(file) {
                    resolvedScripts.push(file.path);
                },
                function end() {
                    deferred.resolve(resolvedScripts);
                }));

        return deferred.promise;
    }

    return function () {
        return resolve(scripts)
            .then(function (resolvedScripts) {

                //separate libs
                var files = [].concat(paths.libs);

                //concatenated libs
                //var files = [].concat(paths.dist + paths.shared.libsOut);

                files = files.concat('bower_components/angular-mocks/angular-mocks.js');
                files = files.concat('testMock/*Mock.js');

                files = files.concat(paths.dist + paths.partialsOut);
                if (partials) {
                    files = files.concat(paths.dist + partials);
                }

                files = files.concat(resolvedScripts);
                files = files.concat(tests);

                var preprocessorConf = {};
                _.forEach(resolvedScripts, function (item) {
                    preprocessorConf[item] = 'coverage';
                });

                var karmaConfig = {
                    basePath: '.',
                    frameworks: ['jasmine'],
                    files: files,
                    preprocessors: preprocessorConf,
                    reporters: ['progress', 'coverage', 'junit'],
                    coverageReporter: {
                        reporters: [{
                            type: 'text-summary'
                        }, {
                            type: 'lcov',
                            dir: 'coverage/'
                        }
                        ]
                    },
                    junitReporter: {
                        outputDir: (process.env['CIRCLE_TEST_REPORTS'] || '$CIRCLE_TEST_REPORTS') + '/js/',
                        outputFile: 'TEST-shared.xml'
                    },
                    colors: true,
                    browsers: ['PhantomJS'],
                    captureTimeout: 60000,
                    port: 9876,
                    singleRun: true,
                    autoWatch: false
                };

                //save config
                var fs = require('fs');
                fs.writeFileSync(karmaConfigName, "module.exports = function (config) {config.set(" + JSON.stringify(karmaConfig) + ");};");
            });
    }
}

function testRunPipeFactory(karmaConfigName) {
    return function (done) {
        var server = new KarmaServer({
            configFile: __dirname + "/" + karmaConfigName
        }, done);

        server.start();
    }
}

gulp.task('buildSrc', scriptsPipeFactory(paths.scripts, paths.dist, paths.scriptsOut));
gulp.task('buildPartials', html2jsPipeFactory(paths.partials, paths.dist, paths.partialsOut));
gulp.task('buildLess', lessPipeFactory(paths.less, paths.dist, paths.lessOut));

gulp.task('build', ['buildSrc', 'buildPartials', 'buildLess']);

gulp.task('generateTestConfig', ['buildPartials'], testPipeFactory(paths.tests, paths.scripts, paths.partialsOut, 'karma.config.js'));

gulp.task('test', ['generateTestConfig'], testRunPipeFactory('karma.config.js'));


gulp.task('default', ['build', 'test']);

gulp.task('watch', function () {
    gulp.watch(paths.scripts, ['buildSrc']);

    gulp.watch(paths.partials, ['buildPartials']);

    gulp.watch(paths.less.replace('angular-ui-scheduler.css', '**/*'), ['buildLess']);

    gulp.watch(paths.tests, ['generateTestConfig']);
});

gulp.task('clean', function (cb) {
    rimraf(paths.dist, cb);
});

gulp.task('wiredep', function () {
    gulp.src(['gulpfile.js', 'demo/index.html'])
        .pipe(wiredep({
            fileTypes: {
                js: {
                    block: /(([ \t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
                    detect: {
                        js: /\s*['"](.+)['"],\s*/gi
                    },
                    replace: {
                        js: '"{{filePath}}",'
                    }
                }
            },
            dependencies: true,
            devDependencies: false
        }))
        .pipe(gulp.dest(function (item) {
            return item.base;
        }));
});

//------------ publishing
gulp.task('bump-patch-version', function () {
    return gulp.src(['./bower.json', './package.json'])
        .pipe(bump({type: "patch"}).on('error', gutil.log))
        .pipe(gulp.dest('./'));
});

gulp.task('commit-changes', function () {
    return gulp.src('.')
        .pipe(git.commit('Bumped version number'));
});

gulp.task('push-changes', function (cb) {
    git.push('origin', 'master', cb);
});

gulp.task('create-new-tag', function (cb) {
    var version = getPackageJsonVersion();
    git.tag(version, 'Created Tag for version: ' + version, function (error) {
        if (error) {
            return cb(error);
        }
        git.push('origin', 'master', {args: '--tags'}, cb);
    });

    function getPackageJsonVersion() {
        //We parse the json file instead of using require because require caches multiple calls so the version number won't be updated
        return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
    }
});

gulp.task('release', function (callback) {
    runSequence(
        //'default',
        'build',
        'bump-patch-version',
        'commit-changes',
        'push-changes',
        'create-new-tag',
        function (error) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('RELEASE FINISHED SUCCESSFULLY');
            }
            callback(error);
        });
});