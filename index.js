var EventEmitter = require('events').EventEmitter,
    ocreate = require('./lib/object-create'),
    App = require('./lib/ui-app'),
    React = require('react');

module.exports = SomethingApp;

function SomethingApp() {
    if (!(this instanceof SomethingApp)) {
        return new SomethingApp(arguments);
    }
}

SomethingApp.version = require('package.version');

SomethingApp.prototype = ocreate(EventEmitter.prototype);

SomethingApp.prototype.render = function(elementId) {
    React.render(
        <App />,
        document.getElementById(elementId)
    );
};