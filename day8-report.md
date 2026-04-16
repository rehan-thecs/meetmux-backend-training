# 📘 Day 8 Report — Data Relationships & Population

## 🎯 Objective

The objective of Day 8 was to implement relationships between collections in MongoDB using Mongoose references. We created a system where users can create posts and retrieve posts along with user details using the populate() method.

---

## 🔗 Reference-Based Data Modeling

Instead of embedding posts inside the User document, we used referencing by storing the User ID inside the Post model.

### 📁 Post Schema

```js
const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});
```

### ✅ Outcome

* Established relationship between User and Post collections
* Each post is linked to a specific user via ObjectId

---

## ✍️ Creating Related Data

We implemented a POST API to create posts linked to the authenticated user.

### 📌 Endpoint

POST /api/posts

### 🔍 Logic

* Extract user ID from JWT token using auth middleware
* Store user ID in the author field

### 📌 Code Snippet

```js
const newPost = new Post({
  title: req.body.title,
  content: req.body.content,
  author: req.user.id
});
```

---

## 🔍 Fetching Data with populate()

We used Mongoose populate() to retrieve posts along with user details.

### 📌 Endpoint

GET /api/posts

### 📌 Code Snippet

```js
const posts = await Post.find()
  .populate('author', ['username', 'email']);
```

### ✅ Result

* Author field returns full user details instead of just ID
* Improved readability and usability of API response

---

## 🧪 Testing Workflow

1. Logged in to obtain JWT token
2. Created multiple posts using POST /api/posts
3. Fetched posts using GET /api/posts

### ✅ Results

* Posts successfully linked to users
* populate() returned user details inside post response

---

## ⚖️ Embedding vs Referencing

### 🔹 Embedding

* Stores related data inside one document
* Faster reads but not scalable for large datasets

### 🔹 Referencing

* Stores references (ObjectId) between collections
* Scalable and efficient for large applications

### ✅ Why Referencing is Better

Referencing is ideal for applications like Facebook or Twitter because:

* Users can have millions of posts
* Avoids large document sizes
* Improves performance and scalability

---

## 📊 Final Checklist

* [x] Post model created with reference to User
* [x] Auth middleware used to link user ID
* [x] Posts successfully stored in database
* [x] populate() used to fetch related data
* [x] Verified relationship in MongoDB

---

## 🏁 Conclusion

Day 8 introduced relational data modeling in NoSQL using references and populate(). This allows us to build scalable applications where multiple collections interact efficiently.

This marks an important step towards building real-world backend systems.
