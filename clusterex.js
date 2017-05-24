"use strict";

const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

if(cluster.isMaster){
    // require("os").cpus().map((item) => {
    //     console.log(item);
    // });

    console.log(`Master ${process.pid} is running.`);

    for(let i = 0; i < numCPUs; i++){
        cluster.fork();
    }

    for(const id in cluster.workers){
        cluster.workers[id].on("message", (msg) => {
            
            console.log(msg.cmd);
            console.log(msg.sender);
            console.log(msg.message);
        });
    }

    cluster.on("message", (worker) => {
        console.log("Received message from worker.");        
    });

    cluster.on("online", (worker) => {
        console.log(`Worker ${worker.process.pid} is online`);
    });

    cluster.on("listening", (address) => {
        console.log("Worker listening on %s", address);
    });

    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died with ${code} and ${signal}.`);
        console.log("Starting new worker.");
        cluster.fork();
    });
    
}else{
    require("./worker.js");
}