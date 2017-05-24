"use strict";

const request = require("request");
const targetURL = "localhost:9090/";
const calls = process.argv[3];

request(targetURL, (err, res, body) => {
    if(err){
        console.error("ERROR: Something went wrong. %s", err);
    }else{
        console.log();
    }
});