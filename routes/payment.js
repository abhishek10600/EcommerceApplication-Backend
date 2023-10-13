const express = require("express");
const router = express.Router();

const { sendStripeKey, sendRazorpayKey, captureRazorpayPayment, captureStripePayment } = require("../controllers/paymentController.js");
const { isLoggedIn } = require("../middlewares/user.js");

router.route("/stripekey").get(isLoggedIn, sendStripeKey);
router.route("/razorpaykey").get(isLoggedIn, sendRazorpayKey);

router.route("/capturestripe").post(isLoggedIn, captureStripePayment);
router.route("/capturerazorpay").post(isLoggedIn, captureRazorpayPayment);

module.exports = router;