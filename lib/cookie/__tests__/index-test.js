jest.dontMock('../index');

var Cookie = require('../index');

describe('Cookie Specifications', function() {
    var cookie;

    beforeEach(function() {
        cookie = new Cookie();
    });

    describe('#save', function() {
        it('should save a base 64 encoded stringified version of an object', function() {
            var valueToSave = {a: 1, b: 2};
            var valueToSaveStringifiedAndEncoded = 'eyJhIjoxLCJiIjoyfQ';

            cookie.save('one', valueToSave);

            expect(document.cookie).toContain(valueToSaveStringifiedAndEncoded);
        });
    });

    describe('#get', function() {
        it('should decode the cookie into an object when true is passed', function() {
            document.cookie = 'one=eyJhIjoxLCJiIjoyfQ==; path=/';

            var result = cookie.get('one', true);

            expect(result.a).toBe(1);
            expect(result.b).toBe(2);
        });

        it('should return the cookie contents as a string if false or nothing is passed', function() {
            document.cookie = 'one=eyJhIjoxLCJiIjoyfQ==; path=/';

            var result = cookie.get('one', false);

            expect(result).toBe('{"a":1,"b":2}');
        });
    });

    describe('#remove', function() {
        it('should delete the cookie', function() {
            var originalCookieValue = 'one=eyJhIjoxLCJiIjoyfQ==; path=/';

            document.cookie = originalCookieValue;

            cookie.remove('one');
            expect(document.cookie).not.toBe(originalCookieValue);
            expect(document.cookie).toBe('one=');
        });
    });
});