const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");


//Check credentials match upon login.
async function retrieveUserCredentials(username, password) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from users
        where username = ${username} and password = ${password}`);

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

async function createUser(user) {
    const db = await dbPromise;

    return await db.run(SQL`
    insert into users (username,fName, lName, password, description, avatar) values
    (${user.username}, ${user.fName}, ${user.lName}, ${user.password}, ${user.description}, ${user.avatar})`);  
}

async function editUser(user) {
    const db = await dbPromise;

    return await db.run(SQL`
        update users
        set fName = ${user.fName}, lName = ${user.lName}, password = ${user.password}, description = ${user.description}, avatar = ${user.avatar}
        where id = ${user.id}`);
}

// Export functions.
module.exports = {
    retrieveUserCredentials,
    updateUserToken,
    retrieveUserByToken,
    removeUserToken,
    createUser,
    editUser
};
