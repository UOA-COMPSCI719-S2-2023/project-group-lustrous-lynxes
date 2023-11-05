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
    const articleTitle = req.body.articleTitle;
    const articleContent = req.body.articleContent;
    const imageInfo = req.file;
    const imageCaption = req.body.imageCaption;

    const newArticle = {
        userId: res.locals.user.id,
        content: articleContent,
        title: articleTitle,
        imgFileName: "default-image.jpg",
        imgCaption: "No image available"
    };

    if (imageInfo) {
        const newFileName = await processNewImage(imageInfo);
        newArticle.imgFileName = newFileName;
        newArticle.imgCaption = imageCaption;
    }

    const newArticleId = await articleDao.addNewArticle(newArticle);

    res.redirect(`/full-article?id=${newArticleId}`);
});

//Renders edit-article page, allowing user to edit their own article, specified by ID in query parameter
router.get("/edit-article", verifyAuthenticated, async (req, res) => {
    const articleId = req.query.id;
    const article = await articleDao.getArticleById(articleId);

    if (article == undefined) {
        res.locals.title = "Error | Lustrous Lynxes";
        res.render("edit-article", {
            noArticle: true
        });
    } else {
        if (article.authorId == res.locals.user.id) {
            const hasImage = (article.imgFileName != "default-image.jpg");
            res.locals.title = "Edit article | Lustrous Lynxes";

            res.render("edit-article", {
                includeTinyMCEScripts: true,
                hasImage: hasImage,
                article: article
            });
        } else {
            res.locals.title = "Error | Lustrous Lynxes";

            res.render("edit-article", {
                wrongAuthor: true
            });
        }
    }
});

//Processes form for editing an existing article
router.post("/edit-article", upload.single("imageFile"), async (req, res) => {
    const articleId = req.body.articleId;
    const articleTitle = req.body.articleTitle;
    const articleContent = req.body.articleContent;
    const imageInfo = req.file;
    const imageCaption = req.body.imageCaption;

    const article = {
        id: articleId,
        title: articleTitle,
        content: articleContent,
    };

    if (imageInfo) {
        const newFileName = await processNewImage(imageInfo);
        article.imgFileName = newFileName;
    }

    if (imageCaption) {
        article.imgCaption = imageCaption;
    }
    await articleDao.editArticle(article);
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
    const oldFileName = imageInfo.path;
    let newFileName = imageInfo.originalname;
    const fileNameExists = await articleDao.doesFileNameExist(newFileName);
    if (fileNameExists) {
        const timestamp = Date.now();
        const fileExtension = imageInfo.originalname.split(".").pop();
        const originalNameNoExtension = imageInfo.originalname.replace(`.${fileExtension}`, "");
        newFileName = `${originalNameNoExtension}_${timestamp}.${fileExtension}`;
    }
    fs.renameSync(oldFileName, `public/images/${newFileName}`);
    return newFileName;
}

module.exports = router;