const BigPromise = require("../middlewares/bigPromise.js");
const Product = require("../models/Product.js");
const cloudinary = require("cloudinary").v2;
const WhereClause = require("../utils/whereClause.js");

exports.addProduct = BigPromise(async (req, res, next) => {
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


//user product controllers

exports.getAllProducts = BigPromise(async (req, res, next) => {
    const resultPerPage = 6;
    const totalProductCount = await Product.countDocuments();

    const productsObj = new WhereClause(Product.find(), req.query).search().filter();

    let products = await productsObj.base.clone();

    const filteredProductCount = products.length;

    productsObj.pager(resultPerPage);

    products = await productsObj.base;

    res.status(200).json({
        success: true,
        products,
        filteredProductCount,
        totalProductCount
    })
})

exports.getOneProduct = BigPromise(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        return next(new Error("No product with this id found"));
    }
    res.status(200).json({
        success: true,
        product
    })
})


//admin product controllers

exports.adminGetAllProducts = BigPromise(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products
    })
})

exports.adminUpdateProduct = BigPromise(async (req, res, next) => {
    const productId = req.params.id;
    let product = await Product.findById(productId);
    if (!product) {
        return next(new Error("Product with this id does not exists."));
    }
    let imagesArray = [];
    if (req.files) {
        //delete the old images
        for (let index = 0; index < product.photos.length; index++) {
            const res = await cloudinary.uploader.destroy(product.photos[index].id);
        }
        //save new images
        for (let index = 0; index < req.files.photos.length; index++) {
            let result = await cloudinary.uploader.upload(req.files.photos[index].tempFilePath, {
                folder: "ecommerceapp/products"
            })
            imagesArray.push({
                id: result.public_id,
                secure_url: result.secure_url
            })
        }
        req.body.photos = imagesArray;
    }
    product = await Product.findByIdAndUpdate(productId, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product
    })
})

exports.adminDeleteProduct = BigPromise(async (req, res, next) => {
    const productId = req.params.id;
    let product = await Product.findById(productId);
    if (!product) {
        return netx(new Error("Product with this id does not exists"));
    }
    for (let index = 0; index < product.photos.length; index++) {
        await cloudinary.uploader.destroy(product.photos[index].id);
    }
    await product.deleteOne();
    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })
})