const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
    eventType: {type: String},
    processId: {type: String},
    time: {type: String}
});

module.exports = mongoose.model("Event", eventSchema);