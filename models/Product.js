const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the name of the product"],
        trim: true,
        maxLength: [120, "Product name cannot be more than 120 characters"]
    },
    price: {
        type: Number,
        required: [true, "Please provide a price of the product"],
        maxLength: [5, "Product price cannot be more than 5 digits"],
    },
    description: {
        type: String,
        required: [true, "Please provide a product description"],
    },
    photos: [
        {
            id: {
                type: String,
                required: true
            },
            secure_url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please select a category from short-sleeves, long-sleeves, sweat-shirts, hoodies"],
        enum: {
            values: [
                "shortssleeves",
                "longsleeves",
                "sweatshirts",
                "hoodies"
            ],
            message: "Please select a category ONLY from short-sleeves, long-sleeves, sweat-shirts, hoodies"
        }
    },
    brand: {
        type: String,
        required: [true, "Please enter the brand name"],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})


module.exports = mongoose.model("Product", productSchema);