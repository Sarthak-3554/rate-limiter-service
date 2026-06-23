const clients =
    require("../data/clients");

const RateLimiterFactory =
    require("./factories/RateLimiterFactory");

class RateLimiterService {

    async check(clientKey){

        const client =
            clients.get(clientKey);  // get client info from in-memory store

        if(!client){

            throw new Error(
                "Client not found" // if client not found not service should be provided
            );
        }

        const limiter =
            RateLimiterFactory.getLimiter(
                client.algorithm
            );

        return await limiter.allowRequest(
            clientKey,
            client
        );
    }
}

module.exports =
    new RateLimiterService();