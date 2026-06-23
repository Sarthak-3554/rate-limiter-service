const express = require("express");

const {
    checkRateLimit
} = require("../controllers/rateLimitController");

const {adminCreateClient, adminGetClient} = require("../controllers/adminController");

const router = express.Router();

router.post("/check", checkRateLimit);
router.post("/admin/clients", adminCreateClient);
router.get("/admin/clients/:clientKey", adminGetClient);

module.exports = router;