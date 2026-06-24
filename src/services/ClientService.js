
const redisClient = require("../config/redis");

class ClientService {

    async createClient(config){

        const existingClient = await redisClient.hGetAll(`client:${config.clientKey}`);

        if(existingClient && Object.keys(existingClient).length > 0){
            throw new Error("Client already exists");
        }

        if(!config.clientKey){
            throw new Error("Client key is required");
        }

        if(config.capacity <= 0){
            throw new Error("Capacity must be greater than 0");
}

        if(config.refillRate < 0){
            throw new Error("Refill rate cannot be negative");
        }

        if(config.algorithm !== "token_bucket"){
            throw new Error("Unsupported algorithm");
        }

        await redisClient.hSet(`client:${config.clientKey}`,{
            algorithm: config.algorithm,
            capacity: config.capacity,
            refillRate: config.refillRate
        });
        

        return {
            message:
            "Client created successfully"
        };
    }

    async getClient(clientKey){

        const client = await redisClient.hGetAll(`client:${clientKey}`);

        if(!client || Object.keys(client).length === 0){
            throw new Error(
                "Client not found"
            );
        }

        return {
            clientKey,
            algorithm: client.algorithm,
            capacity: parseInt(client.capacity),
            refillRate: parseFloat(client.refillRate)
        };
    }
}

module.exports =
    new ClientService();