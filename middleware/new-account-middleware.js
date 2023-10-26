const userDao = require("../modules/user-dao.js");

async function checkNewUserInput(req, res, next) {
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