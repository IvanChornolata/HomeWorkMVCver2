# memcached-q

A wrapper for the npm "memcached" package which converts the asynchronous methods to a promise-based API, using npm "q" package's promise implementation.

## Installation

```shell
npm install memcached-q --save
```

## Usage
```shell
var MemcacheQ = require('memcached-q');

var cache = new MemcacheQ(serverLocations, options);

cache.set('foo', 'bar', 20)
    .catch(e => console.log('An error occurred: ', e));

// Later on:

cache.get('foo')
    .then(val => {
        if (val) {
            return val;
        } else {
            return expensiveFetchWithPromiseAPI();
        }
    })
    .then(val => {
        // Do something with result.
    });
```

## API Reference:

See the [memcached API docs](https://github.com/3rd-Eden/memcached) for more details. The API is identical except where node-style async functions are concerned.
