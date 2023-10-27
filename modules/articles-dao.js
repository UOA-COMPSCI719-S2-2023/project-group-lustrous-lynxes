const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

//view all articles based on search criteria
async function viewAllArticles(criteria) {
    const db = await dbPromise;

    const allArticles = await db.all(SQL`
     select * 
     from articles
     order by ${criteria}`);  

    return allArticles;
}

async function viewUserArticles(userId, criteria) {
    const db = await dbPromise;

    const allArticles = await db.all(SQL`
     select * 
     from articles a
     where a.authorId = ${userId}
     order by ${criteria}`);  

    return allArticles;
}

async function editArticles(articleId, content, title, filName, caption) {
    const db = await dbPromise;

    return await db.run(SQL`
     update articles 
     set content = ${content}, title = ${title}
     where id = ${articleId}`); 
     
    editImageArticles(filName, caption, articleId);     
}

async function addNewArticles(userId, content, title, filName, caption) {
    const db = await dbPromise;

    const artId =  await db.run(SQL`
     insert in articles (authorId, content, title)
     values(${userId}, ${content}), ${title}`);
     articles.id = artId.LastID;

    addNewImageArticles(filName, caption, artId.LastID);
}

async function deleteArticles(article) {
    const db = await dbPromise;

    return await db.run(SQL`
     delete from  articles 
     where id = ${article.id}`); 
     
    deleteImageArticles(article);     
}

async function addNewImageArticles(filName, caption, articleId) {
    const db = await dbPromise;

    return await db.run(SQL`
     insert in images (filName, caption, articleId)
     values(${filName}, ${caption}, ${articleId})`);     
}

async function editImageArticles(filName, caption, articleId) {
    const db = await dbPromise;

    return await db.run(SQL`
     update images 
     set filName = ${filName}, caption = ${caption}
     where articleId = ${articleId}`);    
}

async function deleteImageArticles(article) {
    const db = await dbPromise;

    return await db.run(SQL`
     delete from  images
     where articleId = ${article.id}`);     
}

module.exports = {
    viewAllArticles,
    viewUserArticles,
    addNewArticles,
    editArticles,
    deleteArticles,
    addNewImageArticles,
    editImageArticles,
    deleteImageArticles
};