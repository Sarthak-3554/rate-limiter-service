const rateLimiterService =
    require("../services/RateLimiterService");

async function checkRateLimit(req,res){

    try{

        const { clientKey } = req.body;

        const result = await rateLimiterService.check(clientKey);

        // Common limit header
        const limit = result.algorithm === "token_bucket"? result.capa: result.limit;

        res.set( "X-RateLimit-Limit",limit.toString());

        res.set("X-RateLimit-Remaining",result.remaining.toString()
        );

        // Token Bucket reset calculation
        if(result.algorithm ==="token_bucket"){

            let resetTime = "never";

            if(result.refillRate > 0){
                resetTime = Math.ceil(Date.now()/1000 +(1/result.refillRate)).toString();
            }

            res.set("X-RateLimit-Reset",resetTime);
        }

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