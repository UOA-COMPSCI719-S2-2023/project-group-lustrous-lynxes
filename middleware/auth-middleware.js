const userDao = require("../modules/users-dao.js");
const { v4: uuid } = require("uuid");
const bcrypt = require('bcrypt');

//Check the user username and password match that of in DB.
async function checkLoginCredentials(req, res, next) {
    //Username and password submitted in form.
    const username = req.body.username;
    const passwordAttempt = req.body.password;

    //check if matching username and return password in database.
    const user = await userDao.retrieveUser(username);
    const encryptedCorrectPassword = user.password;
    //If user exists proceed with validation.
    if (user){
        correctPassword = await comparePasswords(passwordAttempt, encryptedCorrectPassword);

        if (correctPassword){
        //create authentication token
        const authToken = uuid();
        //add token to user object for later reference
        user.token = authToken;
        //add token to database then cookie
        await userDao.updateUserToken(user);
        res.cookie("authToken", authToken);
        res.locals.user = user;
        res.setToastMessage(`Hello ${res.locals.user.username}`);
        next();
        }
        else{
            res.setToastMessage("Password Incorrect");
            res.redirect("./login");  
        }
    }else{
        //If no user, redirect to login page and set message to not found.
        res.setToastMessage("Username not found");
        res.redirect("./login");
    }

}

//Keep user details no matter where the user navigates to.
async function addUserToLocals(req, res, next) {
    //Use cookie to find current user. Add to locals for handlebars information.
    //This code is in app.js and will run every time application is run e.g. route handler.
    const user = await userDao.retrieveUserByToken(req.cookies.authToken);
    res.locals.user = user;
    next();
}

//Check user is authenticatied before rendering account page.
function verifyAuthenticated(req, res, next) {
    //If res.locals user exists verfication accepted call next
    if (res.locals.user) {
        next();
    }
    //If does not exists redirect to login page.
    else {
        res.redirect("./login");
    }
}

async function comparePasswords(passwordAttempt, encryptedCorrectPassword){
    return bcrypt.compareSync(passwordAttempt, encryptedCorrectPassword);
}

module.exports = {
    checkLoginCredentials,
    verifyAuthenticated,
    addUserToLocals
}