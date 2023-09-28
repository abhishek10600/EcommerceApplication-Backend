require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const app = express();

//importing all the router
const home = require("./routes/home.js");
const user = require("./routes/user.js");

//for swagger documentation
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//regular middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookies and file middleware
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));

//setting up ejs view engine
app.set("view engine", "ejs");

app.get("/signuptest", (req, res) => {
    res.render("testForm");
})

//morgan middleware
app.use(morgan("tiny"));

//router middleware
app.use("/api/v1", home);
app.use("/api/v1", user);

module.exports = app;