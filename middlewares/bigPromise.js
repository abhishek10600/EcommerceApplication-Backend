//we can also avoid this and use the simple try-catch in our controllers

module.exports = (func) => (req, res, next) =>
    Promise.resolve(func(req, res, next)).catch(next);