const redisClient = require("../../config/redis.js")

class TokenBucketLimiter {

    async allowRequest(clientKey, config) {

    const currentTime =
        Math.floor(Date.now() / 1000);

    let bucket =
        await this.getBucket(clientKey);

    // first request from this client, initialize bucket
    if (!bucket) {

        bucket = {
            tokens: config.capacity,
            lastRefill: currentTime
        };
    }

    // Refill the bucket based on elapsed time    
    this.refillBucket(
        bucket,
        currentTime,
        config
    );

    let allowed = false;

    if (bucket.tokens >= 1) {

        bucket.tokens--;

        allowed = true;
    }

    // Persist final state to Redis
    await this.saveBucket(
        clientKey,
        bucket
    );

    return {
        allowed,
        remaining: bucket.tokens
    };
}

    refillBucket(bucket,currentTime,config){ 
        const elapsed = currentTime - bucket.lastRefill;

        const tokensToAdd = elapsed * config.refillRate;

        bucket.tokens = Math.min( config.capacity, bucket.tokens + tokensToAdd );
        
        bucket.lastRefill = currentTime; 
    }

    async getBucket(clientKey){

        const bucket =
            await redisClient.hGetAll(
                `bucket:${clientKey}`
            );

        if(
            Object.keys(bucket).length === 0
        ){
            return null;
        }

        return {
            tokens:
                Number(bucket.tokens),

            lastRefill:
                Number(bucket.lastRefill)
        };
    }


    async saveBucket(clientKey,bucket){
        
        await redisClient.hSet(`bucket:${clientKey}`,{
            tokens:bucket.tokens,
            lastRefill:bucket.lastRefill
        });


    }




}

module.exports = TokenBucketLimiter;