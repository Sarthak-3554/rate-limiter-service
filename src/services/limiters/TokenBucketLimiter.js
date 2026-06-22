const buckets = require("../../data/buckets");

class TokenBucketLimiter {

    allowRequest(clientKey, config) {

        const currentTime =
            Math.floor(Date.now() / 1000);

        let bucket =
            buckets.get(clientKey);

        if (!bucket) {

            bucket = {
                tokens: config.capacity,
                lastRefill: currentTime
            };

            buckets.set(clientKey, bucket);
        }

        this.refillBucket(
            bucket,
            currentTime,
            config
        );

        if(bucket.tokens >= 1){

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

    refillBucket(bucket,currentTime,config){

        const elapsed =
            currentTime - bucket.lastRefill;

        const tokensToAdd =
            elapsed * config.refillRate;

        bucket.tokens = Math.min(
            config.capacity,
            bucket.tokens + tokensToAdd
        );

        bucket.lastRefill =
            currentTime;
    }
}

module.exports = TokenBucketLimiter;