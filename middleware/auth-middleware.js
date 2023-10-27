const userDao = require("../modules/user-dao.js");
const { v4: uuid } = require("uuid");

//Check the user username and password match that of in DB.
async function checkLoginCredentials(req, res, next) {
    //Username and password submitted in form.
    const username = req.body.username;
    const password = req.body.password;

    //check if matching username and password in database.
    const user = await userDao.retrieveUserCredentials(username,password);
    //If user allow the user to login and set locals 
    if (user){
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
    }else{
        //If no user, redirect to login page and set message to not found.
        res.setToastMessage("Username/Password not found")
        res.redirect("./login")
    }
}

async function addUserToLocals(req, res, next) {
    //Use cookie to find current user. Add to locals for handlebars information.
    //This code is in app.js and will run every time application is run e.g. route handler.
    const user = await userDao.retrieveUserByToken(req.cookies.authToken);
    res.locals.user = user;
    next();
}

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
async function removeToken(req, res, next){
    //Remove token from Database upon logging out.
    userDao.removeUserToken(res.locals.user);
    next();
}

async function checkIfLoggedIn(req, res, next){
    if (res.locals.user){
        res.redirect("./")
    }else{
        next();
    }
}


module.exports = {
    checkLoginCredentials,
    verifyAuthenticated,
    addUserToLocals,
    removeToken,
    checkIfLoggedIn
}