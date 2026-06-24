const redisClient = require("../../config/redis.js")


const tokenBucketScript = `
local capacity = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])
local currentTime = tonumber(ARGV[3])

local tokens =
    tonumber(
        redis.call(
            'HGET',
            KEYS[1],
            'tokens'
        )
    )

local lastRefill =
    tonumber(
        redis.call(
            'HGET',
            KEYS[1],
            'lastRefill'
        )
    )

if not tokens then

    tokens = capacity
    lastRefill = currentTime
end

local elapsed =
    currentTime - lastRefill

local tokensToAdd =
    elapsed * refillRate

tokens =
    math.min(
        capacity,
        tokens + tokensToAdd
    )

local allowed = 0

if tokens >= 1 then

    tokens = tokens - 1

    allowed = 1
end

redis.call(
    'HSET',
    KEYS[1],
    'tokens',
    tokens,
    'lastRefill',
    currentTime
)

return {
    allowed,
    tokens
}
`;
class TokenBucketLimiter {


    async allowRequest(clientKey, config) {

        const currentTime = Math.floor(Date.now() / 1000);

        const result = await redisClient.eval(tokenBucketScript,
                {
                    keys: [`bucket:${clientKey}`],
                    arguments:[config.capacity.toString(), config.refillRate.toString(), currentTime.toString()]
                }
            );

        return {
            allowed:result[0] === 1,

            remaining:result[1]
        };
    }



}

module.exports = TokenBucketLimiter;