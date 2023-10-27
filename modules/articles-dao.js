//view all articles based on search criteria
async function viewArticles(criteria) {
    const db = await dbPromise;

    const allArticles = await db.all(SQL`
     select * 
     from articles
     order by ${criteria}`);  

    return allArticles;
}

module.exports = {
    allArticles
};