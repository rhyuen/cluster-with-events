"use strict";

const nconf = require("nconf");

nconf.file("keys.json");

module.exports = {
    prod:{
        db: nconf.get("prod:db") || process.env.db
    },
    dev: {
        db: nconf.get("dev:db") || process.env.db
    }    
};

