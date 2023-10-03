const express = require("express");
const router = express.Router();

const { createProduct } = require("../controllers/productController.js");
const { isLoggedIn, customRole } = require("../middlewares/user.js");

router.route("/addProduct").post(isLoggedIn, createProduct);

module.exports = router;