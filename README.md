# Rediserve - a lightning fast web server for single page web apps stored in Redis

[![GitHub version](https://badge.fury.io/gh/cgatno%2Frediserve.svg)](https://badge.fury.io/gh/cgatno%2Frediserve) [![npm version](https://badge.fury.io/js/rediserve.svg)](https://badge.fury.io/js/rediserve)

This is a fast, compact, and straightforward web server designed to serve up single page web applications (SPAs) stored in a Redis database.

## Features

Before we get to the technical stuff, let's talk about some of Rediserve's core features:
- None yet, sorry!

---
If you're still not convinced, you can [read more about Rediserve below](#why-this-exists) or check out the [roadmap for future features](#roadmap).

## Installation

Install with:

```
npm install -g rediserve
```

## Usage example

_Note: first, make sure your app is [ready to use with rediserve](#setting-up-your-app-to-work-with-Rediserve)_

Rediserve can be started from the command line:

```
rediserve --app my-ember-app --assets "https://s3.amazonaws.com/my-bucket/my-ember-app/"
```

Or you can load it as a dependency in your Node.js project to further customize its behavior:

```
Coming soon!
```

## Why this exists

I think it's pretty good practice for every project (even if it's a small, side one!) to have to justify its own existence. So before you spend too much time reading about Rediserve and making your app compatible, let's talk about _why_ this could be a good idea for you.

Rediserve was born out of one simple need: _a need for speed_. All joking aside, most developers who are familiar with Redis know that it is [_fast_](https://redis.io/topics/benchmarks). As an in-memory data storage solution, Redis boasts all of the features of a full-fledged data platform while maintaining the speed of more "stripped down" solutions like memcached. Because of this, Redis has been used to speed up web applications in all kinds of unique and innovative ways.

Rediserve strives to take full advantage of the benefits offered by Redis to help you improve two vital aspects of your SPA:
1. [Performance](#performance)
2. [Development and deployment workflow](#deployment-and-development-workflow)

### Performance

One way that developers have taken advantage of Redis' speed is with [page caching](https://redislabs.com/ebook/redis-in-action/part-1-getting-started/chapter-2-anatomy-of-a-redis-web-application/2-3-web-page-caching). The advantages of this are obvious: speed and scalability. Loading a page from a memory cache is orders of magnitude faster than loading from disk. Plus, typically, memory cache solutions can handle a much greater load than other storage methods. (Not to mention setting up an entire Redis cluster has become extremely cheap and easy to do.)

### Deployment and development workflow

But Rediserve isn't designed or intended to _just_ speed up the delivery of your SPA to the end-user. While a major focus of Rediserve is providing fast and simple page caching, an equally important purpose is making your development and deployment workflows faster.

After watching [Luke Melia](http://www.lukemelia.com/)'s [2014 talk at RailsConf](https://www.youtube.com/watch?v=QZVYP3cPcWQ), I realized how powerful Redis could be as a workflow tool as well as a performance tool. I may have found Luke's talk 2 years after he gave it, but it's certainly still relevant today. (Better late than never!) As development teams optimize their workflows to iterate frontend projects faster than ever, Redis' simple key/value storage system becomes increasingly attractive as an iteration management system. How exactly? I'm glad you asked! Most deployment strategies already implement some type of hashing strategy to mark different iterations of assets. By applying this strategy to your SPA's `index.html` as well, you can serve multiple revisions at the same time! Still not making sense? That's okay, it is pretty confusing. Let's see how this would work with Redis:

**Redis data store**

|          Key          |                                 Value                                  |
|:----------------------|:------------------------------------------------------------------------|
| my-app:index:current  | a39nd129                                                               |
| my-app:index:a39nd129 | `<html> <head>   <title>Production</title> </head> ... </html>`        |
| my-app:index:dn38au55 | `<html> <head>   <title>Revision dn38au55</title> </head> ... </html>` |



## Setting up your app to work with Rediserve



## How it works

Rediserve takes advantage of a few other (popular, awesome, _really_ well-written) node modules, most notably [redis](https://www.npmjs.com/package/redis) and [express](https://www.npmjs.com/package/express).

## Roadmap

_See the [changelog](#changelog) for a list of previous changes_

**v0.3.0**
- Operational and full-featured CLI
- Standalone web server (via [express](https://github.com/expressjs/express/))
- Comprehensive docs

---

**v0.4.0**
- Revision management system available via API
- Built-in A/B testing mechanism
- Update docs, description, etc. for new feature set

---

**> v0.4.0**
- Extend revision management system and testing mechanics to CLI
- Deployment strategies for standalone SPAs

## Changelog

Nothing to show yet! Coming soon, though!

## How to Contribute

- Open a pull request or an issue about what you want to implement / change. I'm always looking for help to move the project forward!

  - I want this to be reliable and functional, so only submit thoroughly tested code!

## Contributors

- The original author of Rediserve is [Christian Gaetano](https://github.com/cgatno)

- [Matthew Ranney](https://github.com/mranney) is the creator of [_the best_ Redis client for node](https://github.com/NodeRedis/node_redis) that you can get your hands on

- The team behind [Express](https://github.com/expressjs/express/)

## License

[MIT](LICENSE)
