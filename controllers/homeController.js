const BigPromise = require("../middlewares/bigPromise.js");

exports.home = BigPromise(async (req, res) => {
    //const db = await something();
    res.status(200).json({
        success: true,
        message: "Home Controller is working"
    })
})

exports.homeDummy = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Home Dummy is working"
    })
}