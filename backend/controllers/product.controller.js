const Product = require("../models/Product.model");

// @desc    Sare products laana (Get all products)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    // Sab products fetch karo database se
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Products fetch karne mein masla aaya", error: error.message });
  }
};

// @desc    Ek khaas product laana uski ID se (Get single product by ID)
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product nahi mila" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Naye aaye hue products laana (Get new arrivals)
// @route   GET /api/products/new-arrivals
// @access  Public
const getNewArrivals = async (req, res) => {
  try {
    // Wo products lao jinka 'isNewArrival' true hai
    const products = await Product.find({ isNewArrival: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Sale wale products laana (Get on sale products)
// @route   GET /api/products/on-sale
// @access  Public
const getOnSaleProducts = async (req, res) => {
  try {
    // Wo products lao jinka 'isOnSale' true hai
    const products = await Product.find({ isOnSale: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Naya product add karna (Create a product)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      oldPrice,
      discount,
      category,
      image,
      allImages,
      sizes,
      colors,
      colorStock,
      isOnSale,
      isNewArrival,
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      oldPrice,
      discount,
      category,
      image,
      allImages,
      sizes,
      colors,
      colorStock,
      isOnSale,
      isNewArrival,
      createdBy: req.user._id, // Jis admin ne request bheji hai uski ID
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: "Product create karne mein masla aaya", error: error.message });
  }
};

// @desc    Product ki details update karna (Update a product)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Jo fields body mein aayi hain unko update karo, warna purani wali hi rehne do
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.oldPrice = req.body.oldPrice !== undefined ? req.body.oldPrice : product.oldPrice;
      product.discount = req.body.discount !== undefined ? req.body.discount : product.discount;
      product.category = req.body.category || product.category;
      product.image = req.body.image || product.image;
      product.allImages = req.body.allImages || product.allImages;
      product.sizes = req.body.sizes || product.sizes;
      product.colors = req.body.colors || product.colors;
      product.colorStock = req.body.colorStock || product.colorStock;
      product.isOnSale = req.body.isOnSale !== undefined ? req.body.isOnSale : product.isOnSale;
      product.isNewArrival = req.body.isNewArrival !== undefined ? req.body.isNewArrival : product.isNewArrival;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product nahi mila" });
    }
  } catch (error) {
    res.status(500).json({ message: "Product update karne mein masla aaya", error: error.message });
  }
};

// @desc    Product delete karna (Delete a product)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: "Product delete ho gaya" });
    } else {
      res.status(404).json({ message: "Product nahi mila" });
    }
  } catch (error) {
    res.status(500).json({ message: "Product delete karne mein masla aaya", error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getNewArrivals,
  getOnSaleProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
