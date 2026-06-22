const TokenBucketLimiter =
    require("../limiters/TokenBucketLimiter");

class RateLimiterFactory {

    static getLimiter(type){

        switch(type){

            case "token_bucket":
                return new TokenBucketLimiter();

            default:
                throw new Error(
                    "Unknown limiter type"
                );
        }
    }
}

module.exports =
    RateLimiterFactory;