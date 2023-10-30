const articlesDao = require("../modules/articles-dao.js");

async function allCardDetails() {
    const allCardData = await articlesDao.viewArticlesCards();

    return allCardData;
}

module.exports = {allCardDetails};
