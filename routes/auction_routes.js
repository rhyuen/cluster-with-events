const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("auctions roote page");
});

module.exports = router;