const express = require("express");

const rateLimitRoutes =
    require("./routes/rateLimitRoutes");

const redisClient = require("./config/redis");

const app = express();

const PORT = process.env.PORT || 3000;

async function startServer(){

    try{

        await redisClient.connect();

        console.log(
            "Connected to Redis"
        );

        app.listen(PORT, async () => {

            console.log(
                `Server running on ${PORT}`
            );

            app.use(express.json());

            app.use("/api",rateLimitRoutes);
        });

    }
    catch(err){

        console.error(
            "Failed to connect Redis:",
            err.message
        );

        process.exit(1);
    }
}

startServer();