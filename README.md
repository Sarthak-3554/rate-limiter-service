# Standalone Rate Limiter Service

A production-inspired rate limiting service built using Node.js, Express, Redis, and Lua scripts.

The service supports multiple rate limiting algorithms, per-client configuration, atomic Redis operations, and high-concurrency workloads.

---

## Features

* Token Bucket Rate Limiter
* Sliding Window Rate Limiter
* Per-client configuration
* Redis-backed persistence
* Atomic Redis Lua scripts
* Factory Pattern based algorithm selection
* Rate limit headers
* Load tested using Autocannon
* SOLID-inspired service architecture

---

## Tech Stack

* Node.js
* Express.js
* Redis
* Lua Scripts
* Docker
* Autocannon

---

## Architecture

```text
                Client
                   │
                   ▼
            Express Routes
                   │
                   ▼
              Controllers
                   │
                   ▼
         RateLimiterService
                   │
                   ▼
         RateLimiterFactory
                   │
      ┌────────────┴────────────┐
      ▼                         ▼
TokenBucketLimiter    SlidingWindowLimiter
      │                         │
      └────────────┬────────────┘
                   ▼
                Redis
                   │
                   ▼
             Lua Scripts
```

---

## Supported Algorithms

### 1. Token Bucket

Allows bursts while enforcing an average request rate.

Configuration:

```json
{
  "clientKey": "user123",
  "algorithm": "token_bucket",
  "capacity": 100,
  "refillRate": 2
}
```

### 2. Sliding Window

Limits requests within a rolling time window.

Configuration:

```json
{
  "clientKey": "user123",
  "algorithm": "sliding_window",
  "limit": 100,
  "windowSize": 60
}
```

---

## API Endpoints

### Create Client

POST /api/admin/clients

Request:

```json
{
  "clientKey": "user123",
  "algorithm": "token_bucket",
  "capacity": 100,
  "refillRate": 2
}
```

Response:

```json
{
  "message": "Client created successfully"
}
```

---

### Get Client Configuration

GET /api/admin/clients/:clientKey

Response:

```json
{
  "clientKey": "user123",
  "algorithm": "token_bucket",
  "capacity": 100,
  "refillRate": 2
}
```

---

### Check Rate Limit

POST /api/check

Request:

```json
{
  "clientKey": "user123"
}
```

Successful Response:

```json
{
  "allowed": true,
  "remaining": 99
}
```

Rejected Response:

```json
{
  "allowed": false,
  "remaining": 0
}
```

---

## Rate Limit Headers

```http
X-RateLimit-Limit
X-RateLimit-Remaining
X-RateLimit-Reset
```

---

## Redis Data Model

### Client Configuration

Key:

```text
client:user123
```

Value:

```text
algorithm -> token_bucket
capacity -> 100
refillRate -> 2
```

---

### Token Bucket State

Key:

```text
bucket:user123
```

Value:

```text
tokens -> 45
lastRefill -> 1782243762
```

---

### Sliding Window State

Key:

```text
window:user123
```

Stored as Redis Sorted Set:

```text
Score      Member
1782243000 req-1
1782243001 req-2
1782243002 req-3
```

---

## Concurrency Safety

Both algorithms use Redis Lua scripts to guarantee atomic execution.

### Token Bucket

Atomic operations:

* Refill tokens
* Validate request
* Consume token
* Persist bucket state

### Sliding Window

Atomic operations:

* Remove expired requests
* Count active requests
* Validate limit
* Add current request

This prevents race conditions under high concurrency.

---

## Load Testing

Tool:

```bash
npx autocannon
```

### Token Bucket

Configuration:

```text
capacity = 100
refillRate = 0
```

Result:

```text
100 successful requests
All remaining requests rejected
```

### Sliding Window

Configuration:

```text
limit = 100
windowSize = 60 seconds
```

Result:

```text
100 successful requests
All remaining requests rejected
```

---

## Running Locally

### Start Redis

```bash
docker run -d --name redis-rate-limiter -p 6379:6379 redis
```

### Install Dependencies

```bash
npm install
```

### Start Server

```bash
npm run dev
```

---

## Future Improvements

* Fixed Window Rate Limiter
* Leaky Bucket Algorithm
* JWT Authentication
* Swagger/OpenAPI Documentation
* Prometheus Metrics
* Grafana Dashboards
* Redis Cluster Support
* Unit and Integration Tests

---

## Key Learnings

This project explores:

* Backend System Design
* Rate Limiting Algorithms
* Redis Data Structures
* Lua Scripting
* Concurrency Control
* SOLID Principles
* Factory Pattern
* Load Testing and Performance Engineering

```
```
