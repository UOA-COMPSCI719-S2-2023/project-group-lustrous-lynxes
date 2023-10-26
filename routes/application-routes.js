const express = require("express");
const router = express.Router();


const {checkLoginCredentials, verifyAuthenticated,removeToken} = require("../middleware/auth-middleware.js");

//render home page. User remains logged in until logged out
router.get("/", verifyAuthenticated, (req, res) => {
    res.locals.title = "Lustrous Lynxes";
    console.log(res.locals.user);
    res.render("account");
});

//Login Clicked
router.get("/login", (req, res) => {
    res.render("login");
});

//Submit Login form. Verification done first. If correct, call next and proceed with code.
router.post("/login", checkLoginCredentials, (req, res) => {
    res.render("account")
});

//Logout Clicked
router.get("/logout",removeToken, (req, res) => {
    res.clearCookie("authToken");
    res.locals.user = null;
    res.setToastMessage("Successfully logged out!");
    res.redirect("./login");
});

module.exports = router;