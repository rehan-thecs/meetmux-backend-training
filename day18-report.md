# Day 18 — WebSockets & Real-Time Events

## Track
Node.js Backend — Socket.io Real-Time Communication

---

# Objective

The objective of Day 18 was to implement real-time communication in the MeetMux backend using WebSockets and Socket.io.

This implementation enables:

- Persistent client-server communication
- Instant live notifications
- Real-time activity updates
- Event-based room communication
- Multi-user broadcasting

without requiring browser refreshes or repeated HTTP polling.

---

# Concepts Covered

## HTTP Request-Response Model

Traditional REST APIs require the client to repeatedly request new data from the server.

This creates delays and unnecessary network traffic for live applications.

---

## WebSockets

WebSockets create a persistent two-way communication channel between the client and server.

This allows the server to instantly push updates to connected users.

---

## Socket.io

Socket.io simplifies WebSocket implementation in Node.js and provides:

- Automatic reconnection
- Event-based messaging
- Rooms and namespaces
- Broadcasting support

---

# Technologies Used

- Node.js
- Express.js
- Socket.io
- HTTP Server
- JavaScript
- WebSockets

---

# Project Structure

```text
backend-project
│
├── controllers
├── middlewares
├── models
├── db.js
├── index.js
├── worker.js
├── client.html
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

## Install Socket.io

```bash
npm install socket.io
```

---

# Server Setup

## index.js

```javascript
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*'
  }
});
```

---

# Socket Connection Logic

```javascript
io.on('connection', (socket) => {

  console.log(`User Connected: ${socket.id}`);

  socket.on('join_activity', (data) => {

    console.log(
      `User joined activity: ${data.activityName}`
    );

    socket.broadcast.emit(
      'new_participant',
      {
        message:
          `A new user joined ${data.activityName}`
      }
    );
  });

  socket.on('subscribe_to_event', (eventId) => {

    socket.join(eventId);

    console.log(
      `Socket ${socket.id} joined room: ${eventId}`
    );

    io.to(eventId).emit(
      'notification',
      `Live update for Event ${eventId}: Organizer has arrived`
    );
  });

  socket.on('disconnect', () => {

    console.log(
      `User Disconnected: ${socket.id}`
    );
  });
});
```

---

# Running The Server

```bash
node index.js
```

Expected Output:

```bash
Server running on http://localhost:3000
```

---

# Client Testing

A simple HTML client was created to simulate multiple users and test WebSocket communication.

---

# Broadcasting Test

When one user joins an activity:

```javascript
socket.emit(
  'join_activity',
  {
    activityName: 'Chess Club'
  }
);
```

Other connected users instantly receive:

```text
A new user joined Chess Club
```

---

# Room-Based Communication

Users can subscribe to specific event rooms:

```javascript
socket.emit(
  'subscribe_to_event',
  'event-101'
);
```

Only users inside that room receive targeted updates.

---

# Why Rooms Matter

Rooms prevent unnecessary global broadcasts.

Benefits include:

- Reduced bandwidth usage
- Better scalability
- Event-specific notifications
- Activity segmentation
- Efficient real-time delivery

---

# Reflection Question

If MeetMux scales to one million simultaneous users, a single Node.js server would struggle because every WebSocket connection remains active in memory. Since WebSockets are stateful and persistent, maintaining millions of open connections would consume large amounts of RAM, CPU resources, and network bandwidth.

Additionally, a single server becomes a bottleneck because all users depend on the same process for real-time communication. If the server crashes, every connected client disconnects instantly.

A Pub/Sub system like Redis helps solve this problem by enabling distributed real-time communication across multiple backend servers. Redis acts as a central message broker where one server can publish events and other servers can instantly receive and broadcast them to their connected users. This allows horizontal scaling, better fault tolerance, and efficient handling of massive concurrent WebSocket traffic in production systems like MeetMux.

---

# Key Learnings

- WebSocket architecture
- Real-time communication
- Persistent socket connections
- Event broadcasting
- Room-based segmentation
- Connection lifecycle management
- Scalable backend design

---

# Deliverables Included

- Socket.io Server
- Real-Time Event Broadcasting
- Room Subscription Logic
- Client Simulation
- Console Logs
- Documentation
- GitHub Repository

---
