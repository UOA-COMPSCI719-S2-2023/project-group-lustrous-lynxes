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
router.get("/create-account", async (req,res)=>{
    //Get all avatars for create account form.
    res.locals.avatars = await newUser.avatarsArray();
    //Render create account form using avatars.
    res.render("create-account");
});

//If new account is valid proceed with putting in DB and re-route to login.
router.post("/create-account", newUser.checkFormInput, async(req,res)=>{
    const user = {
        username: req.body.username,
        password: req.body.password,
        fName: req.body.fName,
        lName: req.body.lName,
        avatar: req.body.avatar,
        description: req.body.description
    };
    await newUser.createUserInDb(user);
    res.setToastMessage("New Account Created Successfully");
    res.redirect("./login");
});

//check against db if username is already taken.
router.get("/new/:input", async (req,res) =>{
    const userExists = await newUser.checkUsernameExists(req.params.input);
    res.json({ value: userExists }); 
});

module.exports = router;