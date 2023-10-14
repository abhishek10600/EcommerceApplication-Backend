const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            require: [true, "Please enter address where the product needs to be delivered."]
        },
        city: {
            type: String,
            require: [true, "Please enter the city."]
        },
        postalCode: {
            type: String,
            required: [true, "Please enter the postal PIN code"]
        },
        state: {
            type: String,
            required: [true, "Please enter the state"]
        },
        country: {
            type: String,
            required: [true, "Please enter the country."]
        },
        phoneNumber: {
            type: Number,
            require: [true, "Please enter the phone number"]
        },
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true,
            },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
                required: true
            }
        }
    ],
    paymentInfo: {
        id: {
            type: String
        }
    },
    taxAmount: {
        type: Number,
        required: true
    },
    shippingAmount: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        required: true,
        default: "processing"
    },
    deliveredAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Order", orderSchema);