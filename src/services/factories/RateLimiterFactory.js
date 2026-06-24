const TokenBucketLimiter =
    require("../limiters/TokenBucketLimiter");

const SlidingWindowLimiter =
    require("../limiters/SlidingWindowLimiter");

class RateLimiterFactory {

    static getLimiter(
        algorithm
    ){

        switch(algorithm){

            case "token_bucket":
                return new TokenBucketLimiter();

            case "sliding_window":
                return new SlidingWindowLimiter();

            default:
                throw new Error(
                    "Unsupported algorithm"
                );
        }
    }
}

module.exports =
    RateLimiterFactory;