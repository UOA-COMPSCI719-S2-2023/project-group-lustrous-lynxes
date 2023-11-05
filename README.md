Final project &ndash; A personal blogging system &ndash; Lustrous Lynes
==========

## Introduction

We have created a food blogging website. Users can create articles about anything food related including recipes, and “how-to” information. We have completed 100% of the required functionality and have included the following extra features:
**1** `Articles can be rated.` 
        - The average rating is shown in the full article page. 
        - Articles are ordered by average rating (highest to lowest).
        - When ratings are changed or added, the order of display changes accordingly.
        - If a user tries to rate an article  a second time, it only changes their original rating.

**2** `Comments can be made about articles.`
        - Comments can be viewed on the full article page.
        - Comments can be deleted by the user that created them.

**3**  `Comments can be liked.`
        - A user can like or unlike a comment.
        - A user cannot like an article more than once.

**4**   `Comments can be removed by the user that created them`

**5**  `Users can choose a dark or light theme`

**6**   `User can see another user's details`
        - This is accessed by clicking the author's name on the full article page. 

All extra features are marked **extra** in the information below

An account has been created for you to test functionality.

Login Credentials:
Username: Lecturer1
Password: password


## Instructions

**1** `Open the file in visual studio code and install npm.`
        - Type “install npm” into the terminal once you are inside the project folder.

**2** `Install the database`.
        - Open DB Browser for SQLite
        - Select “New Database” and navigate the to project-database.db to select

**3** `Set up the database. `
        - Within DB Browser, select “Execute SQL”
        - Select the “Open SQL file(s)” icon, then navigate to “project-database-init-script.sql”
        - Select run.
        - Select "Write Changes".

**4** `Review the data`
        - Pre-populated with:
            - Users
            - Articles
            - Article Ratings **extra**
            - Comments **extra**
            - Likes **extra**
            - Images
        - Most pre-populated users, apart from the one given for testing, do not have encrypted passwords. The pre-populated information is to allow for testing the functionality for a user who is not logged in. This data would nomally be deleted upon handover to the client.

**5**  `npm start`

**6** `Test non-logged in functionality`
        - Please see the function list below for features available to users who have not logged in.

**7** `Test logged in functionality`
        - To do this, you will need to create an account. Please see the list below for logged in functionality.

**8** `Award Lustrous Lynxes 100% grade.`


## Functionality - Not Logged In

**1** `Create a new account` Please see the account functionality below for further details.
**2** `Login`
**3** `Browse a list of all articles`
**4** `View a full article`
**5** `See the average rating of an article` **extra**
**6** `View the details and other articles of a user` **extra**
**7** `View the details and other articles of user by click author` **extra**

## Functionality - Logged In

**1** `Browse a list of all articles`
**2** `Browse a list of their own articles`
**3** `Add a new article using a WYSIWYG editor`
        - Plus upload an image to be displayed with their article
        - Add images from the web into the body of their article **extra**
**4** `Edit their articles`
**5** `Delete their articles`
**6** `Edit their account details`
**7** `Delete their account`
**8** `View a full article`

**9**  `View the details and other articles of user by click author` **extra**
**10** `View the details and other articles of a user` **extra**
**11** `Rate and article` **extra**
**12** `View and article’s average rating` **extra**
**13** `Users are only allowed to rate and article once` **extra**
**14** `Comment on the article` **extra**
**15** `View other comments` **extra**
**16** `Like comments` **extra**
        - They can also remove their like if they change their mind **extra**
**17**  `User can remove comments they created` **extra**
**18** `Change the theme of the website` **extra**

## Account functionality

**1** New accounts are created with the following information:
    - Username
    - First and last name
    - Date of Birth
    - Password
    - Description
    - Avatar from a pre-defined list

**2** When entering a new username to create an account, users are notified immediately if the username is already being used.

**3** When creating an account the password is confirmed by entering it twice.

**4** All new passwords created are encrypted before being stored in the database. (please note this does not apply to the pre-populated data).

