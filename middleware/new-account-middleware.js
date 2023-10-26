const userDao = require("../modules/user-dao.js");

async function checkNewUserInput(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (password == confirmPassword){
        if (!checkUsernameExists(username)){
            next();
        }else{
            next();
        }
    }else{
        console.log("password does not match");
        next();
    }
}

async function checkUsernameExists(username){
    const userName = await userDao.retrieveUserName(username);
    if (userName == undefined){
        return false;
    }else{
        return true;
    }
}

module.exports = {
    checkNewUserInput,
    checkUsernameExists
}