
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

        if(config.algorithm !== "token_bucket" && config.algorithm !== "sliding_window"){
            throw new Error(
                "Unsupported algorithm"
            );
        }

        if(config.algorithm === "sliding_window"){
            if(!config.limit || config.limit <= 0){
                throw new Error(
                    "Limit must be greater than 0"
                );
            }

            if(!config.windowSize || config.windowSize <= 0){
                throw new Error(
                    "Window size must be greater than 0"
                );
            }
        }

        const clientData = {algorithm: config.algorithm };

        if(config.algorithm === "token_bucket"){
            clientData.capacity = config.capacity;

            clientData.refillRate = config.refillRate;
        }
        else{

            clientData.limit = config.limit;

            clientData.windowSize = config.windowSize;
        }

        await redisClient.hSet(`client:${config.clientKey}`,clientData);
        

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

        if(client.algorithm ==="token_bucket"){
            return {
                clientKey,
                algorithm:client.algorithm,
                capacity:Number(client.capacity),
                refillRate:Number(client.refillRate)
            };
        }

        return {
            clientKey,
            algorithm:client.algorithm,
            limit:Number(client.limit),
            windowSize:Number(client.windowSize)
        };
    }
}

module.exports =
    new ClientService();