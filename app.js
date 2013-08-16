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

// Functions
function initializeCrawler(options) {
    // Create a crawler and set up some options
    myCrawler.host = options.server;
    myCrawler.interval = options.interval;
    myCrawler.maxConcurrency = options.concurrency;

    // Ignore resources that we don't care about
    var conditionID = myCrawler.addFetchCondition(function(parsedURL) {
        var url = parsedURL.uriPath,
            i,
            ignore = [
                'css', 'js',
                'jpg', 'jpeg', 'png', 'gif', 'bmp',
                'pdf', 'doc', 'docx', 'ppt', 'pptx', 'zip'
            ];

        for (i = 0; i < ignore.length; i += 1) {
            if (url.indexOf(ignore[i], url.length - ignore[i].length) !== -1) { return false }
        }
        return true;
    });    

    myCrawler.start();
}

function displayResult(item, data) {
    var result = item.url;

    $('#results').append('<li>' + result + '</li>');    
}

// Events 
myCrawler.on('queueadd', function (item) {
    $('#qlength').html(myCrawler.queue.length);
});

// Every time a page is fetched, so something magical with it
myCrawler.on('fetchcomplete', function (queueItem, responseBuffer, response) {
    console.log("I just received %s (%d bytes)",queueItem.url,responseBuffer.length);
    console.log("It was a resource of type %s",response.headers['content-type']);

    var downloadedItemCount = myCrawler.queue.countWithStatus('downloaded', function (err, count) { return count });

    // Do something with the data in responseBuffer
    //var $ = cheerio.load(responseBuffer);
    //console.log($('a').length);

    $('#fitem').html(myCrawler.queue.oldestUnfetchedIndex);
    $('#ditems').html(downloadedItemCount);

    $('#downloaded-list').append("<li>" + queueItem.url + "</li>");
});

myCrawler.on('fetchredirect', function (item, parsedURL, response) {
    // is this only for items in the queue? should we do something like 
    // redirectcount++ whenever the even is fired? I guess we'll see once we start displaying results
    var redirectCount = myCrawler.queue.countWithStatus('redirected', function (err, count) { return count });

    $('#ritems').html(redirectCount);

    console.log(parsedURL);

    $('#redirected-list').append("<li>This: " + item.url + " redirected to: " + parsedURL.protocol + "://" + parsedURL.host + parsedURL.path +  "</li>");
});

// Handle interaction with the user interface

// TODO: these buttons don't exactly work more than once each...
var $startButton = $('<button class="btn btn-success" type="button" id="crawl-begin">Start</button>'),
    $endButton = $('<button class="btn btn-danger" type="button" id="crawl-end">Stop</button>');

$('#btn-main').append($startButton);
$('.nav.nav-tabs a:first').tab('show');

$('#crawl-options').on('click', '#crawl-begin', function () {
    initializeCrawler({
        server: $('#crawl-url').val(),
        path: '/',
        interval: 2000,
        concurrency: 1
    });

    $(this).replaceWith($endButton);
    console.log('starting');

}).on('click', '#crawl-end', function () {
    myCrawler.stop();
    console.log('stopping at queue: ' + myCrawler.queue.length);
    $(this).replaceWith($startButton);
});