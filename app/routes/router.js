"use strict";

module.exports = function (app){

    const Router = require('koa-router');
    const path = require('path');
    const router = new Router();
    const bodyParser = require('koa-bodyparser');
    const controller = require('../controllers/controller');
    const purchases = require('../models/purchasesModel');

    /**
     * @example curl -v -X GET "http://127.0.0.1:3000/users"
     */
    router.get("/users", async(ctx, next) => {
        console.log(2)
        ctx.body = await controller.getAll();
    });


    /**
     * @example curl -v -X GET "http://127.0.0.1:3000/users/1"
     */
    router.get("/users/:id", async(ctx, next) => {
        ctx.body = await controller.getById(ctx.params.id);
    });


    /**
     * @example curl -v -X POST "http://127.0.0.1:3000/users" -d '{"name": "Vasya"}' -H "Content-Type: application/json"
     */
    router.post('/users', bodyParser(), async(ctx, next) => {
        let userId = await controller.add(ctx.request.body);
        if (typeof userId === 'number') {
            ctx.status = 201;
            ctx.body = {"id": userId};
        } else {
            ctx.status = 400;
        }
    });


    /**
     * @example curl -v -X PUT "http://127.0.0.1:3000/users/1" -d '{"name":"Petya"}' -H "Content-Type: application/json"
     */
    router.put('/users/:id', bodyParser(), async(ctx, next) => {
        try {
            await controller.update(ctx.params.id, ctx.request.body);
            ctx.status = 200;
        } catch (e) {
            ctx.status = 400;
        }
    });


    /**
     * @example curl -v -X DELETE "http://127.0.0.1:3000/users/1"
     */
    router.del("/users/:id", async(ctx, next) => {
        try {
            await controller.remove(ctx.params.id)
            ctx.status = 204;
        } catch (e) {
            ctx.status = 400
        }
    });

    /**
     * @example curl -v -X POST "http://127.0.0.1:3000/users/5/purchases" -d '{"count": 10}' -H "Content-Type: application/json"
     */
    router.post("/users/:id/purchases", bodyParser(), controller.post);

    /**
     * @example curl -v -X GET "http://127.0.0.1:3000/users/1/purchases"
     */
    router.get("/users/:id/purchases",controller.get);

    /**
     * @example curl -v -X DELETE "http://127.0.0.1:3000/users/5/purchases"
     */
    router.del("/users/:id/purchases", controller.del);

    app.use(async(ctx, next) => {
        try {
            await next();
        } catch (e) {
            ctx.body = JSON.stringify({message: e.message});
            ctx.status = 500;
        }
    });
    app.use(router.routes());
    app.use(router.allowedMethods());




};
