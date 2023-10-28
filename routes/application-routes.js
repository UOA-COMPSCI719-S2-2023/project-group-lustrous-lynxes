const express = require("express");
const router = express.Router();

const testDao = require("../modules/test-dao.js");

router.get("/", async function(req, res) {

    res.locals.title = "Lustrous Lynxes";
    res.locals.allTestData = await testDao.retrieveAllTestData();

    res.render("home");
});

//Renders add-article page which allows user to create an article
router.get("/add-article", authUser.verifyAuthenticated, (req, res) => {
    res.render("add-article", {
        includeTinyMCEScripts: true
    });
});

router.post("/add-article", (req, res) => {
    const article = req.body.article;

    //Change later - add article to database
    console.log(article);

    //Redirect to user's account with new article on it - might change later
    res.redirect("/account");
});

module.exports = router;