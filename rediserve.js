'use strict';

// rediserve.js
/* rediserve is a custom nodejs web server designed to be used in conjunction with the Redis-based storage of the Ember Lightning Fast Deployment methodology. The server leverages ExpressJS to quickly serve up current index.html markup while allowing developers and QA teams to easily view specific revisions of index.html before making them public. */

var rediserve = function () {};

/**
 * Initialize a rediserve web server listening on port 8080 using provided Express routing and Redis client connection. No additional configuration can be performed at this time.
 * 
 * TODO: Add configuration options!
 * 
 * @param {Object} redisCli - An initialized Redis client connection from node_redis (https://github.com/NodeRedis/node_redis)
 * @param {Object} expressApp - An initialized ExpressJS app object (e.g. var app = express();). See ExpressJS documentation for more information (http://expressjs.com/)
 * @param {string} appName - A string representation of the app name. The server assumes that this is also a prefix for keys in your Redis database (i.e. appName:index:current) 
 */
rediserve.prototype.up = function (redisCli, expressApp, appName) {
    expressApp.get('*', function (req, res) {
        redisCli.get(appName + ':index:current-content'),
            function (err, value) {
                if (!err) {
                    let html = value;
                    res.send(html);
                } else {
                    throw new rediserve.RedisGetException(err);
                }
            }
    });
    expressApp.listen(8080);
}

/**
 * Defines a specialized exception for Redis GET errors
 * 
 * @param {string} message - A message explaining (in detail!) the cause of a Redis GET error
 */
rediserve.prototype.RedisGetException = function (message) {
    this.message = message;
    this.name = "RedisGetException";
}

module.exports = new rediserve();