# 📘 Day 5 Report — The Persistence Layer

## 🎯 Objective

The goal of Day 5 was to transform the backend from a static API into a dynamic system by integrating a database. This involved connecting the server to MongoDB, defining schemas, and performing CRUD operations using Mongoose.

---

## 🧠 Understanding SQL vs NoSQL

Before implementation, we studied the difference between relational and non-relational databases.

### 🔹 SQL (Relational Databases)

- Uses structured tables (rows and columns)  
- Fixed schema  
- Examples: MySQL, PostgreSQL  

### 🔹 NoSQL (MongoDB)

- Uses flexible JSON-like documents  
- Schema is dynamic  
- Best suited for modern JavaScript applications  

### ✅ Why MongoDB with Node.js?

MongoDB stores data in JSON-like format (BSON), which aligns perfectly with JavaScript objects used in Node.js. This makes development faster and more intuitive.

---

## 🛢️ Database Connection Setup

We used Mongoose (ODM) to connect Node.js with MongoDB.

### 🔧 Installation

```bash
npm install mongoose

---

## 🔧 Technical Summary

Today, I implemented the persistence layer by integrating MongoDB with my Node.js backend using Mongoose. I learned how to establish a database connection, define schemas and models, and perform CRUD operations. I created a User model and successfully stored and retrieved data from the database using API endpoints.

---

## 🐞 Bug Log

**Bug:** MongoDB connection was failing initially.  

**Fix:** I realized that MongoDB service was not running locally. After starting the MongoDB server and verifying the connection string, the issue was resolved and the database connected successfully.

---

## 🧠 Conceptual Reflection

MongoDB (NoSQL) is preferred in Node.js applications because it stores data in JSON-like documents, which aligns naturally with JavaScript objects. This makes data handling more flexible compared to relational databases.

Mongoose acts as an ODM (Object Data Modeling), helping enforce structure through schemas while still maintaining flexibility.

---

## 🧪 API Testing

- Successfully tested `POST /register` using Thunder Client  
- Received **201 Created** status confirming data insertion  
- Verified stored data using `GET /users`  
