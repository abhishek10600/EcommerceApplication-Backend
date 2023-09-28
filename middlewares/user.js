const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

exports.isLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return next(new Error("Login First to access this page"))
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //injecting my propery in request as req.user
        req.user = await User.findById(decoded.id)
        next();
    } catch (error) {
        return next(new Error(error));
    }
}