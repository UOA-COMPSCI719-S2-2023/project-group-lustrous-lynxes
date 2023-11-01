const express = require("express");
const router = express.Router();

const authUser = require("../middleware/auth-middleware.js");
const newUser = require("../middleware/new-account-middleware.js");
const allArticles = require("../middleware/articles-middleware.js");
const userDao = require("../modules/users-dao.js");
const avatarDao = require("../modules/avatars-dao.js");
const articleDao = require("../modules/articles-dao.js");
const commentDao = require("../modules/comments-dao.js");
const upload = require("../middleware/multer-uploader.js");
const fs = require("fs");

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

//Processes form for adding a new article
router.post("/add-article", upload.single("imageFile"), async (req, res) => {
    //Getting user input from form
    const articleTitle = req.body.articleTitle;
    const articleContent = req.body.articleContent;
    const imageInfo = req.file;
    const imageCaption = req.body.imageCaption;

    //Renaming and moving image file
    const oldFileName = imageInfo.path;
    const newFileName = `public/images/${imageInfo.originalname}`;
    fs.renameSync(oldFileName, newFileName);

    //Creating new article object
    const newArticle = {
        userId: res.locals.user.id,
        content: articleContent,
        title: articleTitle
    };

    //Creating new image object
    const newImage = {
        filName: imageInfo.originalname,
        caption: imageCaption
    };

    //Adding new article & image to database
    await articleDao.addNewArticles(newArticle, newImage);

    //Redirect to all articles - might change later
    //Probably makes sense to redirect to user's page of their own articles
    res.redirect("/articles");
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
        dateOfBirth: req.body.dateOfBirth,
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
    res.redirect("./login");
});

//Request made to change user's settings. Need to verify login first.
router.get("/edit-account",authUser.verifyAuthenticated, async (req,res)=>{
    res.locals.avatars = await avatarDao.retrieveAllIcons();
    res.render("edit-account");
});

//Changes made to user settings (everything but password).
router.post("/edit-account", async (req,res) =>{
    //Get current ID and username for user.
    userId = res.locals.user.id;
    currentUsername = res.locals.user.username;

    //New settings inputted
    const newUserSettings = {
        username: req.body.username,
        fName: req.body.fName,
        lName: req.body.lName,
        dateOfBirth: req.body.dateOfBirth,
        avatar: req.body.avatar,
        description: req.body.description 
    };

    //If Username is changed we will need to check if the username is already taken.
    if (currentUsername != newUserSettings.username){
        
        const usernameExists = await newUser.checkUsernameExists(newUserSettings.username);
        //If Username exists, do not process form in DB.
        if (usernameExists){
            res.setToastMessage("Username Taken");
            return res.redirect("./edit-account");
        }
    }
    //If the Username is the same as the original.
    await userDao.changeUserSettings(userId, newUserSettings);
    res.setToastMessage("User Details Changed");
    res.redirect("./");
});

//Changes made to password by user.
router.post("/edit-password", async (req,res) =>{
    const userId = res.locals.user.id;
    //Have User input current password as validation.
    const currentPasswordInput = req.body.password;
    //Check actual password in DB for user.
    const user = await userDao.getUserById(userId);
    //Check the input matches that of the User's actual password.
    const checkPasswordCorrect = await authUser.comparePasswords(currentPasswordInput, user.password);
    //New Password and confirmation of that password.
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;
    //Validation- confirm the new password and check user has inputted their current password.
    if (confirmPassword == newPassword && checkPasswordCorrect){
        //Encrypt and change password in DB.
        const encryptNewPassword = await newUser.encryptPassword(newPassword);
        await userDao.changePassword(userId, encryptNewPassword);
        res.setToastMessage("Password Changed");
        res.redirect("./logout");
    }else{
        res.setToastMessage("Password input not valid.");
        res.redirect("./edit-account");
    }
});
//Get Request to delete account. Remove the authentication token and set user to null.
//Then process the delete in Database and redirect to Login (NOT LOGOUT!!!).
router.get("/delete-account", async (req,res)=>{
    await userDao.deleteUser(res.locals.user.id);
    res.setToastMessage("Account Deleted");
    res.locals.user = null;
    res.clearCookie("authToken");
    res.redirect("./articles");
});

//go to articles page - no login required
router.get("/articles", async (req, res) => {    
    res.locals.artCard =  await allArticles.allCardDetails(); 
    res.render("./articles");
});

//read a full article - no login required
router.get("/full-article", async (req, res) => { 
    res.locals.artFull =  await articleDao.viewFullArticle(req.query.id);
    res.locals.comFull = await commentDao.viewComments(req.query.id);
    res.render("./full-article");
});

module.exports = router;