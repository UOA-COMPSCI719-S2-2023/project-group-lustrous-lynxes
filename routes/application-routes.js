const express = require("express");
const router = express.Router();


const authUser = require("../middleware/auth-middleware.js");
const newUser = require("../middleware/new-account-middleware.js");

//render home page. User remains logged in until logged out
router.get("/", authUser.verifyAuthenticated, (req, res) => {
    res.locals.title = "Lustrous Lynxes";
    res.render("account");
});

//Login Clicked
router.get("/login",authUser.checkIfLoggedIn, (req, res) => {
    res.render("login");
});

//Submit Login form. Verification done first. If correct, call next and proceed with code.
router.post("/login", authUser.checkLoginCredentials, (req, res) => {
    res.render("account")
});

//Logout Clicked
router.get("/logout",authUser.removeToken, (req, res) => {
    res.clearCookie("authToken");
    res.locals.user = null;
    res.setToastMessage("Successfully logged out!");
    res.redirect("./login");
});

//Render form to create account
router.get("/create-account",(req,res)=>{
    res.render("create-account");
});

router.post("/create-account",newUser.checkFormInput,(req,res)=>{
    res.render("account-setup");
});

//check against db if username is already taken.
router.get("/new/:input",async (req,res) =>{
    const userExists = await newUser.checkUsernameExists(req.params.input);
    res.json({ value: userExists }); 
});

module.exports = router;