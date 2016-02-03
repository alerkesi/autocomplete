'use strict';

var webpackConfig = require('./webpack.config.js');
var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');

gulp.task('webpack', function(callback) {
    webpack(webpackConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
});

gulp.task('b', ['webpack']);