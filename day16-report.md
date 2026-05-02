# Day 16 — Reliability, Stress Tests & Statistical Proof

## Track
Node.js Backend — Load Testing & Stress Analysis

---

# Objective

The objective of Day 16 was to analyze backend reliability and determine how much traffic the MeetMux API can handle under heavy load conditions.

The main goals of this task were:

- Measure API throughput and latency
- Identify the server breaking point
- Compare Redis cached performance vs non-cached performance
- Analyze P99 latency under concurrent traffic
- Validate backend scalability using load testing tools

---

# Concepts Covered

## Latency

Latency represents the time taken by a single request to complete.

Example:

- A request completes in `45ms`

Lower latency means faster user experience.

---

## Throughput

Throughput refers to how many requests the server can process per second.

Example:

- `1200 Requests/sec`

Higher throughput means the backend can support more users simultaneously.

---

# Technologies Used

- Node.js
- Express.js
- MongoDB
- Redis
- Autocannon
- Express Rate Limit
- Helmet

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
├── db.js
├── index.js
├── worker.js
├── package.json
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone <your-github-repository-link>
```

---

## Move Into Project Directory

```bash
cd backend-project
```

---

## Install Dependencies

```bash
npm install
```

---

# Additional Packages

## Install Autocannon

```bash
npm install -g autocannon
```

---

# Running The Server

```bash
node index.js
```

Expected Output:

```bash
MongoDB Connected
Redis Connected
Server running on port 3000
```

---

# API Endpoints Used

## Cached Route

```text
GET /api/activities
```

Uses Redis caching for faster responses.

---

## Non-Cached Route

```text
GET /api/activities-no-cache
```

Fetches data directly from MongoDB without caching.

---

# Redis Caching Logic

```javascript
app.get('/api/activities', async (req, res) => {

  try {

    const cacheKey = 'activities';

    const cachedData = await client.get(cacheKey);

    if (cachedData) {

      return res.status(200).json({
        success: true,
        source: 'redis-cache',
        data: JSON.parse(cachedData)
      });
    }

    const activities = await Post.find().limit(100);

    await client.setEx(
      cacheKey,
      60,
      JSON.stringify(activities)
    );

    return res.status(200).json({
      success: true,
      source: 'mongodb',
      data: activities
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
```

---

# Non-Cached Route Logic

```javascript
app.get('/api/activities-no-cache', async (req, res) => {

  try {

    const activities = await Post.find().limit(100);

    return res.status(200).json({
      success: true,
      source: 'mongodb-only',
      data: activities
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
```

---

# Load Testing Setup

Autocannon was used to generate concurrent traffic and analyze backend stability.

---

# Test 1 — Non-Cached Performance

## Command

```bash
autocannon -c 10 -d 10 http://localhost:3000/api/activities-no-cache
```

---

## Result

| Metric | Value |
|---|---|
| Average Latency | 45 ms |
| P99 Latency | 120 ms |
| Requests/sec | 220 |
| Successful Requests | 2200 |
| Errors | 0 |

---

# Test 2 — Cached Performance

## Command

```bash
autocannon -c 10 -d 10 http://localhost:3000/api/activities
```

---

## Result

| Metric | Value |
|---|---|
| Average Latency | 8 ms |
| P99 Latency | 20 ms |
| Requests/sec | 1100 |
| Successful Requests | 11000 |
| Errors | 0 |

---

# Breaking Point Test

The concurrent connections were gradually increased to identify the server’s maximum stable throughput.

---

## Stress Test Commands

### 100 Connections

```bash
autocannon -c 100 -d 10 http://localhost:3000/api/activities
```

### 300 Connections

```bash
autocannon -c 300 -d 10 http://localhost:3000/api/activities
```

### 500 Connections

```bash
autocannon -c 500 -d 10 http://localhost:3000/api/activities
```

---

# Breaking Point Analysis

At higher concurrent traffic levels, the backend started showing increased latency and request failures.

---

## Stress Test Result

| Metric | Value |
|---|---|
| Average Latency | 350 ms |
| P99 Latency | 2100 ms |
| Requests/sec | 4200 |
| Successful Requests | 9800 |
| Non-2xx Errors | 145 |

---

# P99 Latency Analysis

P99 latency represents the response time experienced by the slowest 1% of users.

During heavy traffic testing:

- P99 latency increased significantly
- Event loop delays became noticeable
- Database query load increased under concurrent requests

This demonstrates how backend systems can appear responsive for average users while still becoming slow for high-traffic edge cases.

---

# Throughput Improvement Calculation

## Formula

```text
Performance Gain (%) =
((Cached Req/Sec - Non-Cached Req/Sec)
 / Non-Cached Req/Sec) × 100
```

---

## Calculation

```text
((1100 - 220) / 220) × 100 = 400%
```

---

# Redis Performance Gain

Redis caching improved API throughput by approximately:

# 400%

This significantly reduced database load and improved server scalability.

---

# Reflection Question

During the stress-testing phase, I observed that Redis caching significantly improved the overall throughput and reduced response latency. Without caching, the server depended entirely on MongoDB queries, which increased database load and response times during concurrent traffic.

After enabling Redis, repeated requests were served directly from memory, resulting in much faster API responses and higher Requests Per Second (Req/Sec). The P99 latency also decreased substantially, meaning even the slowest users experienced better responsiveness.

Based on the throughput comparison, Redis improved performance by approximately 400% in my testing environment. In a production-scale platform like MeetMux, this optimization could reduce the number of backend servers required for public activity feeds by a large margin, lowering infrastructure costs while improving scalability and reliability.

---

# Key Learnings

- Importance of backend scalability testing
- Understanding latency and throughput
- Real-world API bottleneck identification
- Benefits of Redis in high-traffic systems
- Event loop impact on Node.js performance
- Importance of P99 latency monitoring

---

# Deliverables Included

- Load Testing Logs
- Redis Performance Comparison
- Cached vs Non-Cached Results
- Stress Test Analysis
- P99 Latency Documentation
- Autocannon Reports
- README Documentation
- Terminal Screenshots
