const articlesDao = require("../modules/articles-dao.js");
const commentDao = require("../modules/comments-dao.js");

//Get all articles. Ordered by highest to lowest average rating.
async function allCardDetails() {
    const allCardData = await articlesDao.viewArticlesCards();

    return allCardData;
}
//Get  articles of one user. Ordered by highest to lowest average rating.
async function userCardDetails(id) {
    const cardData = await articlesDao.userArticlesCards(id);

    return cardData;
}
//Sets average rating for all articles.
async function setAllArticleAverageRating(){
    const allArticles = await articlesDao.viewAllArticles("id");

    for (let i = 0; i < allArticles.length; i++){
        await addAverageRating(allArticles[i].id);
    }
}
//Get ratings from DB and calculate average 
async function addAverageRating(articleId){
    const ratingArray = [];
    const allArticleRatings = await commentDao.allRatingArticle(articleId);

    //Place into an array, so we can easily calculate average.
    allArticleRatings.forEach(rating => {
        ratingArray.push(rating.rating);
    });
    //Calculate average.
    const sumOfTotal = ratingArray.reduce((total, num) => total + num, 0);
    const averageRating = sumOfTotal / ratingArray.length;
    //Round to nearest .5 or .0 decimal value.
    const roundAverage = (Math.round(averageRating * 2)) / 2;
    //Add to Database
    await commentDao.avRating(roundAverage, articleId);
}


async function addUserArticleRating(ratingJson){
    const userArticleRating = await commentDao.getUserRatingforArticle(ratingJson);
    //If user already has rating for given article, then change it to new rating.
    if (userArticleRating){
        await commentDao.changeArticleRating(ratingJson);
    //Else create new rating for article.
    }else{
        await commentDao.addArticleRating(ratingJson);
    }
}


module.exports = {
    allCardDetails,
    userCardDetails,
    setAllArticleAverageRating,
    addUserArticleRating,
    addAverageRating
};
