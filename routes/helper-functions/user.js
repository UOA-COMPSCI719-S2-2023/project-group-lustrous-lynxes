const bcrypt = require('bcrypt');
const { retrieveUserName } = require("../../modules/users-dao");

const saltRounds = 10;

async function checkUsernameExists(username) {
  const userName = await retrieveUserName(username);
  if (userName == undefined) {
    return false;
  } else {
    return true;
  }
}

async function encryptPassword(password) {
  try {
    const hash = bcrypt.hashSync(password, saltRounds);
    return hash;
  } catch (err) {
    //Not yet sure if we need this. Will change later.
    console.error('Error hashing password:', err);
    return null;
  }
}

async function comparePasswords(passwordAttempt, encryptedCorrectPassword) {
  return bcrypt.compareSync(passwordAttempt, encryptedCorrectPassword);
}

module.exports = {
  checkUsernameExists,
  encryptPassword,
  comparePasswords
}