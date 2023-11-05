const express = require("express");
const router = express.Router();

const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const allArticles = require("./helper-functions/articles.js");
const commentDao = require("../modules/comments-dao.js");
const articleDao = require("../modules/articles-dao.js");

//Redirects to all articles page
router.get("/", (req, res) => {
    res.redirect("/articles");
});

//Renders user's own user page
router.get("/profile", verifyAuthenticated, (req, res) => {
    res.redirect(`/user?id=${res.locals.user.id}`);
});

//Adds rating to article
router.get("/rating/:score/:articleId", verifyAuthenticated, async (req, res) => {
    const articleRating = {
        articleId: req.params.articleId,
        userId: res.locals.user.id,
        rating: req.params.score
    }
    await allArticles.addUserArticleRating(articleRating);
    await allArticles.addAverageRating(articleRating.articleId);
    const articleResult = await articleDao.getArticleById(articleRating.articleId);
    res.json(articleResult);
});

//Adds comment to article, and make sure comment not empty. Fetch Request done by client side.
//No longer requires check for empty string as it is done client.
router.get("/comment/:articleId/:comment", verifyAuthenticated, async (req, res) => {
    const userId = res.locals.user.id;
    const articleId = req.params.articleId;
    //get comment and make sure it's not empty
    const content = req.params.comment

    //Add comment to database
    const commentData = {
        userId: userId,
        articleId: articleId,
        content: content
    };

    //Add comment to database.
    await commentDao.addComment(commentData);
    const getNewComment = await commentDao.getLatestCommentByUser(commentData);
    res.json(getNewComment);
});

//Adds Like to Comment. Fetch Request made by client js.
router.get("/add-like/:commentId", async (req, res) => {
    const like = {
        userId: res.locals.user.id,
        commentId: req.params.commentId
    };
    //Add Like.
    await commentDao.likeComment(like);
    //Get New Count of Likes.
    const commentLikes = await commentDao.getCommentLikes(like.commentId);
    //Return to client.
    res.json({ likes: commentLikes });
});

//Removes Like from Comment. Fetch Request made by client js.
router.get("/remove-like/:commentId", async (req, res) => {
    const like = {
        userId: res.locals.user.id,
        commentId: req.params.commentId
    };
    //Remove Like.
    await commentDao.removeCommentLike(like);
    //Get new count of likes for comment.
    const commentLikes = await commentDao.getCommentLikes(like.commentId);
    //Return to client.
    res.json({ likes: commentLikes });
});

module.exports = router;