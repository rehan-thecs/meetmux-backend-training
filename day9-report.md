# 📘 Day 9 Report — API Optimization

## 🎯 Objective

The objective of Day 9 was to optimize backend performance by implementing pagination and virtual fields. This helps in handling large datasets efficiently and improving API response quality.

---

## ⚡ Pagination Implementation

Pagination was implemented using `limit` and `skip` to control the number of records returned per request.

### 📌 Logic

* `page` determines current page number
* `limit` defines number of records per page
* `skip = (page - 1) * limit`

### 📌 Code Snippet

```js
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 2;
const skip = (page - 1) * limit;

const posts = await Post.find()
  .populate('author', ['username', 'email'])
  .skip(skip)
  .limit(limit);
```

---

## 📊 API Response Structure

```json
{
  "page": 1,
  "limit": 2,
  "results": 2,
  "data": [ ... ]
}
```

---

## 🧪 Testing Pagination

### 🔹 Page 1

GET /api/posts?page=1&limit=2

### 🔹 Page 2

GET /api/posts?page=2&limit=2

### ✅ Result

* Page 1 returned first set of posts
* Page 2 returned next set of posts
* Data differed across pages

---

## 🧠 Virtual Fields Implementation

Virtual fields were added to dynamically compute values without storing them in the database.

### 📌 Code Snippet

```js
PostSchema.virtual('contentLength').get(function () {
  return this.content.length;
});
```

### ✅ Result

* API response includes computed field `contentLength`
* No additional storage required in database

---

## ⚡ Benefits of Optimization

* Reduced response size
* Improved performance
* Efficient handling of large datasets
* Better scalability

---

## 📊 Final Checklist

* [x] Pagination implemented using limit and skip
* [x] API tested with multiple pages
* [x] Virtual field added
* [x] Optimized API response structure

---

## 🏁 Conclusion

Day 9 focused on transforming a functional backend into a high-performance system. By implementing pagination and virtual fields, the API can now efficiently handle large datasets while maintaining performance and scalability.

This step is crucial for building production-ready backend systems.
