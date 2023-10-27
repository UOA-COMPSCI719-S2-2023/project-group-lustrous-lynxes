# QUERIES WE NEED TO RUN
- get all articles without login search by a set criteria
    **viewArticles**
- create a user
    **createUser**
    - get all avatars
        **retrieveAllIcons**
    - choose an avatar

    - assign chosen Avatar to user

    - edit user information

- verify & login user 
    - Already given
    **retrieveUserCredentials**,
    **updateUserToken**,
    **retrieveUserByToken**,
    **removeUserToken**    

- Access users page articles

    - get users articles
        **viewUserArticles**
    - save article
        **addNewArticles**
    - edit articles
        **editArticles**
    - delete articles
        **deleteArticles**
    - upload images
        **addNewImageArticles**
    - delete images
        **deleteImageArticles**
    - change images
        **editImageArticles**

- Access comments and ratings

    - rate articles (once per article)

    - comment on articles

    - like others comments

    - average rating of article

    - order based on rating

    - order comments by most liked for each article

    - sort articles by most popular article (main and user page)
        **viewArticles**
        **viewUserArticles**
    - sort articles by newest article (main and user page)
        **viewArticles**
        **viewUserArticles**

