const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function rateArticles(rate) {
    const db = await dbPromise;

    return await db.run(SQL`
     insert into rate (authorId, articleId, rating) values
     (${rate.authorId}, ${rate.articleId}, ${rate.rating})`);     
}

async function allRatingArticle(article) {
    const db = await dbPromise;

    const allRatings =  await db.all(SQL`
     select *
     from rate
     where ${article.articleId} = rate.articleId`);  
     
     return allRatings;
}

async function avRating(aveRating, rate) {
    const db = await dbPromise;

     return await db.run (SQL`
     update articles
     set avRating = ${aveRating}
     where id = ${rate.articleId}`);
}

async function addComment(comment) {
    const db = await dbPromise;

    return await db.run(SQL`
     insert into comment (authorId, articleId, content) values
     (${comment.authorId}, ${comment.articleId}, ${comment.content})`);     
}

async function likeComment(comment) {
    const db = await dbPromise;

     return await db.run (SQL`
     update comment
     set likes = likes + 1
     where id = ${comment.id}`);
}

async function orderComments(comment) {
    const db = await dbPromise;

    const allComments = await db.all(SQL`
     select * 
     from comments
     where id = ${comment.id}
     order by ${comment.likes}`);  

    return allComments;
}

module.exports = {
    rateArticles,
    allRatingArticle,
    addComment,
    likeComment,
    orderComments,
    avRating
};