"use strict";

const express = require("express");
const logger = require("morgan");
const cluster = require("cluster");
const mongoose = require("mongoose");
const fs = require("fs");
const config = require("./config.js");

mongoose.connect(config.db, (err) => {
    if(err){
        
    }else{
        console.log("Connected");
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

    fs.appendFile("events.txt", `${event}\n`, (err) =>{
        if(err)
            throw err;
        console.log("LOGGED %s", process.pid);
    });

    res.status(200).send(`PROCESS ${process.pid} is listening to all incoming requests.`);            
});
// app.get("/alt", (req, res) => {

// });


app.listen(app.get("PORT"), () => {
    console.log("LISTEN on PORT %s.", app.get("PORT"));
});
