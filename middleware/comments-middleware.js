const commentDao = require("../modules/comments-dao.js");

async function getCommentData(user, articleId){
    const allArticleComments = await commentDao.viewComments(articleId);
        //Add amount of likes to the comment then add back to res.locals.
        for(let i = 0; i < allArticleComments.length; i++){
            const likes = await commentDao.getCommentLikes(allArticleComments[i].id);
            allArticleComments[i].likes = likes;
            //Only run this if user is logged in.
            if (user){
            const likeByUser = await commentDao.checkLikeByCurrentUser(user.id, allArticleComments[i].id);
            //If the user has already liked the comment, then disable the ability to like that comment.
            if(likeByUser){
                allArticleComments[i].enableUserLike = false;
            }else{
                allArticleComments[i].enableUserLike = true;
            }
        }
        }
        return allArticleComments;
}
module.exports = {
    getCommentData
};