"use strict";

const express = require("express");
const logger = require("morgan");
const cluster = require("cluster");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("./config.js");
const routes = require("./routes.js");

mongoose.connect(config[process.env.NODE_ENV].db, (err) => {
    if(err){
        console.error(err);
    }else{
        console.log(`[W ${process.pid}]: DB Connected.`);
    }
});

process.on("message", () => {
    process.send({
        type: "Confirmation",
        from: `${process.pid}`,
        data: `[W ${process.pid}] Message received.`
    });
});

let app = express();
app.set("PORT", process.env.PORT || 9090);
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(routes);

app.listen(app.get("PORT"), (err) => {
    console.log("[W %s] LISTEN on PORT %s.", process.pid, app.get("PORT"));
});
