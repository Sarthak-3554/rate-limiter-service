const express = require("express");

const {
    checkRateLimit
} = require("../controllers/rateLimitController");

const router = express.Router();

router.post("/check", checkRateLimit);

module.exports = router;