const rateLimiterService =
    require("../services/RateLimiterService");

async function checkRateLimit(req,res){

    try{

        const { clientKey } =
            req.body;

        const result =
            await rateLimiterService.check(
                clientKey
            );

        res.set(
            "X-RateLimit-Limit",
            result.capacity.toString()
        );

        res.set(
            "X-RateLimit-Remaining",
            result.remaining.toString()
        );

        let resetTime = "never";

        if(result.refillRate > 0){

            resetTime =
                Math.ceil(
                    Date.now()/1000 +
                    (1/result.refillRate)
                ).toString();
        }

        res.set(
            "X-RateLimit-Reset",
            resetTime
        );

        if(result.allowed){

            return res.status(200)
                .json(result);
        }

        return res.status(429)
            .json(result);

    }
    catch(err){

        return res.status(400)
            .json({
                error: err.message
            });
    }
}

module.exports = {
    checkRateLimit
};