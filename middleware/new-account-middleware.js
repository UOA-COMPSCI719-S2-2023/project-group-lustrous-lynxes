const userDao = require("../modules/user-dao.js");

//Check new-account form input is correct.
async function checkFormInput(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    
    //Password matches password
    if (password == confirmPassword){
        //Check if username exists in database.
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

//
async function checkUsernameExists(username){
    const userName = await userDao.retrieveUserName(username);
    if (userName == undefined){
        return false;
    }else{
        return true;
    }
}

module.exports = {
    checkFormInput,
    checkUsernameExists
}