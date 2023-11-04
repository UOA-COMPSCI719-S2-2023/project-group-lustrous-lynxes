const express = require("express");
const router = express.Router();

const authUser = require("../middleware/auth-middleware.js");
const newUser = require("../middleware/new-account-middleware.js");
const allArticles = require("../middleware/articles-middleware.js");
const userDao = require("../modules/users-dao.js");
const avatarDao = require("../modules/avatars-dao.js");
const commentDao = require("../modules/comments-dao.js");
const articleDao = require("../modules/articles-dao.js");
const upload = require("../middleware/multer-uploader.js");
const fs = require("fs");



//Render home/account page if user is logged in. Check using middleware.
router.get("/", authUser.verifyAuthenticated, async (req, res) => {
    res.locals.title = "Lustrous Lynxes";
    //Set the average rating for all articles into DB.
    res.locals.rating = await allArticles.setAllArticleAverageRating();
    //Get allCardDetails in order of rating.
    res.locals.artCard =  await allArticles.userCardDetails(res.locals.user.id);
    //Fix to get request
    res.locals.visitUser = res.locals.user;
    
    res.render("account");
});

//Render user's own user page
router.get("/profile", authUser.verifyAuthenticated, (req, res) => {
    res.redirect(`/user?id=${res.locals.user.id}`);
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
router.post("/login", authUser.checkLoginCredentials, async (req, res) => {
    res.redirect("/profile");
});

//Route handler to visit particular user's profile by ID in query parameter
router.get("/user", async (req, res) => {
    //Get user object
    const visitUserId = req.query.id;
    const visitUser = await userDao.getUserById(visitUserId);
    
    //Why do we need to do this???
    //Set the average rating for all articles into DB.
    res.locals.rating = await allArticles.setAllArticleAverageRating();

    //If user is not found, displays "user not found" message
    if (visitUser == undefined) {
        res.render("account", {
            noUser: true
        });
    } else {
        //Save required information to res.locals
        res.locals.title = `${visitUser.username}'s Articles`;
        res.locals.artCard =  await allArticles.userCardDetails(visitUserId);
        res.locals.visitUser = visitUser;
        
        //Renders account page
        if (visitUserId == res.locals.user.id) {
            res.render("account", {
                myAccount: true
            });
        } else {
            res.render("account");
        }
    }
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

    //Creating new article object
    const newArticle = {
        userId: res.locals.user.id,
        content: articleContent,
        title: articleTitle,
        imgFileName: "default-image.jpg",
        imgCaption: "No image available"
    };

    //Checks if user uploaded an image
    if (imageInfo) {
        //Renames and moves image file
        const oldFileName = imageInfo.path;
        const newFileName = `public/images/${imageInfo.originalname}`;
        fs.renameSync(oldFileName, newFileName);

        //Stores given image & caption
        newArticle.imgFileName = imageInfo.originalname;
        newArticle.imgCaption = imageCaption;
    }

    //Adding new article to database
    const newArticleId = await articleDao.addNewArticle(newArticle);

    //Redirects to full article
    res.redirect(`/full-article?id=${newArticleId}`);
});

//Renders edit-article page which allows user to edit their own article
//Later we will use query parameters to specify which article to edit
//e.g. edit-article?id=5 using the articleId
router.get("/edit-article", authUser.verifyAuthenticated, async (req, res) => {
    //Retrieves article object with corresponding ID from database
    const articleId = req.query.id;
    const article = await articleDao.getArticleById(articleId);

    //Checks whether the article exists
    if (article == undefined) {
        //Informs user that the article does not exist
        res.render("edit-article", {
            noArticle: true
        });
    } else {
        //Checks whether the user currently logged in is the author of the article
        if (article.authorId == res.locals.user.id) {
            //Stores whether or not the article is using the default image
            const hasImage = (article.imgFileName != "default-image.jpg");

            //Renders page with all necessary info
            res.render("edit-article", {
                includeTinyMCEScripts: true,
                hasImage: hasImage,
                article: article
            });
        } else {
            //Informs user that they cannot edit this article
            res.render("edit-article", {
                wrongAuthor: true
            });
        }
    }
});

//Processes form for editing an existing article
router.post("/edit-article", upload.single("imageFile"), async (req, res) => {
    //Getting user input from form
    const articleId = req.body.articleId;
    const articleTitle = req.body.articleTitle;
    const articleContent = req.body.articleContent;
    const imageInfo = req.file;
    const imageCaption = req.body.imageCaption;
    
    //Creating article object with updated values
    const article = {
        id: articleId,
        title: articleTitle,
        content: articleContent,
    };
    
    //Checks if user uploaded a new image
    if (imageInfo) {
        //Renames and moves image file
        const oldFileName = imageInfo.path;
        const newFileName = `public/images/${imageInfo.originalname}`;
        fs.renameSync(oldFileName, newFileName);
        
        //Adds image file name to article object
        article.imgFileName = imageInfo.originalname;
    }

    //Adds caption to article object if it was given
    if (imageCaption) {
        article.imgCaption = imageCaption;
    }    

    //Edits article in database
    await articleDao.editArticle(article);

    //Redirects to full article
    res.redirect(`/full-article?id=${articleId}`);
});

//Handles request to delete article
router.post("/delete-article/:id", async (req, res) => {
    const articleId = req.params.id;

    await articleDao.deleteArticle(articleId);

    res.setToastMessage("Article deleted successfully.");    
    res.redirect("/");
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
    const avatars = await avatarDao.retrieveAllIcons();
    const userAvatar = res.locals.user.avatar;
    let userAvatarName;
    for (let i=0; i < avatars.length; i++){
        if (userAvatar == avatars[i].fileName){
            userAvatarName = avatars[i].name;
            avatars.splice(i, 1);
        }
    }
    const defaultAvatar = {
        fileName: userAvatar,
        name: userAvatar
    }
    avatars.unshift(defaultAvatar);
    res.locals.avatars = avatars;
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
    //Set the average rating for all articles into DB.
    await allArticles.setAllArticleAverageRating(); 
    //Get allCardDetails in order of rating.
    res.locals.artCard =  await allArticles.allCardDetails();
  
    res.render("./articles");
});
//Add Rating to article
router.get("/rating/:score/:articleId",authUser.verifyAuthenticated,async(req,res)=>{
    const articleRating = {
        articleId: req.params.articleId,
        userId: res.locals.user.id,
        rating: req.params.score
    }
    await allArticles.addUserArticleRating(articleRating);
    await allArticles.addAverageRating(articleRating.articleId);
    const articleResult = await articleDao.getArticleById(articleRating.articleId);
    res.json(articleResult);
});

//read a full article - no login required
router.get("/full-article", async (req, res) => {
    //Ensure average rating is updated first.
    await allArticles.addAverageRating(req.query.id);
    const article = await articleDao.getArticleById(req.query.id);
    if (article) {

        res.locals.artFull =  await articleDao.viewFullArticle(req.query.id);

        //get star rating of articles
        if (res.locals.artFull.avRating){
            res.locals.starRating = allArticles.ratingStarsArticles(res.locals.artFull.avRating);
        }

        const allArticleComments = await commentDao.viewComments(req.query.id);
        //Add amount of likes to the comment then add back to res.locals.
        for(let i = 0; i < allArticleComments.length; i++){
            const likes = await commentDao.getCommentLikes(allArticleComments[i].id);
            allArticleComments[i].likes = likes;
            //Only run this if user is logged in.
            if (res.locals.user){
            const likeByUser = await commentDao.checkLikeByCurrentUser(res.locals.user.id, allArticleComments[i].id);
            //If the user has already liked the comment, then disable the ability to like that comment.
            if(likeByUser){
                allArticleComments[i].enableUserLike = false;
            }else{
                allArticleComments[i].enableUserLike = true;
            }
        }
        }
        //Sort Comments by likes.
        allArticleComments.sort((a,b) =>{
            return b.likes - a.likes;
        });
        res.locals.comFull = allArticleComments;
        res.render("./full-article");
    } else {
        res.render("./full-article", {
            noArticle: true
        })
    }
});

//add comment to article, and make sure comment not empty. Fetch Request done by client side.
//No longer require check for empty string as it is done client.
router.get("/comment/:articleId/:comment", authUser.verifyAuthenticated, async(req, res) => {
    const userId = res.locals.user.id;
    const articleId = req.params.articleId;
    //get comment and make sure it's not empty
    const content = req.params.comment

    //Add comment to database
    const commentData = {
        userId: userId,
        articleId: articleId,
        content: content
    };

    //Add comment to database.
    await commentDao.addComment(commentData);
    const getNewComment = await commentDao.getLatestCommentByUser(commentData);
    res.json(getNewComment);
});
//Add Like to Comment. Fetch Request made by client js.
router.get("/add-like/:commentId", async (req,res)=>{
    const like = {
        userId: res.locals.user.id,
        commentId: req.params.commentId
    };
    //Add Like.
    await commentDao.likeComment(like);
    //Get New Count of Likes.
    const commentLikes = await commentDao.getCommentLikes(like.commentId);
    //Return to client.
    res.json({likes: commentLikes});
});
//Remove Like from Comment. Fetch Request made by client js.
router.get("/remove-like/:commentId", async (req,res)=>{
    const like = {
        userId: res.locals.user.id,
        commentId: req.params.commentId
    };
    //Remove Like.
    await commentDao.removeCommentLike(like);
    //Get new count of likes for comment.
    const commentLikes = await commentDao.getCommentLikes(like.commentId);
    //Return to client.
    res.json({likes: commentLikes});
});

module.exports = router;