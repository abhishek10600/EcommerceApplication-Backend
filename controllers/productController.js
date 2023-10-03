const BigPromise = require("../middlewares/bigPromise.js");
const Product = require("../models/Product.js");
const cloudinary = require("cloudinary").v2;

exports.createProduct = BigPromise(async (req, res, next) => {
    let imagesArray = [];
    let result;
    if (!req.files) {
        return next(new Error("Please select images"));
    }
    if (req.files) {
        for (let index = 0; index < req.files.photos.length; index++) {
            result = await cloudinary.uploader.upload(req.files.photos[index].tempFilePath, {
                folder: "ecommerceapp/products"
            })
            imagesArray.push({
                id: result.public_id,
                secure_url: result.secure_url
            })
        }
    }
    req.body.photos = imagesArray;
    req.body.user = req.user.id
    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        message: "Product added successfully",
        product
    })
})