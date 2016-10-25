// rediserve.js
/* rediserve is a custom nodejs web server designed to be used in conjunction with the Redis-based storage of the Ember Lightning Fast Deployment methodology. The server leverages ExpressJS to quickly serve up current index.html markup while allowing developers and QA teams to easily view specific revisions of index.html before making them public. */

var rediserve = function () {};

rediserve.prototype.up = function(redisCli, expressApp) {
    
}

module.exports = new rediserve();