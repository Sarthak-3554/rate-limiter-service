const {
    allowRequest
} = require("../services/tokenBucketService");

function checkRateLimit(req, res) {

    const { clientKey } = req.body;

    if (!clientKey) {

        return res.status(400).json({
            error: "clientKey required"
        });
    }

    const result =
        allowRequest(clientKey);

    return res.status(200).json(result);
}

module.exports = {
    checkRateLimit
};