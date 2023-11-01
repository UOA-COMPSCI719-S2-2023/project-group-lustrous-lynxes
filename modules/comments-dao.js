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
    viewComments,
    //orderComments,
    avRating
};