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
    
    const result = await db.run(SQL`
        insert into articles (authorId, content, title) 
        values(${article.userId}, ${article.content}, ${article.title})
    `);
    
    //articles.id = artId.lastID;
    //Not sure what the above line is for @mary?? - maybe delete later
    await addNewImageArticles(image, result.lastID);
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

async function viewArticlesCards() {
    const db = await dbPromise;

    const artCards = await db.all(SQL`
     select i.filName, a.title, substring(a.content, 0, 400) as short, u.fName, u.lName, a.id 
     from images i, articles a, users u 
     where i.articleId = a.id
     and a.authorId = u.id`);  
    return artCards;
}

async function viewFullArticle(givenId) {
    const db = await dbPromise;

    const artFull = await db.get(SQL`
     select i.filName, a.title, a.content, u.fName, u.lName 
     from images i, articles a, users u 
     where a.id = ${givenId}
     and i.articleId = a.id
     and a.authorId = u.id`);  
    
    return artFull;
}

//Get article by ID
async function getArticleById(articleId){
    const db = await dbPromise;
    const article = await db.get(SQL`select * from articles where id = ${articleId}`);
    return article;
}

module.exports = {
    viewAllArticles,
    viewUserArticles,
    addNewArticles,
    editArticles,
    deleteArticles,
    addNewImageArticles,
    editImageArticles,
    viewArticlesCards,
    deleteImageArticles,
    viewFullArticle,
    getArticleById
};