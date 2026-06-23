const express = require("express");

const rateLimitRoutes =
    require("./routes/rateLimitRoutes");





const app = express();

app.use(express.json());

app.use("/api", rateLimitRoutes);

const PORT = 3000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});