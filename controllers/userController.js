const User = require("../models/User.js");
const BigPromise = require("../middlewares/bigPromise.js");
const cookieToken = require("../utils/cookieToken.js");
const cloudinary = require("cloudinary").v2;
const mailHelper = require("../utils/emailHelper.js");
const crypto = require("crypto");

exports.signup = BigPromise(async (req, res, next) => {
    let result;
    if (!req.files) {
        return next(new Error("Photo is required"));
    }
    const { name, email, password } = req.body;
    if (!email) {
        return next(new Error("Please enter an email"));
    }
    let file = req.files.photo
    result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "ecommerceapp",
        width: 150,
        crop: "scale"
    })
    const user = await User.create({
        name,
        email,
        password,
        photo: {
            id: result.public_id,
            secure_url: result.secure_url
        }
    });
    cookieToken(user, res);
})

exports.login = BigPromise(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new Error("Email or password not provided!"));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new Error("Invalid email or password"));
    }
    const isPasswordCorrect = await user.isValidatedPassword(password);
    if (!isPasswordCorrect) {
        return next(new Error("Invalid email or password"));
    }
    cookieToken(user, res);
})

exports.logout = BigPromise(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: "Logout success."
    })
})

exports.forgotPassword = BigPromise(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new Error("User with this email does not exists"));
    }
    const forgotToken = user.getForgotPasswordToken();
    user.save({ validateBeforeSave: false });
    const myUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgotToken}`;
    const message = `Copy and paste this link in your URL and press enter \n\n ${myUrl}`;
    try {
        await mailHelper({
            email: user.email,
            subject: "EcommApp-Password reset email",
            message
        });
        res.status(200).json({
            success: true,
            message: "Reset password email sent to your email"
        })
    } catch (error) {
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        user.save({ validateBeforeSave: false });
        return next(new Error(error.message));
    }

})

exports.resetPassword = BigPromise(async (req, res, next) => {
    const token = req.params.token;
    const { password, confirmPassword } = req.body;
    const encryToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        forgotPasswordToken: encryToken,
        forgotPasswordExpiry: { $gt: Date.now() }
    });
    if (!user) {
        return next(new Error("Token is invalid or is expired"));
    }
    if (password !== confirmPassword) {
        return next(new Error("password and confirm password do not match"));
    }
    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();

    //send a json response or send token
    cookieToken(user, res);
})

exports.changePassword = BigPromise(async (req, res, next) => {
    const userId = req.user.id;
    const user = await User.findById(userId).select("+password");
    if (!user) {
        return next(new Error("User does not exists"));
    }
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    const isOldPasswordCorrect = await user.isValidatedPassword(oldPassword);
    if (!isOldPasswordCorrect) {
        return next(new Error("Your old password is incorrect"));
    }
    if (newPassword !== confirmNewPassword) {
        return next(new Error("Confirm your password correctly"));
    }
    user.password = newPassword;
    await user.save();
    cookieToken(user, res);
})

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    })
})

exports.updateLoggedInUserDetails = BigPromise(async (req, res, next) => {
    const userId = req.user.id;
    const { name, email } = req.body;
    if (name === "" || email === "") {
        return next(new Error("Please provide a name and email"));
    }
    const newData = {
        name: name,
        email: email
    };
    //if user changes the photo
    if (req.files) {
        const user = await User.findById(userId);
        const imageId = user.photo.id;
        //deleting the image in cloudinary by using the imageId
        const resp = await cloudinary.uploader.destroy(imageId);
        //uploading the new photo
        let file = req.files.photo;
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "ecommerceapp",
            width: 150,
            crop: "scale"
        })
        newData.photo = {
            id: result.public_id,
            secure_url: result.secure_url
        }
    }
    const user = await User.findByIdAndUpdate(userId, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        user,
        message: "User updated successfully"
    })
})