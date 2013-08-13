var Crawler = require('simplecrawler');

// Overwriting the addFetchCondition prototype - conflict in node-webkit
Crawler.prototype.addFetchCondition = function(callback) {
    var crawler = this;
    if (typeof callback === "function") {
        crawler._fetchConditions.push(callback);
        return crawler._fetchConditions.length - 1;
    } else {
        throw new Error("Fetch Condition must be a function.");
    }
};

var myCrawler = new Crawler("health.usf.edu", "/nursing");

myCrawler.interval = 2000;
myCrawler.maxConcurrency = 1;

var conditionID = myCrawler.addFetchCondition(function(parsedURL) {
    return !parsedURL.uriPath.match(/\.css$/i) &&
        !parsedURL.uriPath.match(/\.js$/i) &&
        !parsedURL.uriPath.match(/\.pdf$/i) &&
        !parsedURL.uriPath.match(/\.jpg$/i) &&
        !parsedURL.uriPath.match(/\.jpeg$/i) &&
        !parsedURL.uriPath.match(/\.png$/i) &&
        !parsedURL.uriPath.match(/\.gif$/i) &&
        !parsedURL.uriPath.match(/\.bmp$/i);
});

myCrawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
    console.log("I just received %s (%d bytes)",queueItem.url,responseBuffer.length);
    console.log("It was a resource of type %s",response.headers['content-type']);

    // Do something with the data in responseBuffer
});

myCrawler.start();
