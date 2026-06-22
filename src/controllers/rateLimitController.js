const rateLimiterService =
    require("../services/RateLimiterService");

function checkRateLimit(req,res){

    try{

        const { clientKey } =
            req.body;

        const result =
            rateLimiterService.check(
                clientKey
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