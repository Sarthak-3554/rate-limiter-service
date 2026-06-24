const clients = require("./ClientService.js");

const RateLimiterFactory =
    require("./factories/RateLimiterFactory");

class RateLimiterService {

    async check(clientKey){

        const client =
            await clients.getClient(clientKey);  // get client info from in-memory store

        if(!client){

            throw new Error(
                "Client not found" // if client not found not service should be provided
            );
        }

        const limiter =
            RateLimiterFactory.getLimiter(
                client.algorithm
            );

        const result = await limiter.allowRequest(clientKey,client);

        return {
        ...result,
        ...client
        };
    }
}

module.exports =
    new RateLimiterService();