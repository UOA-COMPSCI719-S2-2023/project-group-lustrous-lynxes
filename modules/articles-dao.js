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

async function addNewArticle(article) {
    const db = await dbPromise;
    
    const result = await db.run(SQL`
        INSERT INTO articles (authorId, content, title, imgFileName, imgCaption) 
        VALUES (${article.userId}, ${article.content}, ${article.title}, ${article.imgFileName}, ${article.imgCaption})
    `);

    return result.lastID;
}

async function editArticle(article) {
    const db = await dbPromise;

    //Updates title & content as these are always given in the article object
    await db.run(SQL`
        UPDATE articles
        SET content = ${article.content}, title = ${article.title}
        WHERE id = ${article.id}
    `);

    //Only updates image file name if given
    if ("imgFileName" in article) {
        await db.run(SQL`
            UPDATE articles
            SET imgFileName = ${article.imgFileName}
            WHERE id = ${article.id}
        `);
    }

    //Only updates image caption if given
    if ("imgCaption" in article) {
        await db.run(SQL`
            UPDATE articles
            SET imgCaption = ${article.imgCaption}
            WHERE id = ${article.id}
        `);
    }
}
//Should just be delete from...not delete * from.
async function deleteArticle(article) {
    const db = await dbPromise;

    return await db.run(SQL`
     delete from articles 
     where id = ${article.id}`);
}

//Order by Average Rating for when we display articles.
async function viewArticlesCards() {
    const db = await dbPromise;

    const artCards = await db.all(SQL`
     select a.imgFileName, a.title, a.content, a.imgCaption, u.fName, u.lName, a.id
     from  articles a, users u 
     where a.authorId = u.id
     order by a.avRating desc`);
    return artCards;
}

//Order by Average Rating for when we display  user's articles.
async function userArticlesCards(userId) {
    const db = await dbPromise;

    const artCards = await db.all(SQL`
     select a.imgFileName, a.title, a.content, a.id, a.imgCaption 
     from  articles a, users u 
     where u.id = ${userId}
     and a.authorId = u.id
     order by a.avRating desc`);

    return artCards;
}

async function viewFullArticle(givenId) {
    const db = await dbPromise;

    const artFull = await db.get(SQL`
     select a.id, a.imgFileName, a.imgCaption, a.title, a.content, u.fName, u.lName 
     from articles a, users u 
     where a.id = ${givenId}
     and a.authorId = u.id`);

    return artFull;
}

//Get article by ID
async function getArticleById(articleId) {
    const db = await dbPromise;
    const article = await db.get(SQL`select * from articles where id = ${articleId}`);
    return article;
}

module.exports = {
    viewAllArticles,
    viewUserArticles,
    addNewArticle,
    editArticle,
    deleteArticle,
    viewArticlesCards,
    userArticlesCards,
    viewFullArticle,
    getArticleById
};