const express = require("express");
const router = express.Router();

const { verifyAuthenticated } = require("../middleware/auth-middleware.js");

//Redirects to all articles page
router.get("/", (req, res) => {
    res.redirect("/articles");
});

//Renders user's own user page
router.get("/profile", verifyAuthenticated, (req, res) => {
    res.redirect(`/user?id=${res.locals.user.id}`);
});

module.exports = router;