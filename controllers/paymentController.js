const BigPromise = require("../middlewares/bigPromise.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET);



exports.sendStripeKey = BigPromise(async (req, res, next) => {
    res.status(200).json({
        stripe_key: process.env.STRIPE_API_KEY
    })
})

exports.captureStripePayment = BigPromise(async (req, res, next) => {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "inr",
        metadata: { integration_check: "accept_a_payment" },
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.status(200).json({
        success: true,
        message: "Payment successfull",
        amount: amount,
        payment_id: paymentIntent.id,
        client_secret: paymentIntent.client_secret
    })

})

exports.sendRazorpayKey = BigPromise(async (req, res, next) => {
    res.status(200).json({
        razorpay_key: process.env.RAZORPAY_API_KEY
    })
})

exports.captureRazorpayPayment = BigPromise(async (req, res, next) => {
    const instance = new Razorpay(
        {
            key_id: process.env.RAZORPAY_API_KEY,
            key_secret: process.env.RAZORPAY_API_SECRET
        }
    )
    const { amount } = req.body;
    const options = {
        amount: amount,
        currency: "INR",
        receipt: "receipt#1",
    }
    const myOrder = await instance.orders.create(options);
    res.status(200).json({
        success: true,
        amount: amount,
        order: myOrder
    })
})