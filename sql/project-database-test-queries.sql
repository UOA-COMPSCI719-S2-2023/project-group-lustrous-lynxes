/* all of user 1 article titles*/
select u.fName, u.lName, a.title
from users u, articles a 
where u.id = 1
and u.id = a.authorId;

/* all article titles*/
select title
from articles;

/* all article titles rating ordered by user*/
select u.fName, u.lName, a.title, r.rating
from articles a, rate r, users u 
where r.authorId = u.id
and r.articleId = a.id
order by u.fName;

/* comments ordered by article and show who wrote them*/
select a.title, c.content, u.fName, u.lName
from articles a, comment c, users u 
where c.articleId = a.id
and c.authorId = u.id;

/*how many likes has each comment received?*/
select c.content, c.likes
from  comment c;

/*what images did each user use, and what article were they used in?*/
select u.fName, u.lName, i.filName, a.title
from users u, images i, articles a 
where u.id = a.authorId
and a.id = i.articleId
order by u.fName;
