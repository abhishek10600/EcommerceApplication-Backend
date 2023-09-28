const mongoose = require("mongoose");

const connectWithDb = () => {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(
        console.log("Connected to database successfully")
    ).catch(error => {
        console.log("Database connection failed");
        console.log(error);
        process.exit(1);
    })
}

module.exports = connectWithDb;