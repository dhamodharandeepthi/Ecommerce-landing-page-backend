const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// model
const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  quantity: Number,
});

const Product = mongoose.model("Product", ProductSchema);

// routes
app.get("/api/products", async (req, res) => {
  const { search, category } = req.query;

  let query = {};
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }
  if (category) {
    query.category = category;
  }

  const products = await Product.find(query);
  res.json(products);
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
