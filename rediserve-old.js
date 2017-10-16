'use strict';

// rediserve.js
// See README at https://github.com/cgatno/rediserve for more information

let rediserve = function () {};

let redis = require("redis"),

let clientConnected = false;

/**
 * Connects rediserve to the Redis database holding the EmberJS index.html revisions. The library uses the npm
 * 'redis' package (https://www.npmjs.com/package/redis) to connect to Redis stores, so you must provide options
 * for the connection according to the redis package's documentation.
 *
 * @param {Object} options - an object containing options for connecting to Redis using the npm 'redis' package
 * For a full listing of options and documentation, see https://github.com/NodeRedis/node_redis/blob/master/README.md
 *
 * @param {function} redisEventCallback - a function to be called when the Redis connection client encounters one of the monitored
 * events (see 'Monitored Redis Events' section in the documentation). The function is passed two parameters: the event name and any
 * messages associated with the event.
 *
 * @returns {Object} The created Redis connection client returned by 'redis' (https://www.npmjs.com/package/redis) if the connection succeeds.
 * Returns false if there is a connection error.
 */
rediserve.prototype.connectToRedis = function (options, redisEventCallback) {
    // Connect to Redis using supplied options and node redis client
    redisClient = redis.createClient(options);

    let redisEventCallbackProvided = (typeof (redisEventCallback) == 'function');

    // Hook up connected and disconnected event listeners to pass on to the user
    // and to toggle our connectedness boolean
    redisClient.on('connect', function (err) {
        // if err is undefined then we must be connected!
        clientConnected = (typeof (err) === 'undefined');
        // call the supplied event callback with the proper status
        if (redisEventCallbackProvided) redisEventCallback(clientConnected ? 'connected' : 'error', err);
    });
    redisClient.on('end', function (err) {
        // regardless of errors we should be disconnected now
        clientConnected = false;
        // call the supplied event callback with the proper status
        if (redisEventCallbackProvided) redisEventCallback('disconnected', err);
    });

    // Hook up additional event listeners to the supplied event callback if provided
    if (redisEventCallbackProvided) {
        redisClient.on('error', function (err) {
            redisEventCallback('error', err);
        });
    }
    return clientConnected ? redisClient : false;
};

/* This is a much prettier and easier-to-type alias for the connectToRedis function */
rediserve.prototype.connect = rediserve.prototype.connectToRedis;

/* getHtml default values for options */
const DEF_APP_TAG = 'emberApp';
const DEF_INDEX_REV = 'current-content'; // this is the default key name for an activated EmberJS app's index.html content in Redis

/**
 * Gets the raw HTML of a specified index.html revision for the given app. If no revision is specified, the current HTML is retrieved.
 *
 * @param {Object} options - An object containing the options for HTML retrieval
 * @param {string} options.appTag - the app name that prefixes keys in the Redis store (e.g. emberApp:index:current)
 * @param {string} options.rev - the index.html revision to fetch. If no revision is specified, the current HTML is returned.
 * @param {function} options.callback - a function to be called when the HTML is retrieved. The retrieved HTML is passed to the callback function as a single parameter.
 *
 */
rediserve.prototype.getHtml = function (options) {
    // First check to see if options are even provided; if none are, then we have a problem so...RUN! (i.e. exit)
    if (typeof (options) === 'undefined' || Object.keys(options).length === 0) return false;
    this.options = options;
    // Check if more than one argument is provided - if so, user is probably trying to invoke
    // the deprecated method that took three parameters (appTag, rev, callback). Attempt to mitigate by
    // linking provided args to the new options format
    if (arguments.length > 1) {
        // only do this fallback if we aren't overwriting passed options
        if (typeof (this.options.appTag) === 'undefined') this.options.appTag = arguments[0];
        if (typeof (this.options.rev) === 'undefined') this.options.rev = arguments[1];
        if (typeof (this.options.callback) === 'undefined' && arguments.length >= 3) this.options.callback = arguments[2]; // here we have to check to make sure there are 3 args
    }

    // If any of the options are still undefined, set up defaults
    if (typeof (this.options.appTag) === 'undefined') this.options.appTag = DEF_APP_TAG;
    if (typeof (this.options.rev) === 'undefined') this.options.rev = DEF_INDEX_REV;
    // There's no default for a callback, so throw an error if a valid function is not defined
    if (typeof (this.options.callback) !== 'function') throw new rediserve.prototype.GetHtmlError('You must provide a valid callback function to which the HTML payload can be delivered.');

    let getHtmlCallback = this.options.callback;

    // If we're connected to Redis, fetch the HTML and deliver it via callback payload
    if (clientConnected) {
        // Build the desired key name from our app tag and revision
        let desiredKey = this.options.appTag + ':index:' + this.options.rev;
        redisClient.get(desiredKey, function (err, value) {
            // if there's an error then throw up the exception
            if (err) throw new rediserve.prototype.GetHtmlError(err);
            getHtmlCallback(value); // pass the HTML to our callback
        });
    } else { // if we're not connected then throw an error
        throw new rediserve.prototype.GetHtmlError('No Redis connection exists. Did you run rediserve.connect()?');
    }
};

/* Custom error handlers */
rediserve.prototype.GetHtmlError = function (message) {
    this.message = message;
    this.stack = (new Error()).stack;
}
rediserve.prototype.GetHtmlError.prototype = Object.create(Error.prototype);
rediserve.prototype.GetHtmlError.prototype.name = "GetHtmlError";
rediserve.prototype.GetHtmlError.prototype.message = "";
rediserve.prototype.GetHtmlError.prototype.constructor = rediserve.prototype.GetHtmlError;

module.exports = new rediserve();
