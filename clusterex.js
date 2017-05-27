"use strict";

const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

if(cluster.isMaster){    
    console.log(`[M]: ${process.pid} is running in ENV ${process.env.NODE_ENV}.`);

    for(let i = 0; i < numCPUs; i++){
        cluster.fork();
    }

    for(const id in cluster.workers){
        cluster.workers[id].on("message", (msg) => {
            
            console.log("[M]: " + msg.cmd);
            console.log("[M]:" + msg.sender);
            console.log("[M]:" + msg.message);
        });
    }

    cluster.on("message", (worker) => {
        console.log("[M]: Received message from worker.");        
    });

    cluster.on("online", (worker) => {
        console.log(`[M]: Worker ${worker.process.pid} is online`);
    });
    

    cluster.on("exit", (worker, code, signal) => {
        console.log(`[M: Worker ${worker.process.pid} died with ${code} and ${signal}.`);
        console.log("[M]: Starting new worker.");
        cluster.fork();
    });
    
}else{
    require("./worker.js");
}