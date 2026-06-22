const { log } = require("node:console");
const buckets = require("../data/buckets");

const CAPACITY = 5;
const REFILL_RATE = 1; // token per second

function allowRequest(clientKey) {
    console.log(buckets);
    const currentTime = Math.floor(Date.now() / 1000);

    let bucket = buckets.get(clientKey);
    console.log("\nbucket", bucket);
    if (!bucket) {

        bucket = {
            tokens: CAPACITY,
            lastRefill: currentTime
        };

        buckets.set(clientKey, bucket);
    }

    refillBucket(bucket, currentTime);

    if (bucket.tokens >= 1) {

        bucket.tokens--;

        return {
            allowed: true,
            remaining: bucket.tokens
        };
    }

    return {
        allowed: false,
        remaining: 0
    };
}

function refillBucket(bucket, currentTime) {

    const elapsedTime =
        currentTime - bucket.lastRefill;

    const tokensToAdd =
        elapsedTime * REFILL_RATE;

    bucket.tokens = Math.min(
        CAPACITY,
        bucket.tokens + tokensToAdd
    );

    bucket.lastRefill = currentTime;
}

module.exports = {
    allowRequest
};