const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function rateArticles(rate) {
    const db = await dbPromise;

    return await db.run(SQL`
     insert into rate (authorId, articleId, rating) values
     (${rate.authorId}, ${rate.articleId}, ${rate.rating})`);     
}

async function allRatingArticle(articleId) {
    const db = await dbPromise;

    const allRatings =  await db.all(SQL`
     select rating
     from rate
     where ${articleId} = articleId`);  
     
     return allRatings;
}
async function changeArticleRating(rate) {
    const db = await dbPromise;

    return await db.run (SQL`
     update rate
     set rating = ${rate.rating}
     where ${rate.articleId} = articleId
     and ${rate.userId} = userId`);     
}

async function addArticleRating(rate){
    const db = await dbPromise;

    return await db.run (SQL`
    insert into rate (userId, articleId, rating) values
    (${rate.userId}, ${rate.articleId}, ${rate.rating})`);

}

async function getUserRatingforArticle(rate) {
    const db = await dbPromise;

    const articleRatings =  await db.get(SQL`
     select rating
     from rate
     where ${rate.articleId} = articleId
     and ${rate.userId} = userId`);  
     
     return articleRatings;
}

async function avRating(aveRating, articleId) {
    const db = await dbPromise;

     return await db.run (SQL`
     update articles
     set avRating = ${aveRating}
     where id = ${articleId}`);
}

async function addComment(comment) {
    const db = await dbPromise;

    return await db.run(SQL`
     insert into comment (userId, articleId, content) values
     (${comment.userId}, ${comment.articleId}, ${comment.content})`);     
}

async function likeComment(likes) {
    const db = await dbPromise;

     return await db.run (SQL`
     insert into likes (userId, commentId, liking) values
     (${likes.userId}, ${likes.commentId}, 1)`);
}

async function viewComments(articleId) {
    const db = await dbPromise;

    const allComments =  await db.all(SQL`
     select u.fName, u.lName, c.content, u.avatar
     from comment c, articles a, users u 
     where ${articleId} = a.id
     and a.id = c.articleId
     and c.userId = u.id`);  
     
     return allComments;
}

//async function orderComments(article) {
    //const db = await dbPromise;

    //const allComments = await db.all(SQL`
     // c.content, l.liking, u.fName, u.lName
     //from comment c, articles a, likes l, users u  
     //where a.id = ${article.id}
     ////and a.id = c.articleId
     //and c.id = l.commentId
     //and c.userId = u.id
     //order by ${l.liking}`);  

    ////return allComments;
//}

module.exports = {
    rateArticles,
    allRatingArticle,
    addComment,
    likeComment,
    getUserRatingforArticle,
    viewComments,
    avRating,
    changeArticleRating,
    addArticleRating
};