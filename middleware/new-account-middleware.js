const bcrypt = require('bcrypt');
const {retrieveUserName} = require("../modules/users-dao.js");

//Salt Rounds- Complexity of protection. The higher the intger the more encrypted.
//However this comes at the cost of performance. For the project 10 will be fine.
const saltRounds = 10;

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

async function encryptPassword(password) {
    try {
      const hash = bcrypt.hashSync(password, saltRounds);
      return hash;
    } catch (err) {
      //Not yet sure how to handle failure to encrypt password.
      console.error('Error hashing password:', err);
      return null;
    }
  }

module.exports = {
    checkFormInput,
    checkUsernameExists,
    encryptPassword
}