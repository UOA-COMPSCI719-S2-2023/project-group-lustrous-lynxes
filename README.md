Final project &ndash; A personal blogging system &ndash; Lustrous Lynes
==========
## Introduction

We have created a food blogging website. Users can create articles about anything food related including recipes, and “how-to” information.

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

**4** `Review the data`

 - You will notice we have set the database up with several users, articles and images, etc

 - The pre-populated users do not have encrypted passwords , encryption will occur when the tester creates an account. The pre-populated information is to allow for testing the functionalitythe  for a user who is not logged in.

**5** `Test non-logged in functionality`

 - Please see the function list below for features available to users who have not logged in.

**6** `Test logged in functionality`

 - To do this, you will need to create an account. Please see the list below for logged in functionality.

**7** `Award Lustrous Lynxes 100% grade.`

## Functionality - Not Logged In

**1** `Create a new account` Please see the account functionality below for further details.

**2** `Login`

**3** `Browse a list of all articles`

**4** `View a full article`

**5** `See the average rating of an article` **extra**

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

**9** `Rate and article` **extra**

**10** `View and article’s average rating` **extra**

**11** `Users are only allowed to rate and article once` **extra**

 - if they rate a second time, it only changes their original rating` **extra**

**12** `Comment on the article` **extra**

**13** `View other comments` **extra**

**14** `Like comments` **extra**

 - They can also remove their like if they change their mind **extra**

**15** `Change the theme of the website` **extra**

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




