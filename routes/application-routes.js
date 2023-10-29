const express = require("express");
const router = express.Router();

const authUser = require("../middleware/auth-middleware.js");
const newUser = require("../middleware/new-account-middleware.js");
const userDao = require("../modules/users-dao.js");
const avatarDao = require("../modules/avatars-dao.js");

//Render home/account page if user is logged in. Check using middleware.
router.get("/", authUser.verifyAuthenticated, (req, res) => {
    res.locals.title = "Lustrous Lynxes";
    res.render("account");
});

//If a logged in user makes get request (URL) then redirect.
router.get("/login", (req, res) => {
    if (res.locals.user){
        res.redirect("./");
    }else{
    res.render("login");
    }
});

//Login Clicked
router.post("/login", authUser.checkLoginCredentials, (req, res) => {
    res.render("account")
});

//Renders add-article page which allows user to create an article
router.get("/add-article", authUser.verifyAuthenticated, (req, res) => {
    res.render("add-article", {
        includeTinyMCEScripts: true
    });
});

router.post("/add-article", (req, res) => {
    const article = req.body.article;

    //Change later - add article to database
    console.log(article);

    //Redirect to user's account with new article on it - might change later
    res.redirect("/account");
});

//Render form to create account
router.get("/create-account", async (req,res)=>{
    //Get all avatars for create account form.
    res.locals.avatars = await avatarDao.retrieveAllIcons();
    //Render create account form using avatars.
    res.render("create-account");
});

//If form values are valid proceed with putting in database and re-route to login.
router.post("/create-account", newUser.checkFormInput, async(req,res)=>{
    //Encrypt Password
    hashedPassword = await newUser.encryptPassword(req.body.password);
    //Create JSON for user from form values.
    const user = {
        username: req.body.username,
        password: hashedPassword,
        fName: req.body.fName,
        lName: req.body.lName,
        avatar: req.body.avatar,
        description: req.body.description 
    };
    //Add new user to Database.
    await userDao.createUser(user);
    res.setToastMessage("New Account Created Successfully");
    res.redirect("./login");
});

//Check against db if username is already taken.
router.get("/new/:input", async (req,res) =>{
    const userExists = await newUser.checkUsernameExists(req.params.input);
    res.json({ value: userExists }); 
});

//Logout Clicked
router.get("/logout",(req, res) => {
    userDao.removeUserToken(res.locals.user);
    res.clearCookie("authToken");
    res.locals.user = null;
    res.setToastMessage("Successfully logged out!");
    res.redirect("./login");
});

//Request made to change user's settings. Need to verify login first.
router.get("/edit-account",authUser.verifyAuthenticated, async (req,res)=>{
    res.locals.avatars = await avatarDao.retrieveAllIcons();
    res.render("edit-account");
});



module.exports = router;