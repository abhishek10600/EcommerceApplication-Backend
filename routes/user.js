const express = require("express");
const router = express.Router();

const {
    signup,
    login,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    getLoggedInUserDetails,
    updateLoggedInUserDetails,
    adminGetAllUsers,
    adminGetOneUser,
    adminUpdateOneUserDetails,
    adminDeleteOneUser,
    managerGetAllUsers
} = require("../controllers/userController.js");
const { isLoggedIn, customRole } = require("../middlewares/user.js");

//user routes
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(isLoggedIn, logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/password/update").put(isLoggedIn, changePassword);
router.route("/userdashboard").get(isLoggedIn, getLoggedInUserDetails);
router.route("/userdashboard/update").put(isLoggedIn, updateLoggedInUserDetails);

//admin only routes
router.route("/admin/users").get(isLoggedIn, customRole("admin"), adminGetAllUsers);
router.route("/admin/users/:id").get(isLoggedIn, customRole("admin"), adminGetOneUser);
router.route("/admin/users/:id").put(isLoggedIn, customRole("admin"), adminUpdateOneUserDetails);
router.route("/admin/users/:id").delete(isLoggedIn, customRole("admin"), adminDeleteOneUser);
//manager only route
router.route("/manager/users").get(isLoggedIn, customRole("manager"), managerGetAllUsers);

module.exports = router;