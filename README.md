# rediserve - a lightning fast Redis-linked, Express-based web server for EmberJS deployments

[![GitHub version](https://badge.fury.io/gh/cgatno%2Frediserve.svg)](https://badge.fury.io/gh/cgatno%2Frediserve) [![npm version](https://badge.fury.io/js/rediserve.svg)](https://badge.fury.io/js/rediserve)

This is a Redis client wrapper for working with lightning fast EmberJS deployments and workflows.

Install with:

```
npm install rediserve
```

Before going any further, I have to give a **huge** shoutout to [Matthew Ranney](https://github.com/mranney) and all of his collaborators for creating [_the best_ node Redis client](https://github.com/NodeRedis/node_redis) upon which this project heavily depends.

The team behind [Express](https://github.com/expressjs/express/?_ga=1.267161294.1148660095.1481577119) also deserves a lot of credit for providing such a user-friendly and configurable lightweight web server for Node.js.

## Usage example

```javascript
// index.js
// Example node.js web app using rediserve to fetch the markup of
// index.html for an EmberJS app deployed using the lightning deploy methodology
// (see https://www.youtube.com/watch?v=QZVYP3cPcWQ for more on the deployment strategy)

// Load up our dependencies
//
var rediserve = require('rediserve');

// Initialize the Express app to use as our server

var app = express();

// IMPORTANT: connect rediserve to Redis database first
rediserve.connect({
        password: process.env.REDIS_PASSWORD
    },
    function (eventName, eventMsg) { // define a callback to handle Redis database events
        console.log('Redis event: ' + eventName + ' (' + eventMsg + ')');
    });

// Route all other paths to get a single index.html since this is a single-page Ember app
app.get('/*', function (req, res) {
            // Specially route any requests with a url-defined rev variable (e.g. ?revision=3783dvb2386723v39)
            // WARNING: Don't do it this way for a production app! Make sure you somehow check or sanitize the
            // input from the request first!
            let desiredRev = req.query.revision;
            try {
                rediserve.getHtml({
                        appTag: 'ember-quickstart',
                        rev: desiredRev, // desiredRev will be undefined (default to current-content) or retrieved from the URL
                        callback: function(html) {
                            res.send(html);
                        }
                });
            } catch (e) {
                if (e instanceof rediserve.GetHtmlError) {
                    console.log('Could not retrieve HTML because ' + e.message);
                }
            }
});

// Start the server, listening on port 8080
app.listen(8080);
console.log('rediserve test server listening on port 8080...');
```

## How to Contribute

- Open a pull request or an issue about what you want to implement / change. I'm always looking for help to move the project forward!

  - I want this to be reliable and functional, so only submit thoroughly tested code!

## Contributors

The original author of rediserve is [Christian Gaetano](https://github.com/cgatno)

[Matthew Ranney](https://github.com/mranney) is the creator of [_the best_ node Redis client](https://github.com/NodeRedis/node_redis) upon which this project heavily depends.

The team behind [Express](https://github.com/expressjs/express/?_ga=1.267161294.1148660095.1481577119)

## License

[MIT](LICENSE)
