const articlesDao = require("../modules/articles-dao.js");
const commentDao = require("../modules/comments-dao.js")

//Get all articles. Ordered by highest to lowest average rating.
async function allCardDetails() {
    const allCardData = await articlesDao.viewArticlesCards();

    return allCardData;
}
//Sets average rating for all articles.
async function setAllArticleAverageRating(){
    const allArticles = await articlesDao.viewAllArticles("id");
    allArticles.forEach(async article =>{
        const averageRating = await calculateAverageRating(article.id);
        await commentDao.avRating(averageRating,article.id);
    });
}
//Get ratings from DB and calculate average 
async function calculateAverageRating(articleId){
    const ratingArray = [];
    const allArticleRatings = await commentDao.allRatingArticle(articleId);

    //Place into an array, so we can easily calculate average.
    allArticleRatings.forEach(rating => {
        ratingArray.push(rating.rating);
    });
    //Calculate average.
    const sumOfTotal = ratingArray.reduce((total, num) => total + num, 0);
    const averageRating = sumOfTotal / ratingArray.length;
    //Add to Article in DB
    
    return averageRating;
}

module.exports = {
    allCardDetails,
    setAllArticleAverageRating
};
