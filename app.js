/**
 * Main application file.
 * 
 * NOTE: This file contains many required packages, but not all of them - you may need to add more!
 */

// Setup Express
const express = require("express");
const app = express();
const port = 3000;

// Setup Handlebars
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars.engine({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Setup body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Setup cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Make the "public" folder available statically
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

//Make the "tinymce" folder available statically
app.use("/scripts", express.static(path.join(__dirname, "node_modules/tinymce")));

// Use the toaster middleware
app.use(require("./middleware/toaster-middleware.js"));

//Runs everytime get/post request made. Checks if user still is logged in.
const { addUserToLocals } = require("./middleware/auth-middleware.js");
app.use(addUserToLocals);

// Setup routes
app.use(require("./routes/application-routes.js"));
app.use(require("./routes/auth-routes.js"));
app.use(require("./routes/article-management-routes.js"));
app.use(require("./routes/display-routes.js"));
app.use(require("./routes/comments-and-ratings-routes.js"));

// Start the server running.
app.listen(port, function () {
    console.log(`The Best App In The World ™️ listening on port ${port}!`);
});

