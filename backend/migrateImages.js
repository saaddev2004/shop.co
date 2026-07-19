const mongoose = require('mongoose');
const Product = require('./models/Product.model'); // Agar tera model kisi aur folder mein hai toh path theek kar lena
const { cloudinary } = require('./config/cloudinary');
require('dotenv').config();

const migrateImages = async () => {
    try {
        // Database se connect karna
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🟢 Database connected. Starting migration...");

        const products = await Product.find({});
        let updatedCount = 0;

        for (let product of products) {
            let isUpdated = false;

            // 1. Main image ko Cloudinary par bhejna
            if (product.image && product.image.startsWith('data:image')) {
                console.log(`Uploading main image for product: ${product.name}...`);
                const res = await cloudinary.uploader.upload(product.image, { folder: 'shopco_products' });
                product.image = res.secure_url;
                isUpdated = true;
            }

            // 2. AllImages (Thumbnails) ko Cloudinary par bhejna
            if (product.allImages && product.allImages.length > 0) {
                for (let i = 0; i < product.allImages.length; i++) {
                    let img = product.allImages[i];
                    let imgData = typeof img === 'string' ? img : img.url;

                    if (imgData && imgData.startsWith('data:image')) {
                        console.log(`Uploading thumbnail ${i + 1} for product: ${product.name}...`);
                        const res = await cloudinary.uploader.upload(imgData, { folder: 'shopco_products' });

                        if (typeof img === 'string') {
                            product.allImages[i] = res.secure_url;
                        } else {
                            product.allImages[i].url = res.secure_url;
                        }
                        isUpdated = true;
                    }
                }
            }

            // Agar image update hui hai toh save kar do
            if (isUpdated) {
                await product.save();
                console.log(`✅ Product updated successfully: ${product.name}`);
                updatedCount++;
            }
        }

        console.log(`\n🎉 Migration Complete! Total products fixed: ${updatedCount}`);
        process.exit();
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
};

migrateImages();