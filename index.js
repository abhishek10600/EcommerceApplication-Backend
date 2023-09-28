require("dotenv").config();
const connectWithDb = require("./config/database.js");
const app = require("./app.js");
const cloduinary = require("cloudinary").v2;

//connection with database
connectWithDb();

//cloudinary configuration
cloduinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`App running at PORT ${PORT}`);
})