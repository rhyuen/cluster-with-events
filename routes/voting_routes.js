const express = require("express");
const Event = require("../model/event.js");
const ES = require("../shared/eventsource-log.js");
const router = express.Router();

router.get("/", (req, res) => {
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

    ES.logEvent(event, (err, result) => {
        if(err){
            console.log(err);
        }else{            
            res.status(200).send(`Voted for ${result.data}`);
        }
    });
});

module.exports = router;