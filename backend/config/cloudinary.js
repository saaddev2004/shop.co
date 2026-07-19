const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. Cloudinary ko .env wali keys se connect karna
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Storage engine banana (batana ke image Cloudinary mein kahan save hogi)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'shopco_products', // Cloudinary par is naam ka folder banega
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Sirf images allow hongi
    },
});

// 3. Upload middleware tayyar karna
const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };