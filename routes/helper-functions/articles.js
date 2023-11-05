const articlesDao = require("../../modules/articles-dao");
const commentDao = require("../../modules/comments-dao.js")

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

function ratingStarsArticles(score) {
    //find correct star image to use
    const starImage = getRatingStars(score);
    //do we need a half star 
    const halfStar = isHalfStar(score);
    //Process back to routes.js
    if(halfStar) {
        return `Average Rating <img src="images/icons/${starImage}-star.png"><img src="images/icons/half-star.png">`; 
    }
    else {
        return`Average Rating <img src="images/icons/${starImage}-star.png">`;
    }
       
}

function getRatingStars(score) {
    if (score < 1.8) {
        return "one";
    }
    else if (score < 2.8) {
        return "two";
    }
    else if (score < 3.8) {
        return "three";
    }
    else if (score < 4.8) {
        return "four";
    }
    else {
        return "five";
    }
}

function isHalfStar(score){
    if (score < 1.3 || (score >= 1.8 && score < 2.3) || (score >= 2.8 && score < 3.3) || (score >= 3.8 && score < 4.3) || score >= 4.8) {
        return false;
    }
    else {
        return true;
    }
}


module.exports = {
    allCardDetails,
    userCardDetails,
    setAllArticleAverageRating,
    addUserArticleRating,
    addAverageRating,
    ratingStarsArticles
};
