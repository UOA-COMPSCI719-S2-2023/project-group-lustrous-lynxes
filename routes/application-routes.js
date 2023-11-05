const express = require("express");
const router = express.Router();

const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const allArticles = require("./helper-functions/articles.js");
const userDao = require("../modules/users-dao.js");
const commentDao = require("../modules/comments-dao.js");
const articleDao = require("../modules/articles-dao.js");

//Redirects to all articles page
router.get("/", (req, res) => {
    res.redirect("/articles");
});

//Renders all articles page - no login required
router.get("/articles", async (req, res) => {
    //Set the average rating for all articles into DB.
    await allArticles.setAllArticleAverageRating();

    //Save necessary res.locals
    res.locals.title = "All Articles | Lustrous Lynxes";
    res.locals.artCard = await allArticles.allCardDetails();

    res.render("articles");
});

//Renders user's own user page
router.get("/profile", verifyAuthenticated, (req, res) => {
    res.redirect(`/user?id=${res.locals.user.id}`);
});

//Renders particular user's profile by ID in query parameter
router.get("/user", async (req, res) => {
    //Get user object
    const visitUserId = req.query.id;
    const visitUser = await userDao.getUserById(visitUserId);

    //If given user exists, renders user's profile
    if (visitUser) {
        //Save required information to res.locals
        res.locals.visitUser = visitUser;
        res.locals.title = `${visitUser.username}'s articles | Lustrous Lynxes`;
        res.locals.artCard = await allArticles.userCardDetails(visitUserId);
        res.locals.rating = await allArticles.setAllArticleAverageRating();

        //Checks whether the user we are visiting is the logged-in user
        let myAccount = false;
        if (res.locals.user) {
            if (visitUserId == res.locals.user.id) {
                myAccount = true;
            }
        }

        //Renders account page
        res.render("account", { myAccount });
    } else {
        //Displays error message
        res.locals.title = "Error | Lustrous Lynxes";
        res.render("account", {
            noUser: true
        });
    }
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

//Renders a full article page, specified by article ID in query parameter
router.get("/full-article", async (req, res) => {
    //Ensure average rating is updated first.
    await allArticles.addAverageRating(req.query.id);
    const article = await articleDao.getArticleById(req.query.id);
    if (article) {
        //Get full article info
        const fullArticleInfo = await articleDao.viewFullArticle(req.query.id);

        //Save info to res.locals
        res.locals.authorId = article.authorId;
        res.locals.artFull = fullArticleInfo;

        //get star rating of articles
        if (res.locals.artFull.avRating) {
            res.locals.starRating = allArticles.ratingStarsArticles(res.locals.artFull.avRating);
        }

        const allArticleComments = await commentDao.viewComments(req.query.id);
        //Add amount of likes to the comment then add back to res.locals.
        for (let i = 0; i < allArticleComments.length; i++) {
            const likes = await commentDao.getCommentLikes(allArticleComments[i].id);
            allArticleComments[i].likes = likes;
            //Only run this if user is logged in.
            if (res.locals.user) {
                const likeByUser = await commentDao.checkLikeByCurrentUser(res.locals.user.id, allArticleComments[i].id);
                //If the user has already liked the comment, then disable the ability to like that comment.
                if (likeByUser) {
                    allArticleComments[i].enableUserLike = false;
                } else {
                    allArticleComments[i].enableUserLike = true;
                }
            }
        }

        //Sort Comments by likes.
        allArticleComments.sort((a, b) => {
            return b.likes - a.likes;
        });
        res.locals.comFull = allArticleComments;

        res.locals.title = `${fullArticleInfo.title} | ${fullArticleInfo.fName} ${fullArticleInfo.lName} | Lustrous Lynxes`;
        res.render("full-article");
    } else {
        res.locals.title = "Error | Lustrous Lynxes";
        res.render("full-article", {
            noArticle: true
        })
    }
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