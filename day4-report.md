# 📘 Day 4 Report — The Data Architect

## 🔐 Why do we use .env files instead of writing keys in code?

Environment variables (.env files) are used to securely store sensitive information such as API keys, database URLs, and configuration settings.

If we hardcode these values in our source code:

- They may get exposed when pushing code to GitHub  
- Anyone can misuse our credentials  
- It becomes difficult to manage different environments (development, production)  

Using .env ensures:

- Security of sensitive data  
- Easy configuration management  
- Separation of code and secrets  

---

## 🧱 Controller Pattern Implementation

To avoid clutter in `index.js` and follow modular architecture, we separated business logic into a controller file.

- Created `controllers/userController.js`  
- Moved logic for fetching users into controller  
- Imported controller into `index.js`  

This improves:

- Code readability  
- Maintainability  
- Scalability of backend systems  

---

## 📥 POST API Implementation

We implemented a POST route `/api/register` to handle user registration.

### Features:

- Accepts JSON body input  
- Validates required fields (username & password)  
- Returns appropriate response  

---

## 📊 HTTP Status Codes Used

| Status Code     | Meaning                       |
|----------------|------------------------------|
| 200 OK         | Successful GET request        |
| 201 Created    | Resource created successfully |
| 400 Bad Request| Missing or invalid input data |

---

## 🧪 API Testing

We used Thunder Client / Postman to test APIs.

### Test Case:

- Method: POST  
- Endpoint: `/api/register`  

### Body:

```json
{
  "username": "dev_alpha",
  "password": "123"
}