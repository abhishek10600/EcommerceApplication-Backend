exports.testProduct = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Product Controller working"
    })
}