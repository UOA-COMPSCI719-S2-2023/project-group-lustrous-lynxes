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
     from articles 
     where authorId = ${userId}
     order by ${criteria}`);  

    return allArticles;
}

async function editArticles(article, image) {
    const db = await dbPromise;

    return await db.run(SQL`
     update articles 
     set content = ${article.content}, title = ${article.title}
     where id = ${article.articleId}`); 
     
    editImageArticles(image);     
}

async function addNewArticles(article, image) {
    const db = await dbPromise;

    const artId =  await db.run(SQL`
     insert into articles (authorId, content, title)
     values(${article.userId}, ${article.content}), ${article.title}`);
     articles.id = artId.LastID;

    addNewImageArticles(image, artId.LastID);
}

async function deleteArticles(article) {
    const db = await dbPromise;

    deleteImageArticles(article); 

    return await db.run(SQL`
     delete from  articles 
     where id = ${article.id}`);       
}

async function addNewImageArticles(image, articleId) {
    const db = await dbPromise;

    return await db.run(SQL`
     insert into images (filName, caption, articleId)
     values(${image.filName}, ${image.caption}, ${articleId})`);     
}

async function editImageArticles(image) {
    const db = await dbPromise;

    return await db.run(SQL`
     update images 
     set filName = ${image.filName}, caption = ${image.caption}
     where articleId = ${image.articleId}`);    
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