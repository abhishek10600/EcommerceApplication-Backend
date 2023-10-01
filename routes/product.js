const express = require("express");
const router = express.Router();

const { testProduct } = require("../controllers/productController.js");
const { isLoggedIn, customRole } = require("../middlewares/user.js");

router.route("/testProduct").get(testProduct);

module.exports = router;