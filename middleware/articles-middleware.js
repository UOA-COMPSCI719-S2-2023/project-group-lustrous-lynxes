const articlesDao = require("../modules/articles-dao.js");

async function allCardDetails() {
    const allCardData = await articlesDao.viewArticlesCards()
    const puss = "Cat";
    console.log(allCardData);
    return puss;
}

module.exports = {allCardDetails};
