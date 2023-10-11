const express = require("express");
const router = express.Router();

const { addProduct, getAllProducts, getOneProduct, adminGetAllProducts, adminUpdateProduct, adminDeleteProduct } = require("../controllers/productController.js");
const { isLoggedIn, customRole } = require("../middlewares/user.js");

//user routes
router.route("/products").get(getAllProducts);
router.route("/product/:id").get(getOneProduct);

//admin routes
router.route("/admin/product/add").post(isLoggedIn, customRole("admin"), addProduct);
router.route("/admin/products").get(isLoggedIn, customRole("admin"), adminGetAllProducts);
router.route("/admin/product/update/:id").put(isLoggedIn, customRole("admin"), adminUpdateProduct);
router.route("/admin/product/delete/:id").delete(isLoggedIn, customRole("admin"), adminDeleteProduct);

module.exports = router;