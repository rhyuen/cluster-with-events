"use strict";
const Event = require("../model/event.js");
const EVENTLOG = "events.txt";
const fs = require("fs");

exports.logEvent = (event, next) => {
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