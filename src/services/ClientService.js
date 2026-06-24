const clients = require("../data/clients");

class ClientService {

    createClient(config){

        if(clients.has(config.clientKey)){
            throw new Error(
                "Client already exists"
            );
        }

        if(!config.clientKey){
            throw new Error(
                "Client key is required"
            );
        }

        if(config.capacity <= 0){
    throw new Error(
        "Capacity must be greater than 0"
    );
}

        if(config.refillRate < 0){
            throw new Error(
                "Refill rate cannot be negative"
            );
        }

        if(config.algorithm !== "token_bucket"){
            throw new Error(
                "Unsupported algorithm"
            );
        }

        clients.set(
            config.clientKey,
            {
                algorithm: config.algorithm,
                capacity: config.capacity,
                refillRate: config.refillRate
            }
        );

        return {
            message:
            "Client created successfully"
        };
    }

    getClient(clientKey){

        const client =
            clients.get(clientKey);

        if(!client){
            throw new Error(
                "Client not found"
            );
        }

        return {
            clientKey,
            ...client
        };
    }
}

module.exports =
    new ClientService();