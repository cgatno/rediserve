'use strict';

// rediserve.js
// See README at https://github.com/cgatno/rediserve for more information

let rediserve = function () {};

let redis = require("redis"),
    redisClient = undefined;

let clientConnected = false;

/**
 * 
 * 
 * @param {Object} options - an object containing options for connecting to Redis using the npm 'redis' package
 * For a full listing of options and documentation, see https://github.com/NodeRedis/node_redis/blob/master/README.md
 * 
 * @param {function} connectCallback - a function to be called when the connection to the Redis client is made
 * @param {function} disconnectCallback - a function to be called when the connection to the Redis client is closed
 */
rediserve.prototype.connectToRedis = function (options, connectCallback, disconnectCallback) {
    // Connect to Redis using supplied options and node redis client
    redisClient = redis.createClient(options);

    // Hook up the connect and disconnect event listeners to toggle our boolean indicator of connectedness
    redisClient.on('connect', function () {
        clientConnected = true;
        if (typeof (connectCallback) == 'function') connectCallback();
    });
    redisClient.on('end', function () {
        clientConnected = false;
        if (typeof (disconnectCallback) == 'function') disconnectCallback();
    });
};

/* This is a much prettier and easier-to-type alias for the connectToRedis function */
rediserve.prototype.connect = rediserve.prototype.connectToRedis;

/**
 * Gets the raw HTML of a specified index.html revision for the given app. If no revision is specified, the current HTML is retrieved.
 *  
 * @param {string} [appTag='emberApp'] - the app name that prefixes keys in the Redis store (e.g. emberApp:index:current)
 * @param {string} [rev='current'] - the index.html revision to fetch. If no revision is specified, the current HTML is returned.
 * @param {function} callback - a function to be called when the HTML is retrieved. The parameters passed to the function are the retrieved HTML and any error messages, in that order.
 * 
 * TODO: Fix the way parameters work here so that appTag and rev are truly optional while callback is required. Fix by release 0.2.0
 */
rediserve.prototype.getHtml = function (appTag = 'emberApp', rev = 'current', callback) {
    if (clientConnected) {
        let desiredKey = appTag + ':index:' + rev;
        redisClient.get(desiredKey, function (err, value) {
            if (typeof(callback) == 'function') {
                callback(value, err);
            }
        });
    }
};

module.exports = new rediserve();