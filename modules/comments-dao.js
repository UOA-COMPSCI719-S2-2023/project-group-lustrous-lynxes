const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function getLatestCommentByUser(commentJson) {
    const db = await dbPromise;

    const allComments =  await db.get(SQL`
     select u.fName, u.lName, c.content, u.avatar, c.id, a.id as articleId
     from comment c, articles a, users u 
     where a.id = ${commentJson.articleId}
     and c.userId = ${commentJson.userId}
     and a.id = c.articleId
     and c.userId = u.id
     order by c.id desc`);  
     
     return allComments;
}
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

async function likeComment(like) {
    const db = await dbPromise;

     return await db.run (SQL`
     insert into likes (userId, commentId) values
     (${like.userId}, ${like.commentId})`);
}

async function viewComments(articleId) {
    const db = await dbPromise;

    const allComments =  await db.all(SQL`
     select u.fName, u.lName, c.content, u.avatar, c.id, a.id as articleId, u.id as userId
     from comment c, articles a, users u 
     where ${articleId} = a.id
     and a.id = c.articleId
     and c.userId = u.id`);  
     
     return allComments;
}
async function getCommentLikes(commentId){
    const db = await dbPromise;
    
    const allLikesForComment = await db.all(SQL`
    select * from likes
    where commentId = ${commentId}`)

    let likesAmount = 0;
    for(let i= 0; i < allLikesForComment.length; i++){
        likesAmount++;
    }

    return likesAmount;
}

async function checkLikeByCurrentUser(userId, commentId){
    const db = await dbPromise;
    
    const likeByUser = await db.get(SQL`
    select * from likes
    where commentId = ${commentId}
    and userId = ${userId}`);

    return likeByUser;
}

async function removeCommentLike(like){
    const db = await dbPromise;

    return await db.run(SQL`
     delete from likes
     where userId = ${like.userId}
     and commentId = ${like.commentId}`);

}

module.exports = {
    rateArticles,
    allRatingArticle,
    addComment,
    likeComment,
    getUserRatingforArticle,
    viewComments,
    avRating,
    changeArticleRating,
    addArticleRating,
    getCommentLikes,
    checkLikeByCurrentUser,
    removeCommentLike,
    getLatestCommentByUser
};