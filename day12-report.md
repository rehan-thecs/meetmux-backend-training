# 📘 Day 12 Report — Memory Caching with Redis

## 🎯 Objective

The objective of Day 12 was to optimize API performance by implementing a caching layer using Redis. This reduces database load and improves response time.

---

## ⚡ Cache-Aside Strategy

We implemented the Cache-Aside pattern where:

1. The server first checks Redis
2. If data exists → return from Redis (Cache Hit)
3. If not → fetch from MongoDB and store in Redis (Cache Miss)

---

## 🔌 Redis Integration

We connected the Node.js application with Redis using the official redis library.

### 📌 Code Snippet

```js
const client = redis.createClient();
await client.connect();
```

---

## 📥 GET API with Caching

### 📌 Endpoint

GET /api/posts/:id

### 📌 Logic

```js
const cachedPost = await client.get(id);

if (cachedPost) {
  return res.json(JSON.parse(cachedPost));
}

const post = await Post.findById(id);
await client.setEx(id, 3600, JSON.stringify(post));
```

---

## 📊 Performance Comparison

| Type       | Source  | Response Time |
| ---------- | ------- | ------------- |
| Cache Miss | MongoDB | ~120 ms       |
| Cache Hit  | Redis   | ~10 ms        |

### ✅ Result

* Significant reduction in response time
* Improved API efficiency

---

## 🔄 Cache Invalidation

When a post is updated, the cache must be cleared.

### 📌 Code Snippet

```js
await client.del(req.params.id);
```

### ✅ Result

* Prevents stale data
* Ensures data consistency

---

## ❓ Reflection

Setting a TTL (Time-To-Live) is important because it ensures cached data does not remain outdated forever. Without expiration, users might receive stale or incorrect data. TTL helps maintain a balance between performance and data accuracy.

---

## 📊 Final Checklist

* [x] Redis connected successfully
* [x] Cache-Aside strategy implemented
* [x] Cache Hit vs Miss verified
* [x] Cache invalidation implemented
* [x] Performance improvement observed

---

## 🏁 Conclusion

Day 12 introduced caching using Redis, significantly improving API performance. By reducing database calls and serving frequently accessed data from memory, the backend becomes faster and more scalable.

This is a key step toward building high-performance production systems.
