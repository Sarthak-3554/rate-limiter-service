const clients = new Map();

clients.set("user123", {
    algorithm: "token_bucket",
    capacity: 5,
    refillRate: 1
});

module.exports = clients;