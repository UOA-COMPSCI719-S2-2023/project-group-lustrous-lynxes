const userDao = require("../modules/users-dao.js");
const { addComment } = require("../modules/comments-dao.js");

//to add a comment
async function addCommentMiddleware(req, res) {
    //get the authToken from the cookies
    const authToken = req.cookies.authToken;

    //Retrieve the user by authToken
    const user = await userDao.retrieveUserByToken(authToken);

    //if retrieved user is not null
    if (user) {
        const commentData = {
            userId: user.id,
            articleId: req.params.articleId,
            content: req.body.comment
        };

        //try to add comment to database
        await addComment(commentData);

        res.setToastMessage("Comment added");
        
    }

    res.redirect("/full-article?id=" + req.params.articleId);
    
}

module.exports = {
    addCommentMiddleware
}