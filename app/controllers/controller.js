"use strict";

const fs = require("fs"),
    Q = require("q"),
    databaseFileName = `${__dirname}/../databases/users.json`,
    purchases = require("./../models/purchasesModel");

module.exports = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            fs.readFile(databaseFileName, (err, content) => {
                if (err) {
                    reject(err);
                } else {
                    let users = [];
                    try {
                        users = JSON.parse(content.toString())
                    } catch (e) {
                        /* @todo описать какое-то действие */
                    }
                    resolve(users);
                }
            });
        });
    },

    add: (params) => {
        return Q.nfcall(fs.readFile, databaseFileName)
            .then((content) => {
                let users = [];
                try {
                    users = JSON.parse(content.toString());
                } catch (e) {

                }
                users.push(params);
                return users;
            })
            .then((users) => {
                return Q.nfcall(fs.writeFile, databaseFileName, JSON.stringify(users, null, 2))
                    .then(() => {
                        return users.length - 1;
                    });
            });
    },
    update: (id, params) => {
        return Q.nfcall(fs.readFile, databaseFileName)
            .then((content) => {
                let users = [];
                try {
                    users = JSON.parse(content.toString());
                } catch (e) {

                }
                users[Number(id)] = params;
                return users;
            })
            .then((users) => {
                return Q.nfcall(fs.writeFile, databaseFileName, JSON.stringify(users, null, 2));
            });
    },
    remove: (id) => {
        return Q.nfcall(fs.readFile, databaseFileName)
            .then((content) => {
                let users = [];
                try {
                    users = JSON.parse(content.toString());
                } catch (e) {

                }
                delete users[Number(id)];
                return users;
            })
            .then((users) => {
                return Q.nfcall(fs.writeFile, databaseFileName, JSON.stringify(users, null, 2));
            });
    },

    post: async(ctx,next) => {
        var purchasesPost = await purchases.post(ctx.params.id, ctx.request.body);
        if(purchasesPost) {
            ctx.status = 200;
            ctx.body = {"count": ctx.request.body["count"]};
        } else {
            ctx.body = "Dont work post";
        }
    },

    get:  async(ctx, next) => {
        var purchasesGet = await purchases.get(ctx.params.id);
        if(typeof purchasesGet === 'number'){
            ctx.body = {"count" : purchasesGet};
        } else {
            ctx.body = "User not exist in database or not correct type of user";
        }
    },

    del: async(ctx, next) => {
        var purchasesDelete = await purchases.delete(ctx.params.id);
        if(purchasesDelete){
            ctx.body ="Done"
        }else {
            ctx.body = "user does not exist in database";
        }
    }
};