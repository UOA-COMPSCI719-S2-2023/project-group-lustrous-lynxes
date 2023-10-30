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

async function updateUserToken(user) {
    const db = await dbPromise;

    return await db.run(SQL`
        update users
        set token = ${user.token}
        where id = ${user.id}`);
}

async function retrieveUserByToken(token) {
    const db = await dbPromise;

    const testData = await db.get(SQL`
        select * from users
        where token = ${token}`);

    return testData;
}

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
//Get user password by ID
async function getUserById(userId){
    const db = await dbPromise;

    const password = await db.get(SQL`select * from users
    where id = ${userId}`);

    return password;

}
//Change User's Password
async function changePassword(userId, password){
    const db = await dbPromise;

    return await db.run(SQL`
        update users
        set password = ${password}
        where id = ${userId}`);
}

// Export functions.
module.exports = {
    retrieveUser,
    updateUserToken,
    retrieveUserByToken,
    removeUserToken,
    createUser,
    retrieveUserName,
    getUserById,
    changePassword
};
