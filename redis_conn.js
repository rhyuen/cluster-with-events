"use strict";

const redis = require("redis");
const redis_client = redis.createClient(process.env.REDIS_PORT || 6369);

client.set("First Key", "First Value");