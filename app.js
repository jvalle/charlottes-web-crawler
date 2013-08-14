// Load Node modules
var Crawler = require('simplecrawler'),
    cheerio = require('cheerio');

// Overwrite the addFetchCondition prototype - conflict in node-webkit
Crawler.prototype.addFetchCondition = function(callback) {
    var crawler = this;
    if (typeof callback === "function") {
        crawler._fetchConditions.push(callback);
        return crawler._fetchConditions.length - 1;
    } else {
        throw new Error("Fetch Condition must be a function.");
    }
};

// Initialize new crawler
var myCrawler = new Crawler();

function initializeCrawler(options) {
    // Create a crawler and set up some options
    myCrawler.host = options.server;
    myCrawler.interval = options.interval;
    myCrawler.maxConcurrency = options.concurrency;

    // Ignore resources that we don't care about
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

    // Every time a page is fetched, so something magical with it
    myCrawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
        console.log("I just received %s (%d bytes)",queueItem.url,responseBuffer.length);
        console.log("It was a resource of type %s",response.headers['content-type']);

        // Do something with the data in responseBuffer
        var $ = cheerio.load(responseBuffer);
        console.log($('a').length);
    });

    myCrawler.start();
}

// Handle interaction with the user interface
var $startButton = $('<button class="btn btn-success" type="button" id="crawl-begin">Start</button>'),
    $endButton = $('<button class="btn btn-danger" type="button" id="crawl-end">Stop</button>');

$('#btn-main').append($startButton);

$startButton.on('click', function () {
    initializeCrawler({
        server: $('#crawl-url').val(),
        path: '/',
        interval: 2000,
        concurrency: 1
    });

    $(this).replaceWith($endButton);
});

$endButton.on('click', function () {
    myCrawler.stop();
    console.log('stopping');
    $(this).replaceWith($startButton);
});