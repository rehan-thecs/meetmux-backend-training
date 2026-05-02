# Day 19 — Redis Caching & Performance Optimization

## Track
Node.js Backend — Redis Caching & Cache-Aside Pattern

---

# Objective

The objective of Day 19 was to improve backend performance and reduce database load by integrating Redis caching into the MeetMux backend system.

The implementation focused on:

- Cache-Aside Pattern
- Redis in-memory caching
- TTL (Time To Live)
- Cache invalidation
- Faster response times
- Reduced database latency

---

# Concepts Covered

## Why Caching Is Important

Every database request requires disk I/O operations, which are significantly slower than memory access.

If thousands of users repeatedly request the same data, the database becomes overloaded and response times increase.

Redis solves this problem by storing frequently accessed data directly in memory.

---

# Cache-Aside Pattern

The implemented workflow follows:

```text
Check Cache
   ↓
Cache Hit → Return Cached Data

OR

Cache Miss
   ↓
Fetch From Database
   ↓
Store In Redis
   ↓
Return Data
```

---

# Technologies Used

- Node.js
- Redis
- JavaScript
- Express.js
- MongoDB

---

# Project Structure

```text
backend-project
│
├── controllers
│   └── userController.js
│
├── middlewares
│   ├── auth.js
│   └── security.js
│
├── models
│   ├── Post.js
│   └── User.js
│
├── services
│   └── cache_service.js
│
├── db.js
├── index.js
├── worker.js
├── package.json
└── README.md
```

---

# Installation

## Install Dependencies

```bash
npm install
```

---

## Install Redis Package

```bash
npm install redis
```

---

# Redis Connection

```javascript
const redis = require('redis');

const client = redis.createClient({
  url: 'redis://127.0.0.1:6379'
});
```

---

# Redis Connection Events

```javascript
client.on('connect', () => {

  console.log('Redis Connected Successfully');
});

client.on('error', (error) => {

  console.log(
    'Redis Client Error:',
    error.message
  );
});
```

---

# Cache-Aside Implementation

```javascript
const cachedData = await client.get(cacheKey);

if (cachedData) {

  console.log(
    'Cache Hit! Returning data from Redis...'
  );

  return JSON.parse(cachedData);
}

console.log(
  'Cache Miss. Fetching from Database...'
);
```

---

# TTL (Time To Live)

```javascript
await client.setEx(
  cacheKey,
  60,
  JSON.stringify(dbData)
);
```

The cache automatically expires after 60 seconds to prevent stale data.

---

# Manual Cache Invalidation

```javascript
await client.del('popular_activities');
```

This ensures fresh data is fetched after updates occur.

---

# Running The Script

```bash
node services/cache_service.js
```

---

# Expected Output

```bash
Redis Connected Successfully

FIRST REQUEST

Cache Miss. Fetching from Database...
Data Cached Successfully

SECOND REQUEST

Cache Hit! Returning data from Redis...

UPDATING DATA

Updated activity 1 to Advanced Mountain Hiking
Cache invalidated for popular_activities

THIRD REQUEST AFTER INVALIDATION

Cache Miss. Fetching from Database...
```

---

# Cache Hit vs Cache Miss

## Cache Miss

- Redis does not contain data
- Database query executes
- Data stored in Redis

---

## Cache Hit

- Data retrieved directly from Redis
- No database query needed
- Faster response time

---

# Reflection Question

If MeetMux has a live “Trending Now” list that changes every minute, I would choose a Redis TTL of 10 seconds instead of 1 hour. The reason is that trending content changes very frequently, and users expect real-time accuracy.

Using a long TTL such as one hour would improve speed but could display outdated trending activities for a very long time, reducing the reliability of the platform. A shorter TTL provides a better balance between performance and freshness because Redis still reduces database load while ensuring users receive updated information quickly.

For highly dynamic data, maintaining accurate and fresh content is more important than maximizing cache duration.

---

# Key Learnings

- Redis in-memory caching
- Cache-Aside Pattern
- TTL expiration strategy
- Cache invalidation
- Backend performance optimization
- Reducing database load
- Improving response latency

---

# Deliverables Included

- Redis Integration
- Cache-Aside Logic
- TTL Configuration
- Cache Invalidation
- Terminal Logs
- Documentation
- GitHub Repository

---
