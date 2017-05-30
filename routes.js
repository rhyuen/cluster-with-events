"use strict";

const express = require("express");
const Event = require("./model/event.js");
const fs = require("fs");
const EVENTLOG = "events.txt";
let router = express.Router();

function logEvent(event, next){
    const event_for_db = new Event({
            eventType: event.type,
            data: event.data,
            uuid: event.uuid,
            processId: event.id,
            time: event.time
        });

    event_for_db.save((err, saved_event) => {
        if(err){
            console.error(err);
            next(err);
        }else{
            console.log("[W %s] LOG SAVED: %s", process.pid, saved_event);
            fs.appendFile(EVENTLOG, JSON.stringify(event) + "\n", (err) =>{
                if(err){
                    console.error(err);
                    next(err);                    
                }else{
                    console.log("[W %s] Event LOGGED.", process.pid);
                    next(null, saved_event);
                }
            });
        }
    });        
}

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

    logEvent(event, (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.status(200).send(`PROCESS ${process.pid} is listening to all incoming requests.`);
        }        
    });     
});

router.get("/vote", (req, res) => {
    //Get results and display them
    Event.find({eventType: "VOTE"}, (err, event) => {
        if(err){
            console.log(err);
        }else{
            console.log(event);
            let aggVotes = {"PYTHON": 0, "JAVA": 0};
            
            event.forEach((e) => {
                if(e.data === "PYTHON"){
                    aggVotes["PYTHON"]++;
                }else{
                    aggVotes["JAVA"]++;
                }
            });                            
            res.status(200).send(aggVotes);
        }
    });
});

router.get("/castvote", (req, res) => {
    const event = {
        type: "VOTE",
        data: (new Date().getTime() % 2 === 0) ? "JAVA":"PYTHON",
        uuid: Math.floor(Math.random()*10000000),
        id: process.id,
        time: new Date().getTime()
    };

    logEvent(event, (err, result) => {
        if(err){
            console.log(err);
        }else{            
            res.status(200).send(`Voted for ${result.data}`);
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
    logEvent(disconnect_event, (err) => {
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

module.exports = router;