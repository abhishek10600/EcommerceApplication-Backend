const express = require("express");
const { home, homeDummy } = require("../controllers/homeController.js");
const router = express.Router();

router.route("/").get(home);
router.route("/dummy").get(homeDummy);

module.exports = router;