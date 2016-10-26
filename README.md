rediserve - a lightning fast Redis interface for EmberJS deployments
=========================

[![GitHub version](https://badge.fury.io/gh/cgatno%2Frediserve.svg)](https://badge.fury.io/gh/cgatno%2Frediserve) [![npm version](https://badge.fury.io/js/rediserve.svg)](https://badge.fury.io/js/rediserve)

This is a Redis client wrapper for working with lightning fast EmberJS deployments and workflows.

Install with:

    npm install rediserve

Before going any further, I have to give a __huge__ shoutout to [Matthew Ranney](https://github.com/mranney) and all of his collaborators for creating [_the best_ node Redis client](https://github.com/NodeRedis/node_redis) upon which this project heavily depends.

## Usage example

```js
// index.js
// Example node.js web app using rediserve to fetch the markup of
// index.html for an EmberJS app deployed using the lightning deploy methodology
// (see https://www.youtube.com/watch?v=QZVYP3cPcWQ for more on the deployment strategy)

// Load up our dependencies

var express = require('express');
var redis = require('redis');
var rediserve = require('rediserve');

// Initialize the Express app to use as our server

var app = express();

// IMPORTANT: connect rediserve to Redis database first
rediserve.connectToRedis({password: '\\@}R^0c|,M,LW])kr&W?G9'},
        function() {
                console.log('Connected to Redis!'); // Define a callback for when we connect
        },
        function() {
                console.log('Disconnected from Redis.'); // Define a callback in the event we're disconnected :(
        });

// Listen on all paths since this is a single-page Ember app
app.get('*', function(req, res) {
        rediserve.getHtml('ember-quickstart', 'current-content', function(html, err) {
                if (!err) {
                        res.send(html);
                } else {
                        console.log('Error fetching HTML! ' + err);
                }
        });
});

// Start listening for connections on port 8080
app.listen(8080);
```

## How to Contribute
- Open a pull request or an issue about what you want to implement / change. I'm always looking for help to move the project forward!
 - I want this to be reliable and functional, so only submit thoroughly tested code!

## Contributors

The original author of rediserve is [Christian Gaetano](https://github.com/cgatno)

[Matthew Ranney](https://github.com/mranney) is the creator of [_the best_ node Redis client](https://github.com/NodeRedis/node_redis) upon which this project heavily depends.

## License

[MIT](LICENSE)