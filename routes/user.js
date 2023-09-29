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
    updateLoggedInUserDetails
} = require("../controllers/userController.js");
const { isLoggedIn } = require("../middlewares/user.js");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(isLoggedIn, logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/password/update").put(isLoggedIn, changePassword);
router.route("/userdashboard").get(isLoggedIn, getLoggedInUserDetails);
router.route("/userdashboard/update").put(isLoggedIn, updateLoggedInUserDetails);

module.exports = router;