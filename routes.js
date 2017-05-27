"use strict";

const express = require("express");
const Event = require("./model/event.js");
const fs = require("fs");
let router = express.Router();

router.get("/", (req, res) => {
    process.send({
        cmd: "GET",
        message: `[W ${process.pid}] Hello from ${process.pid}`
    });

    const event = {
        type: "OPEN",
        id: `${process.pid}`, 
        time: new Date().getTime()
    };

    const event_for_db = new Event({
        eventType: event.type,
        processId: event.id,
        time: event.time
    });

    event_for_db.save((err, saved_event) => {
        if(err){
            console.error(err);
        }else{
            console.log("[W] LOG SAVED: %s", saved_event);
        }
    });

    
    fs.appendFile("events.txt", JSON.stringify(event) + "\n", (err) =>{
        if(err)
            throw err;
        console.log("[W %s] Event LOGGED.", process.pid);
        res.status(200).send(`PROCESS ${process.pid} is listening to all incoming requests.`);
    });
});

router.get("/disconnect", (req, res) => {    
    const disconnect_event = {
        type: "disconnect",
        id: process.pid,
        time: new Date().getTime()
    };
    fs.routerendFile("events.txt", JSON.stringify(disconnect_event) + "\n", (err) => {
        if(err){
            console.log(err);
        }else{
            process.exit(0);
            res.status(200).send(`${process.pid} disconnected.`);            
        }        
    });    
});

router.get("/clear", (req, res) => {
    fs.writeFile("events.txt", "", (err) => {
        if(err){
            console.log(err);
        }else{
            console.log("[W %s] local event log cleared.", process.pid);
        }
    });
    Event.remove({}, (err, opRes) => {
        if(err){
            console.log(err);
        }else{
            res.status(200).send("EVENTS Cleared " + opRes);
        }
    });
});

module.exports = router;