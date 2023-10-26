const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

//Get all images for new-account to choose between.
async function retrieveAllIcons(){
    const db = await dbPromise;

    const icons = await db.all(SQL`select filName from avatars`);

    return icons;
}

// Export functions.
module.exports = {
    retrieveAllIcons
};