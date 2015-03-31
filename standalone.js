/*
 *
 * This is used to build the bundle with browserify.
 *
 */
var SomethingApp = require('./');

if (typeof global.window.define == 'function' && global.window.define.amd) {
    global.window.define('SomethingApp', function () { return SomethingApp; });
} else if (global.window) {
    global.window.SomethingApp = SomethingApp;
}