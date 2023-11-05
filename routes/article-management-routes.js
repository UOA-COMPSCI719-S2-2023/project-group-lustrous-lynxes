const express = require("express");
const router = express.Router();

const { verifyAuthenticated } = require("../middleware/auth-middleware.js");
const articleDao = require("../modules/articles-dao.js");
const upload = require("../middleware/multer-uploader.js");
const fs = require("fs");

//Renders add-article page, allowing user to create an article
router.get("/add-article", verifyAuthenticated, (req, res) => {
    res.locals.title = "Add New Article | Lustrous Lynxes";
    res.render("add-article", {
        includeTinyMCEScripts: true
    });
});

//Processes form for adding a new article
router.post("/add-article", upload.single("imageFile"), async (req, res) => {
    //Getting user input from form
    const articleTitle = req.body.articleTitle;
    const articleContent = req.body.articleContent;
    const imageInfo = req.file;
    const imageCaption = req.body.imageCaption;

    //Creating new article object
    const newArticle = {
        userId: res.locals.user.id,
        content: articleContent,
        title: articleTitle,
        imgFileName: "default-image.jpg",
        imgCaption: "No image available"
    };

    //Checks if user uploaded an image
    if (imageInfo) {
        //Renames & moves image file
        const newFileName = await processNewImage(imageInfo);

        //Stores given image & caption
        newArticle.imgFileName = newFileName;
        newArticle.imgCaption = imageCaption;
    }

    //Adding new article to database
    const newArticleId = await articleDao.addNewArticle(newArticle);

    //Redirects to full article
    res.redirect(`/full-article?id=${newArticleId}`);
});

//Renders edit-article page, allowing user to edit their own article, specified by ID in query parameter
router.get("/edit-article", verifyAuthenticated, async (req, res) => {
    //Retrieves article object with corresponding ID from database
    const articleId = req.query.id;
    const article = await articleDao.getArticleById(articleId);

    //Checks whether the article exists
    if (article == undefined) {
        res.locals.title = "Error | Lustrous Lynxes";
        //Informs user that the article does not exist
        res.render("edit-article", {
            noArticle: true
        });
    } else {
        //Checks whether the user currently logged in is the author of the article
        if (article.authorId == res.locals.user.id) {
            //Stores whether or not the article is using the default image
            const hasImage = (article.imgFileName != "default-image.jpg");

            //Set title
            res.locals.title = "Edit article | Lustrous Lynxes";

            //Renders page with all necessary info
            res.render("edit-article", {
                includeTinyMCEScripts: true,
                hasImage: hasImage,
                article: article
            });
        } else {
            res.locals.title = "Error | Lustrous Lynxes";

            //Informs user that they cannot edit this article
            res.render("edit-article", {
                wrongAuthor: true
            });
        }
    }
});

//Processes form for editing an existing article
router.post("/edit-article", upload.single("imageFile"), async (req, res) => {
    //Getting user input from form
    const articleId = req.body.articleId;
    const articleTitle = req.body.articleTitle;
    const articleContent = req.body.articleContent;
    const imageInfo = req.file;
    const imageCaption = req.body.imageCaption;

    //Creating article object with updated values
    const article = {
        id: articleId,
        title: articleTitle,
        content: articleContent,
    };

    //Checks if user uploaded a new image
    if (imageInfo) {
        //Renames & moves image file
        const newFileName = await processNewImage(imageInfo);

        //Adds image file name to article object
        article.imgFileName = newFileName;
    }

    //Adds caption to article object if it was given
    if (imageCaption) {
        article.imgCaption = imageCaption;
    }

    //Edits article in database
    await articleDao.editArticle(article);

    //Redirects to full article
    res.redirect(`/full-article?id=${articleId}`);
});

//Handles request to delete article
router.post("/delete-article/:id", async (req, res) => {
    const articleId = req.params.id;

    await articleDao.deleteArticle(articleId);

    res.setToastMessage("Article deleted successfully.");
    res.redirect("/");
});

//Helper function for processing an uploaded image, used when adding/editing articles
async function processNewImage(imageInfo) {
    //Renames and moves image file
    const oldFileName = imageInfo.path;
    let newFileName = imageInfo.originalname;
    //Checks whether image file name already exists
    const fileNameExists = await articleDao.doesFileNameExist(newFileName);
    if (fileNameExists) {
        //Generates unique file name
        const timestamp = Date.now();
        const fileExtension = imageInfo.originalname.split(".").pop();
        const originalNameNoExtension = imageInfo.originalname.replace(`.${fileExtension}`, "");
        newFileName = `${originalNameNoExtension}_${timestamp}.${fileExtension}`;
    }
    fs.renameSync(oldFileName, `public/images/${newFileName}`);
    return newFileName;
}

module.exports = router;