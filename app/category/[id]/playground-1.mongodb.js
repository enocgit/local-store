// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("tropikalfoods");

// Create a new document in the collection.
db.getCollection("categories").insertOne({
  name: "Frozen Foods",
  description: "Premium quality frozen meals and ingredients",
  image:
    "https://images.unsplash.com/photo-1630431341973-02e1b662ec35?auto=format&fit=crop&w=1920&q=80",
});
