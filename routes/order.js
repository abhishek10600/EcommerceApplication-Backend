const express = require("express");
const router = express.Router();
const { createOrder, getOneOrder, getAllOrdersByLoggedInUser, adminGetAllOrders, adminUpdateOrder, adminDeleteOrder } = require("../controllers/orderController.js");
const { isLoggedIn, customRole } = require("../middlewares/user.js");

router.route("/order/create").post(isLoggedIn, createOrder);
router.route("/myorders").get(isLoggedIn, getAllOrdersByLoggedInUser);
router.route("/order/:id").get(isLoggedIn, getOneOrder);

//admin order routes
router.route("/admin/order/all").get(isLoggedIn, customRole("admin"), adminGetAllOrders);
router.route("/admin/order/:id").put(isLoggedIn, customRole("admin"), adminUpdateOrder);
router.route("/admin/order/:id").delete(isLoggedIn, customRole("admin"), adminDeleteOrder);


module.exports = router;