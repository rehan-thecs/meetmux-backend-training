# Day 15 — Security, Forecasting & Hidden Patterns

## Track: Node.js Backend — API Security & Rate Limiting

## Objective

The objective of this task is to secure the MeetMux backend APIs against brute-force attacks, bot traffic, and malicious request flooding using modern backend security practices.

This implementation includes:

- HTTP Security Headers using `helmet`
- API Rate Limiting using `express-rate-limit`
- Login Route Protection
- Bot Attack Simulation
- 429 Too Many Requests Handling

---

# Technologies Used

- Node.js
- Express.js
- Helmet
- Express Rate Limit
- MongoDB
- Redis

---

# Project Structure

```bash
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
├── node_modules
│
├── .env
├── db.js
├── index.js
├── worker.js
├── package.json
└── README.md