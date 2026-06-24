const redisClient =
    require("../../config/redis");

const slidingWindowScript = `

local limit = tonumber(ARGV[1])
local windowSize = tonumber(ARGV[2])
local currentTime = tonumber(ARGV[3])
local requestId = ARGV[4]

local windowStart =
    currentTime - (windowSize * 1000)

redis.call(
    'ZREMRANGEBYSCORE',
    KEYS[1],
    '-inf',
    windowStart
)

local requestCount =
    redis.call(
        'ZCARD',
        KEYS[1]
    )

if requestCount >= limit then

    return {
        0,
        0
    }
end

redis.call(
    'ZADD',
    KEYS[1],
    currentTime,
    requestId
)

return {
    1,
    limit - requestCount - 1
}
`;

class SlidingWindowLimiter {

    async allowRequest(
        clientKey,
        config
    ){

        const currentTime =
            Date.now();

        const requestId =
            `${currentTime}-${Math.random()}`;

        const result =
            await redisClient.eval(
                slidingWindowScript,
                {
                    keys: [
                        `window:${clientKey}`
                    ],
                    arguments: [
                        config.limit.toString(),
                        config.windowSize.toString(),
                        currentTime.toString(),
                        requestId
                    ]
                }
            );

        return {
            allowed:
                result[0] === 1,

            remaining:
                Number(result[1])
        };
    }
}

module.exports =
    SlidingWindowLimiter;