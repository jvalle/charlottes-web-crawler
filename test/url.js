var assert = require("assert"),
    util = require('../js/utils.js');

describe('getUrlParts', function () {
    var invalidUrl = "fail",
        validUrls = ["https://sub.example.com:8080/some-path",
                     "t.co/",
                     "some.url.com/long/path/name"];

    // Make sure the invalid URL fails
    it('should return false when the base URL is invalid.', function () {
        assert.equal(false, util.getUrlParts(invalidUrl));
    });

    // Loop through each valid URL and make sure they each pass
    validUrls.forEach(function (url) {
        it('should return a numeric port number when given a valid url', function () {
            assert.equal('number', typeof util.getUrlParts(url).port);
        });

        it('should return a protocol property that begins with http', function () {
            assert.equal(0, util.getUrlParts(url).protocol.indexOf('http'));
        });

        it('should return a path property that begins with /', function () {
            assert.equal(0, util.getUrlParts(url).path.indexOf('/'));
        });

        // this test can be expanded, and the code in the library could be improved
        it('should return a server/domain that is a valid url', function () {
            assert.notEqual(-1, util.getUrlParts(url).server.indexOf('.'));
            assert.notEqual(0, util.getUrlParts(url).server.indexOf('.'));
        });
    });
});
