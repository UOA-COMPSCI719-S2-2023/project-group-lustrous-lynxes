const express = require("express");
const router = express.Router();


const authUser = require("../middleware/auth-middleware.js");

//render home page. User remains logged in until logged out
router.get("/", authUser.verifyAuthenticated, (req, res) => {
    res.locals.title = "Lustrous Lynxes";
    res.render("account");
});

//Login Clicked
router.get("/login", authUser.checkIfLoggedIn, (req, res) => {
    res.render("login");
});

//Submit Login form. Verification done first. If correct, call next and proceed with code.
router.post("/login", authUser.checkLoginCredentials, (req, res) => {
    res.render("account")
});

//Logout Clicked
router.get("/logout", authUser.removeToken, (req, res) => {
    res.clearCookie("authToken");
    res.locals.user = null;
    res.setToastMessage("Successfully logged out!");
    res.redirect("./login");
});

//Renders add-article page which allows user to create an article
router.get("/add-article", authUser.verifyAuthenticated, (req, res) => {
    res.render("add-article");
});

module.exports = router;