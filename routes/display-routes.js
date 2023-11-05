const express = require("express");
const router = express.Router();

const allArticles = require("./helper-functions/articles.js");
const userDao = require("../modules/users-dao.js");
const commentDao = require("../modules/comments-dao.js");
const articleDao = require("../modules/articles-dao.js");

//Renders all articles page - no login required
router.get("/articles", async (req, res) => {
    await allArticles.setAllArticleAverageRating();

    res.locals.title = "All Articles | Lustrous Lynxes";
    res.locals.artCard = await allArticles.allCardDetails();

    res.render("articles");
});

//Renders particular user's profile by ID in query parameter
router.get("/user", async (req, res) => {
    const visitUserId = req.query.id;
    const visitUser = await userDao.getUserById(visitUserId);

    if (visitUser) {
        res.locals.visitUser = visitUser;
        res.locals.title = `${visitUser.username}'s articles | Lustrous Lynxes`;
        res.locals.artCard = await allArticles.userCardDetails(visitUserId);
        res.locals.rating = await allArticles.setAllArticleAverageRating();

        let myAccount = false;
        if (res.locals.user) {
            if (visitUserId == res.locals.user.id) {
                myAccount = true;
            }
        }
        res.render("account", { myAccount });
    } else {
        res.locals.title = "Error | Lustrous Lynxes";
        res.render("account", {
            noUser: true
        });
    }
});

//Renders a full article page, specified by article ID in query parameter
router.get("/full-article", async (req, res) => {
    await allArticles.addAverageRating(req.query.id);
    const article = await articleDao.getArticleById(req.query.id);
    if (article) {
        const fullArticleInfo = await articleDao.viewFullArticle(req.query.id);
        res.locals.authorId = article.authorId;
        res.locals.artFull = fullArticleInfo;

        if (res.locals.artFull.avRating) {
            res.locals.starRating = allArticles.ratingStarsArticles(res.locals.artFull.avRating);
        }

        const allArticleComments = await commentDao.viewComments(req.query.id);
        for (let i = 0; i < allArticleComments.length; i++) {
            const likes = await commentDao.getCommentLikes(allArticleComments[i].id);
            allArticleComments[i].likes = likes;

            if (res.locals.user) {
                const likeByUser = await commentDao.checkLikeByCurrentUser(res.locals.user.id, allArticleComments[i].id);

                if (res.locals.user.id == allArticleComments[i].userId) {
                    allArticleComments[i].enableRemove = true;
                } else {
                    allArticleComments[i].enableRemove = false;
                }
                if (likeByUser) {
                    allArticleComments[i].enableUserLike = false;
                } else {
                    allArticleComments[i].enableUserLike = true;
                }
            }
        }
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

module.exports = router;