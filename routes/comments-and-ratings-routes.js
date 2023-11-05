const express = require("express");
const router = express.Router();

const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const allArticles = require("./helper-functions/articles.js");
const articleDao = require("../modules/articles-dao.js");
const commentDao = require("../modules/comments-dao.js");

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

//Adds comment to article, and makes sure comment is not empty. Fetch request done by client side.
router.get("/comment/:articleId/:comment", verifyAuthenticated, async (req, res) => {
    const userId = res.locals.user.id;
    const articleId = req.params.articleId;
    const content = req.params.comment

    const commentData = {
        userId: userId,
        articleId: articleId,
        content: content
    };

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
    await commentDao.likeComment(like);
    const commentLikes = await commentDao.getCommentLikes(like.commentId);
    res.json({ likes: commentLikes });
});

//Removes Like from Comment. Fetch Request made by client js.
router.get("/remove-like/:commentId", async (req, res) => {
    const like = {
        userId: res.locals.user.id,
        commentId: req.params.commentId
    };
    await commentDao.removeCommentLike(like);
    const commentLikes = await commentDao.getCommentLikes(like.commentId);
    res.json({ likes: commentLikes });
});

//Remove via server for existing comments.
router.get("/remove-comment/:commentId/:articleId", async (req, res) => {
    const commentId = req.params.commentId;
    const articleId = req.params.articleId;
    await commentDao.removeComment(commentId);
    res.redirect(`/full-article?id=${articleId}`);
});

//Delete Via client for new added comments.
router.get("/delete-comment/:commentId", async (req, res) => {
    await commentDao.removeComment(req.params.commentId);
    res.end();
});

module.exports = router;