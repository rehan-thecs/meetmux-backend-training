# Day 3 Report – Backend Developer (Node.js)

## ◈ Setup Status
My development environment is fully operational.

- Node.js and npm installed and verified
- Visual Studio Code configured
- Express.js installed and working
- Nodemon installed for auto-restart
- Server running successfully on localhost:3000

---

## ◈ Task Inventory

- Created multiple routes:
  - `/about` for text response
  - `/user` for JSON response
  - `/api/users` for user data
- Implemented middleware for logging requests
- Configured Nodemon for automatic server restart
- Created a dummy data array to simulate database
- Tested all endpoints in browser

---

## ◈ Debugging Log

### 1. Issue: Server not restarting automatically
- Problem: Nodemon was not working
- Solution: Installed nodemon locally using: `npm install nodemon --save-dev`, Then run: `npx nodemon index.js`

---

### 2. Issue: API not responding (request hanging)
- Problem: Forgot to call `next()` in middleware
- Solution: Added `next()` to pass control to next handler

---

## ◈ Key Insights

- I understood how middleware works as a request processing layer before reaching routes.
- Learned that `res.json()` automatically handles headers and sends structured data.
- Realized how backend APIs serve data to frontend applications in real-world systems.

---

## ◈ Conclusion

Day 3 helped me move from basic server setup to building structured APIs with proper routing, middleware, and data handling. My backend foundation is now stronger and more aligned with industry practices.