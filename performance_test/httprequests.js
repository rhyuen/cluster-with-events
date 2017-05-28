"use strict";

const request = require("request");
const targetURL = "http://localhost:9090/castvote";
const calls = process.argv[2];

if(parseInt(calls) <= 0){
    console.log("Number of calls to make must exceed 1.");
    return;
}
    
for(let i = 0; i < parseInt(calls); i++){    
    request(targetURL, (err, res, body) => {
        if(err){
            console.error("[PERF TEST ERROR]: Something went wrong. %s", err);
        }else{
            console.log(body);
            console.log("PERF TEST.");
        }
    });
}
