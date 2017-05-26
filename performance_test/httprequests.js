"use strict";

const request = require("request");
const targetURL = "http://localhost:9090/";
const calls = process.argv[2];



if(parseInt(calls) <= 0){
    console.log("Number of calls to make must exceed 1.");
    return;
}
    


for(let i = 0; i < parseInt(calls); i++){
    console.log(parseInt(calls));
    console.log(typeof parseInt(calls));
    request(targetURL, (err, res, body) => {
        if(err){
            console.error("ERROR: Something went wrong. %s", err);
        }else{
            console.log(body);
        }
    });
}
