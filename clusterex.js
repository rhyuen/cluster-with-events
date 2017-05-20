"use strict";

const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;
const express = require("express");


if(cluster.isMaster){
    require("os").cpus().map((item) => {
        console.log(item);
    });

    console.log(`Master ${process.pid} is running.`);

    for(let i = 0; i < numCPUs; i++){
        cluster.fork();
    }

    cluster.on("online", (worker) => {
        console.log(`Worker ${worker.process.pid} is online`);
    });

    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died with ${code} and ${signal}.`);
        console.log("Starting new worker.");
        cluster.fork();
    });
}else{
    // http.createServer((req, res) => {
    //     res.writeHead(200);
    //     res.end(`${process.pid}`);
    // }).listen(8000);
    // console.log(`Worker ${process.pid} started.`);

    let app = express();
    app.set("PORT", process.env.PORT || 9090);
    app.use((req, res) => {
        res.status(200).send(`PROCESS ${process.pid} is listening to all incoming requests.`);
    });
    app.listen(app.get("PORT"), () => {
        console.log("LISTEN on PORT %s.", app.get("PORT"));
    });
}