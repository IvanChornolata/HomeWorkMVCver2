"use strict";

const controller = require('../controllers/controller');
const fs = require("fs"),
    Memcached = require("memcached-q"),
    Q = require("q"),
    databaseFileName = `${__dirname}/../databases/users.json`;

var memcached = new Memcached("127.0.0.1:11211");

module.exports = {
    get: async (id) => {
        var userInBase = await getById(id);
        if (userInBase || userInBase != null) {
            return memcached.get(String(id))
            .then(val => {
                console.log(val);
                if (typeof val === 'number') {
                    return Number(val);
                } else {
                    return "Dont exist in base";
                }
            })
            .then(val => {
                return val;
            });
        }
    },

    post: async (id, params) => {
        var userInBase = await getById(id);
            if (userInBase) {
                return memcached.set(String(id), params["count"], 300)
                    .then(() => {return true})
                    .catch(e => console.log('An error occurred: ', e));
            } else {
                return false;
            }
    },

    delete: async (id) => {
        return memcached.del(String(id)).then(() => {
            return true})
    }
};

function getById (id) {
    return Q.nfcall(fs.readFile, databaseFileName)
        .then((content) => {
            return content.toString(); //Buffer --> String
        })
        .then(JSON.parse) // String --> Object
        .get(Number(id)); // Object[index] --> Object
}

// module.exports = MemcachedQ;