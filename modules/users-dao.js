const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");


//Check credentials match upon login.
async function retrieveUser(username) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from users
        where username = ${username}`);

    return user;
}
//User logs in, add a token to check against to know if they are still logged in.
async function updateUserToken(user) {
    const db = await dbPromise;

    return await db.run(SQL`
        update users
        set token = ${user.token}
        where id = ${user.id}`);
}

//Check if user is still logged in.
async function retrieveUserByToken(token) {
    const db = await dbPromise;

    const testData = await db.get(SQL`
        select * from users
        where token = ${token}`);

    return testData;
}
//Remove token as user has now logged out.
async function removeUserToken(user) {
    const db = await dbPromise;

    return await db.run(SQL`
        update users
        set token = null
        where id = ${user.id}`);
}
//Check if username already exists for new account.
async function retrieveUserName(username){
    const db = await dbPromise;

    const user = await db.get(SQL`select username from users
    where username = ${username}`);

    return user;
}
//Create user using user JSON
async function createUser(user) {
    const db = await dbPromise;

    return await db.run(SQL`
    insert into users (username,fName, lName, password, description, avatar) values
    (${user.username}, ${user.fName}, ${user.lName}, ${user.password}, ${user.description}, ${user.avatar})`);  
}

// Export functions.
module.exports = {
    retrieveUser,
    updateUserToken,
    retrieveUserByToken,
    removeUserToken,
    retrieveUserName,
    createUser
};
