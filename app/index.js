"use strict";

const Koa = require("koa");
const app = new Koa();

const config = require("config");


require("./routes/router")(app);
app.listen(config.server.port);