const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");
const articlesDao = require("./articles-dao.js")


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
    insert into users (username,fName, lName, password, dateOfBirth, description, avatar) values
    (${user.username}, ${user.fName}, ${user.lName}, ${user.password}, ${user.dateOfBirth}, ${user.description}, ${user.avatar})`);  
}
//Get user password by ID
async function getUserById(userId){
    const db = await dbPromise;

    const password = await db.get(SQL`select * from users where id = ${userId}`);

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
//Change User's details
async function changeUserSettings(userId, user){
    const db = await dbPromise;
    
    return await db.run(SQL`
        update users
        set username = ${user.username},
        fName = ${user.fName},
        lName = ${user.lName},
        dateOfBirth = ${user.dateOfBirth},
        avatar = ${user.avatar},
        description = ${user.description}
        where id = ${userId}`);
}

//Critical that this is done in the correct order.
async function deleteUser(userId){
    const db = await dbPromise;
    console.log("Deleting user");

    return await db.run(SQL`
     delete from users
     where id = ${userId}`);
}
//Need to get every article ID associate with a given user.
//Then delete by using a For Each and the articlesDao functions.
async function deleteUserArticles(userId){
    const db = await dbPromise;
    console.log(userId)

    return await db.run(SQL`
    delete from users
    where id = ${userId}`);
}
//Correct- Tested in SQL
async function deleteUserComments(userId){
    const db = await dbPromise;

    await deleteUserRatings(userId);

    return await db.run(SQL`
     delete from comment
     where userId = ${userId}`);
}
//Correct- Tested in SQL
async function deleteUserRatings(userId){
    const db = await dbPromise;

    await deleteUserLikes(userId);

    return await db.run(SQL`
     delete from rate
     where userId = ${userId}`);
}
//Correct- Tested in SQL
async function deleteUserLikes(userId){
    const db = await dbPromise;

    return await db.run(SQL`
     delete from likes
     where userId = ${userId}`);
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
    changePassword,
    changeUserSettings,
    deleteUser,
    deleteUserArticles
};
