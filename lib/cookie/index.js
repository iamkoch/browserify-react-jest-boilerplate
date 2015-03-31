var Buffer = require('buffer').Buffer;

module.exports = Session;

function Session() {
    if (!(this instanceof Session)) {
        return new Session();
    }
}

var createCookie = function(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = '; expires=' + date.toGMTString();
    }
    else {
        expires = '';
    }
    var cookieToSave = name + '=' + value + expires + '; path=/';

    document.cookie = cookieToSave;
};

var readCookie = function(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1,c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length,c.length);
        }
    }
    return null;
};

function encode(str) {
    return new Buffer(str).toString('base64');
}

function decode(str) {
    return new Buffer(str, 'base64').toString();
}

function eraseCookie(name) {
    createCookie(name, '' ,-1);
}

Session.prototype.save = function(key, value, days) {
    var val = (typeof value !== 'object' ? value : JSON.stringify(value));


    createCookie(key, encode(val), days);
};

Session.prototype.get = function(key, returnAsObject) {
    var result = readCookie(key);
    if(result === null) {
        return null;
    }
    var decoded = decode(result);

    if (returnAsObject) {
        return JSON.parse(decoded);
    }

    return decoded;
};

Session.prototype.remove = function(key) {
    eraseCookie(key);
};
