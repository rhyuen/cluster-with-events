"use strict";

const express = require("express");
const logger = require("morgan");
const cluster = require("cluster");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");
const Event = require("./model/event.js");
const config = require("./config.js");

mongoose.connect(config.db, (err) => {
    if(err){
        console.error(err);
    }else{
        console.log("process %s: DB Connected", process.pid);
    }
});


process.on("message", () => {
    process.send({
        type: "confirmation",
        from: `${process.pid}`
    });
});


let app = express();
app.set("PORT", process.env.PORT || 9090);
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.get("/", (req, res) => {
    process.send({
        cmd: "GET",
        sender: `${process.pid}`,
        message: `Hello from ${process.pid}`
    });

    const event = {
        type: "open",
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
            console.log("LOG SAVED: %s", saved_event);
        }
    });

    
    fs.appendFile("events.txt", JSON.stringify(event) + "\n", (err) =>{
        if(err)
            throw err;
        console.log("LOGGED %s", process.pid);
        res.status(200).send(`PROCESS ${process.pid} is listening to all incoming requests.`);
    });
});

app.get("/disconnect", (req, res) => {    
    const disconnect_event = {
        type: "disconnect",
        id: process.pid,
        time: new Date().getTime()
    };
    fs.appendFile("events.txt", JSON.stringify(disconnect_event) + "\n", (err) => {
        if(err){
            console.log(err);
        }else{
            process.exit(0);
            res.status(200).send(`${process.pid} disconnected.`);            
        }        
    });    
});

app.listen(app.get("PORT"), (err) => {
    console.log("LISTEN on PORT %s.", app.get("PORT"));
});
