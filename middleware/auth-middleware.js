const userDao = require("../modules/users-dao.js");
const {comparePasswords} = require("../routes/helper-functions/user.js");
const { v4: uuid } = require("uuid");
const {checkUsernameExists} = require("../routes/helper-functions/user.js")

//Set user to logged in if validation correct.
async function checkLoginCredentials(req, res, next) {
    const username = req.body.username;
    const passwordAttempt = req.body.password;

    const user = await userDao.retrieveUser(username);
    if (user){
        const encryptedCorrectPassword = user.password;
        correctPassword = await comparePasswords(passwordAttempt, encryptedCorrectPassword);

        if (correctPassword){

        const authToken = uuid();
        user.token = authToken;
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
        res.setToastMessage("Username not found");
        res.redirect("./login");
    }

}

async function addUserToLocals(req, res, next) {
    const user = await userDao.retrieveUserByToken(req.cookies.authToken);
    res.locals.user = user; 
    next();
}

function verifyAuthenticated(req, res, next) {
    if (res.locals.user) {
        next();
    }
    else {
        res.redirect("./login");
    }
}

async function checkFormInput(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    
    if (password == confirmPassword){
        if (await checkUsernameExists(username)){
            res.setToastMessage("Username already exists.");
            res.redirect("./create-account");
        }else{
            next();
        }
    }else{
        res.setToastMessage("Password does not match confirmation.");
        res.redirect("./create-account");
    }
}

module.exports = {
    checkLoginCredentials,
    verifyAuthenticated,
    addUserToLocals,
    checkFormInput
}