
var Q = require('q');
var Memcached = require('memcached');

const ASYNC_METHODS = [
    'touch',
    'get',
    'gets',
    'getMulti',
    'set',
    'replace',
    'add',
    'cas',
    'append',
    'preprend',
    'incr',
    'decr',
    'del'
];

var MemcachedQ = function (serverLocations, options) {
    this._memcached = new Memcached(serverLocations, options);

    // Auto-generate delegation to _memcached for all methods
    // on its API, using Q.nbind for things that ought to 
    // return promises.

    for (var p in this._memcached) {
        if (typeof this._memcached[p] === 'function') {
            if (ASYNC_METHODS.indexOf(p) === -1) {
                this[p] = this._memcached[p].bind(this._memcached);
            } else {
                this[p] = Q.nbind(this._memcached[p], this._memcached);
            }
        }
    }
};

module.exports = MemcachedQ;
