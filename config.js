"use strict";

const nconf = require("nconf");

nconf.file("keys.json");

module.exports = {
    db: nconf.get("db") || process.env.db
};

