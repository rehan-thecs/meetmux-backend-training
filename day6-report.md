# 📘 Day 6 Report — Authentication & Security

## 🎯 Objective

The objective of Day 6 was to implement authentication and security mechanisms in the backend. This included password hashing using bcrypt and token-based authentication using JSON Web Tokens (JWT).

---

## 🔐 Password Hashing (Bcrypt)

Passwords must never be stored in plain text. We implemented hashing using bcryptjs to secure user credentials.

### 🔍 Implementation

- Used a Mongoose pre-save hook to hash passwords before storing in the database  
- Added salt to increase security  

### 📌 Code Snippet

```js id="bcrypt001"
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});