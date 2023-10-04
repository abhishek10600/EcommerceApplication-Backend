const express = require("express");
const router = express.Router();

const { addProduct, getAllProducts } = require("../controllers/productController.js");
const { isLoggedIn, customRole } = require("../middlewares/user.js");

//user routes
router.route("/products").get(getAllProducts);

//admin routes
router.route("/admin/product/add").post(isLoggedIn, customRole("admin"), addProduct);

module.exports = router;