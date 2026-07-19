const Product = require("../models/Product.model");
const { cloudinary } = require("../config/cloudinary"); // <-- Cloudinary connection import kiya

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get new arrival products
// @route   GET /api/products/new-arrivals
// @access  Public
const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ isNewArrival: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get products on sale
// @route   GET /api/products/on-sale
// @access  Public
const getOnSaleProducts = async (req, res) => {
  try {
    const products = await Product.find({ isOnSale: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    let {
      name, description, price, oldPrice, discount, category,
      image, allImages, sizes, colors, colorStock, isOnSale, isNewArrival,
    } = req.body;

    // ✨ MAGIC: Agar main image heavy Base64 format mein hai, toh Cloudinary par bhej do
    if (image && image.startsWith("data:image")) {
      const uploadRes = await cloudinary.uploader.upload(image, { folder: "shopco_products" });
      image = uploadRes.secure_url; // Heavy string ki jagah chota fast URL aa gaya
    }

    // ✨ MAGIC: Agar multiple thumbnails hain, toh unko bhi Cloudinary par upload karo
    if (allImages && allImages.length > 0) {
      allImages = await Promise.all(
        allImages.map(async (img) => {
          let imgData = typeof img === 'string' ? img : img.url;
          if (imgData && imgData.startsWith("data:image")) {
            const res = await cloudinary.uploader.upload(imgData, { folder: "shopco_products" });
            return typeof img === 'string' ? res.secure_url : { ...img, url: res.secure_url };
          }
          return img;
        })
      );
    }

    const product = new Product({
      name, description, price, oldPrice, discount, category,
      image, allImages, sizes, colors, colorStock, isOnSale, isNewArrival,
      createdBy: req.user._id, // ID of the admin making the request
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      let newImage = req.body.image;
      // ✨ MAGIC: Agar update mein nayi image aayi hai
      if (newImage && newImage.startsWith("data:image")) {
        const uploadRes = await cloudinary.uploader.upload(newImage, { folder: "shopco_products" });
        newImage = uploadRes.secure_url;
      }

      let newAllImages = req.body.allImages;
      // ✨ MAGIC: Agar update mein nayi thumbnails aayi hain
      if (newAllImages && newAllImages.length > 0) {
        newAllImages = await Promise.all(
          newAllImages.map(async (img) => {
            let imgData = typeof img === 'string' ? img : img.url;
            if (imgData && imgData.startsWith("data:image")) {
              const res = await cloudinary.uploader.upload(imgData, { folder: "shopco_products" });
              return typeof img === 'string' ? res.secure_url : { ...img, url: res.secure_url };
            }
            return img;
          })
        );
      }

      // Update only the fields provided
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.oldPrice = req.body.oldPrice !== undefined ? req.body.oldPrice : product.oldPrice;
      product.discount = req.body.discount !== undefined ? req.body.discount : product.discount;
      product.category = req.body.category || product.category;
      product.image = newImage || product.image; // Cloudinary URL
      product.allImages = newAllImages || product.allImages; // Cloudinary URLs
      product.sizes = req.body.sizes || product.sizes;
      product.colors = req.body.colors || product.colors;
      product.colorStock = req.body.colorStock || product.colorStock;
      product.isOnSale = req.body.isOnSale !== undefined ? req.body.isOnSale : product.isOnSale;
      product.isNewArrival = req.body.isNewArrival !== undefined ? req.body.isNewArrival : product.isNewArrival;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
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