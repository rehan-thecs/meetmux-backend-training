# Day 5 Report - Backend Developer

## Technical Summary
Today, I implemented the persistence layer by integrating MongoDB with my Node.js backend using Mongoose. I learned how to establish a database connection, define schemas and models, and perform CRUD operations. I created a User model and successfully stored and retrieved data from the database using API endpoints.

## Bug Log
Bug: MongoDB connection was failing initially.

Fix: I realized that MongoDB service was not running locally. After starting the MongoDB server and verifying the connection string, the issue was resolved and the database connected successfully.

## Conceptual Reflection
MongoDB (NoSQL) is preferred in Node.js applications because it stores data in JSON-like documents, which aligns naturally with JavaScript objects. This makes data handling more flexible compared to relational databases. Mongoose acts as an ODM, helping enforce structure through schemas while still maintaining flexibility.

## API Testing
- Successfully tested POST /register using Thunder Client
- Received 201 Created status confirming data insertion
- Verified stored data using GET /users

## Key Learning
I understood how data flows from client → server → database and how backend systems persist and retrieve data in real-world applications.