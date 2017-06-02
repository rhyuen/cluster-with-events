"use strict";

const express = require("express");
const fs = require("fs");
const Event = require("../model/event.js");
const ES = require("../shared/eventsource-log.js");
const EVENTLOG = "events.txt";
let router = express.Router();


router.get("/", (req, res) => {
    process.send({
        cmd: "GET",
        message: `[W ${process.pid}] root reach from ${process.pid}`,
        sender: `${process.pid}`
    });
 
    const event = {
        type: "OPEN",
        data: "No Extra data.",
        uuid: Math.floor(Math.random()*1000000),
        id: `${process.pid}`, 
        time: new Date().getTime()
    };

    ES.logEvent(event, (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.status(200).send(`PROCESS ${process.pid} is listening to all incoming requests.`);
        }        
    });     
});

router.get("/disconnect", (req, res) => {    
    const disconnect_event = {
        type: "DISCONNECT",
        data: "No extra data for disconnect event.",
        uuid: Math.floor(Math.random()*1000000),
        id: process.pid,
        time: new Date().getTime()
    };
    ES.logEvent(disconnect_event, (err) => {
        if(err){
            console.log(err);
        }else{
            process.exit(0);
            res.status(200).send(`PROCESS ${process.pid} disconnected.`);
        }        
    });
});

router.get("/clear", (req, res) => {
    fs.writeFile(EVENTLOG, "", (err) => {
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

router.get("/smoke", (req, res) => {
    res.status(200).send("Nothing special.  Docker test.");
});

module.exports = router;