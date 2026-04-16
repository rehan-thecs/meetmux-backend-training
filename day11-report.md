# 📘 Day 11 Report — Background Tasks & Queues

## 🎯 Objective

The objective of Day 11 was to understand how to handle CPU-intensive tasks without blocking the main server. This was achieved using Worker Threads and understanding task queue architecture.

---

## ⚠️ Event Loop Bottleneck

Node.js operates on a single-threaded event loop. Running heavy computations directly in the main thread blocks all incoming requests.

### 📌 Blocking Example

```js
let result = 0;
for (let i = 0; i < 1_000_000_000; i++) {
  result += i;
}
```

### ❌ Result

* Server becomes unresponsive
* Other requests cannot be processed

---

## ⚡ Worker Threads Implementation

To solve this, we used Worker Threads to offload heavy computation.

### 📁 worker.js

```js
const { parentPort, workerData } = require('worker_threads');

let result = 0;
for (let i = 0; i < workerData.iterations; i++) {
  result += i;
}

parentPort.postMessage(result);
```

---

## 🔧 API Integration

### 📌 Code Snippet

```js
const worker = new Worker('./worker.js', {
  workerData: { iterations: 1000000000 }
});
```

### ✅ Result

* Heavy task runs in separate thread
* Main server remains responsive

---

## 🧪 Experiment

### 🔹 Blocking Route

* Server froze when running heavy loop

### 🔹 Worker Thread Route

* Server handled other requests smoothly

### ✅ Observation

* Worker Threads prevent blocking of event loop

---

## ⏱️ Performance Logging

We measured execution time using timestamps.

### 📌 Code

```js
const start = Date.now();
const end = Date.now();
```

### ✅ Result

* Tracked execution duration of heavy tasks

---

## 🏭 Task Queues (Concept)

In production, applications use task queues like BullMQ with Redis.

### 🔄 Flow

Producer → Queue → Worker → Task Execution

### ✅ Benefits

* Retry failed tasks
* Background processing
* Scalability

---

## ❓ Reflection

Using background workers is vital for apps like MeetMux because sending notifications to thousands of users is a heavy operation. If done in the main thread, it would block the server and degrade performance. Workers ensure smooth user experience and scalability.

---

## ⚖️ Main Thread vs Worker Thread

| Feature     | Main Thread      | Worker Thread     |
| ----------- | ---------------- | ----------------- |
| Execution   | Single-threaded  | Multi-threaded    |
| Task Type   | Light operations | Heavy computation |
| Performance | Can block        | Non-blocking      |

---

## 📊 Final Checklist

* [x] Blocking scenario tested
* [x] Worker thread implemented
* [x] Server responsiveness verified
* [x] Execution time logged
* [x] Queue concept understood

---

## 🏁 Conclusion

Day 11 introduced background processing techniques to improve backend performance. By using Worker Threads, we ensured that heavy tasks do not block the main server, making the system more scalable and efficient.

This is a critical concept for building production-ready applications.
