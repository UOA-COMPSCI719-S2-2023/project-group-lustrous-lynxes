const {retrieveUserName} = require("../modules/users-dao.js");

//Check form information is valid.
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

//Check if username already exists in DB.
async function checkUsernameExists(username){
    const userName = await retrieveUserName(username);
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