'use strict';

// rediserve.js
// See README at https://github.com/cgatno/rediserve for more information

let rediserve = function () {};

let redis = require("redis"),
    redisClient = undefined;

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
            if (typeof (callback) == 'function') {
                callback(value, err);
            }
        });
    }
};

module.exports = new rediserve();