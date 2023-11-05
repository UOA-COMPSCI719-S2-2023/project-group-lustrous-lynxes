const express = require("express");
const router = express.Router();

const { checkLoginCredentials, verifyAuthenticated, checkFormInput } = require("../middleware/auth-middleware.js");
const newUser = require("./helper-functions/user.js");
const userDao = require("../modules/users-dao.js");
const avatarDao = require("../modules/avatars-dao.js");

//Renders login page
router.get("/login", (req, res) => {
    if (res.locals.user) {
        //Redirects to home if user is already logged in
        res.redirect("/");
    } else {
        res.locals.title = "Login | Lustrous Lynxes";
        res.render("login");
    }
});

//Redirects to profile if user successfully logs in
router.post("/login", checkLoginCredentials, async (req, res) => {
    res.redirect("/profile");
});

//Renders form to create an account
router.get("/create-account", async (req, res) => {
    //Get all avatars for create account form.
    res.locals.avatars = await avatarDao.retrieveAllIcons();
    res.locals.title = "Create new account | Lustrous Lynxes";

    //Render create account form using avatars.
    res.render("create-account");
});

//Processes form for creating account and redirects to login
router.post("/create-account", checkFormInput, async (req, res) => {
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
    res.redirect("/login");
});

//Checks against db if username is already taken
router.get("/new/:input", async (req, res) => {
    const userExists = await newUser.checkUsernameExists(req.params.input);
    res.json({ value: userExists });
});

//Logs out user and redirects back to login
router.get("/logout", (req, res) => {
    userDao.removeUserToken(res.locals.user);
    res.clearCookie("authToken");
    res.locals.user = null;
    res.redirect("/login");
});

//Renders edit-account page, allowing user to edit their own profile
router.get("/edit-account", verifyAuthenticated, async (req, res) => {
    const avatars = await avatarDao.retrieveAllIcons();
    const userAvatar = res.locals.user.avatar;
    let userAvatarName;
    for (let i = 0; i < avatars.length; i++) {
        if (userAvatar == avatars[i].fileName) {
            userAvatarName = avatars[i].name;
            avatars.splice(i, 1);
        }
    }
    const defaultAvatar = {
        fileName: userAvatar,
        name: userAvatarName
    }
    avatars.unshift(defaultAvatar);

    res.locals.avatars = avatars;
    res.locals.title = "Edit account | Lustrous Lynxes";

    res.render("edit-account");
});

//Processes form for editing user profile
router.post("/edit-account", async (req, res) => {
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
    if (currentUsername != newUserSettings.username) {

        const usernameExists = await newUser.checkUsernameExists(newUserSettings.username);
        //If Username exists, do not process form in DB.
        if (usernameExists) {
            res.setToastMessage("Username Taken");
            return res.redirect("/edit-account");
        }
    }
    //If the Username is the same as the original.
    await userDao.changeUserSettings(userId, newUserSettings);
    res.setToastMessage("User Details Changed");
    res.redirect("/profile");
});

//Processes form for editing user password
router.post("/edit-password", async (req, res) => {
    const userId = res.locals.user.id;
    const currentPasswordInput = req.body.password;
    const user = await userDao.getUserById(userId);
    const checkPasswordCorrect = await newUser.comparePasswords(currentPasswordInput, user.password);
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;

    if (confirmPassword == newPassword && checkPasswordCorrect) {
        const encryptNewPassword = await newUser.encryptPassword(newPassword);
        await userDao.changePassword(userId, encryptNewPassword);
        res.setToastMessage("Password Changed");
        res.redirect("/logout");
    } else {
        res.setToastMessage("Password input not valid.");
        res.redirect("/edit-account");
    }
});

//Deletes account and redirects to home
router.post("/delete-account", async (req, res) => {
    await userDao.deleteUser(res.locals.user.id);
    res.setToastMessage("Account Deleted");
    res.locals.user = null;
    res.clearCookie("authToken");
    res.redirect("/");
});

module.exports = router;