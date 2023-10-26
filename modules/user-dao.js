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

// Export functions.
module.exports = {
    retrieveUserCredentials,
    updateUserToken,
    retrieveUserByToken
};
