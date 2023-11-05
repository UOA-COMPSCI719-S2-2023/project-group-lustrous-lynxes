const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function retrieveAllIcons() {
    const db = await dbPromise;

    const icons = await db.all(SQL`select * from avatars`);

    return icons;
}

// Export functions.
module.exports = {
    retrieveAllIcons
};