const Order = require("../models/Order.js");
const Product = require("../models/Product.js");
const BigPromise = require("../middlewares/bigPromise.js");

exports.createOrder = BigPromise(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, taxAmount, shippingAmount, totalAmount } = req.body;
    const user = req.user._id;
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        taxAmount,
        shippingAmount,
        totalAmount,
        user
    })
    res.status(201).json({
        success: true,
        message: "Order created sucessfully",
        order
    })
})

exports.getAllOrdersByLoggedInUser = BigPromise(async (req, res, next) => {
    const user = req.user;
    const orders = await Order.find({ user: user._id });
    res.status(200).json({
        success: true,
        orders
    })
})

exports.getOneOrder = BigPromise(async (req, res, next) => {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate("user", "name email");
    if (!order) {
        return next(new Error("Order with this id does not exists."))
    }
    res.status(200).json({
        success: true,
        order
    })
})

//admin order controllers
exports.adminGetAllOrders = BigPromise(async (req, res, next) => {
    const orders = await Order.find();
    res.status(200).json({
        success: true,
        orders
    })
})

exports.adminUpdateOrder = BigPromise(async (req, res, next) => {
    const orderId = req.params.id;
    const { orderStatus } = req.body;
    if (orderStatus === "delivered") {
        return next(new Error("Order has already been delivered."));
    }
    const order = await Order.findById(orderId);
    if (!order) {
        return next(new Errro("Order with this id does not exists"));
    }
    order.orderStatus = orderStatus;

    order.orderItems.forEach(async prod => {
        await updateProductStock(prod.product, prod.quantity);
    })

    await order.save();

    res.status(200).json({
        success: true,
        message: "Order updated successfully"
    })
})

exports.adminDeleteOrder = BigPromise(async (req, res) => {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) {
        return next(new Error("Order with this id does not exisst"));
    }
    await order.deleteOne();
    res.status(200).json({
        sucess: true,
        message: "Order deleted successfully"
    })
})

const updateProductStock = async (productId, quantity) => {
    const product = await Product.findById(productId);
    if (!product) {
        return next(new Error("Product with this id does not exists."))
    }
    product.stock = product.stock - quantity;
    await product.save({ validateBeforeSave: false });
}