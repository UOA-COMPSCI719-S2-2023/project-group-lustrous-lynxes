window.addEventListener("load", () =>{
    const usernameInput = document.querySelector("#username");
    const serverResponse = document.querySelector("#checkExists");

    //Everytime an input is made in form trigger event listener.
    //The Try-catch is optional, but could use it if calling server then DB from client.
    if (usernameInput != null){
    usernameInput.addEventListener("input", async () => {
        const currentInput = usernameInput.value;
        try {
            //make call to server
            const response = await fetch(`./new/${currentInput}`);
            //reponse will be json {value: boolean}
            const json = await response.json();
            //Get boolean of key "value" from json
            const usernameExists = json.value;
            //If the username exists change inner.HTML to reflect this.
            if (usernameExists) {
                serverResponse.innerHTML= "Username Taken";
            } else {
            //If it does not exist remove the HTML response
                serverResponse.innerHTML= "";
            }
          } catch (error) {
            console.error(error);
            return;
          }
        });    
    }
    //Get add/remove Like Buttons for comments.
    const likeCommentButtons = Array.from(document.querySelectorAll(".likeButtons"));
    //For Each button add an async event listener.
    likeCommentButtons.forEach(button =>{
        likeButtonEventListener(button);
        });

    async function likeButtonEventListener(button){
        button.addEventListener("click", async () =>{
            //Get the buttons current setting - add or remove.
            const buttonSetting = button.getAttribute("setting");
            //Get commentId for use in updating Database.
            const commentId = button.getAttribute("commentId")
            //If add, do the logic to add like to comment.
            if (buttonSetting == "add"){
                const likes = await addLike(commentId);
                //Change Buttons setting and text.
                button.setAttribute('setting', 'remove');
                button.innerHTML = "Remove Like";
                //Update display of likes for given comment.
                document.querySelector(`#display${commentId}`).innerHTML = `likes: ${likes}`
            }else{
                //Do the same, but in reverse. Remove a like and set button to add.
                const likes = await removeLike(commentId)
                button.setAttribute('setting', 'add');
                button.innerHTML = "Add Like"
                document.querySelector(`#display${commentId}`).innerHTML = `likes: ${likes}`
            }
    });
    }

    async function addLike(commentId){
        const response = await fetch(`add-like/${commentId}`);
        const jsonData = await response.json();
        return jsonData.likes; 
    }
    async function removeLike(commentId){
        const response = await fetch(`remove-like/${commentId}`);
        const jsonData = await response.json();
        return jsonData.likes;
    }

    //Form for adding rating.
    const addRating = document.querySelector("#addRating");

    addRating.addEventListener('submit', async (event) =>{
        //Prevent Submittion of form. Process on client by making fetch request.
        event.preventDefault();
        //set HTML to nothing
        document.querySelector("#displayRating").innerHTML ="";
        const selectedRating = document.querySelectorAll('.ratingValue');
        const currentArticle = document.querySelector('#currentArticle');
        let userRating;
        //Get Radio Button the was checked by using class and loop
        for (let i = 0; i < selectedRating.length; i++){
            if (selectedRating[i].checked){
                const rating = selectedRating[i].value;
                //Process to integer for DB later.
                userRating = parseInt(rating);
            }
        }
        const response = await fetch(`rating/${userRating}/${currentArticle.value}`);
        //Return article with new average result.
        const jsonData = await response.json();
        //find correct star image to use
        const starImage = getRatingStars(jsonData.avRating);
        //Process back to client. To be changed later to star images.
        document.querySelector("#displayRating").innerHTML = `Average Rating= <img src="images/icons/${starImage}-star.png">`;
    });

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

    function isHalfStar(rating){
        return false;
    }

    //Client Side processing for comments.
    const addCommentForm = document.querySelector('#comment-form');

    addCommentForm.addEventListener('submit', async (event)=>{
        event.preventDefault();
        const userComment = document.querySelector("#userComment").value;
        //If no comment in field. Ignore the event handler.
        if(userComment != null){
        const articleId = document.querySelector("#articleComment").value;
        const response = await fetch(`comment/${articleId}/${userComment}`);
        const jsonData = await response.json();
        displayNewComment(jsonData);
        }
    });

    //Process json response into new comment to be sent back to client.
    function displayNewComment(commentJson){
        //Get location to display new comments
        const container = document.querySelector("#newCommentCard");

        //Create div containers and add correct CSS class.
        const commentCard = document.createElement('div');
        commentCard.classList.add('comment-card');
        const cardAvatar = document.createElement('div');
        cardAvatar.classList.add('card-avatar');
        const cardTitle = document.createElement('div');
        cardTitle.classList.add('card-title');
        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');

        //Populate the comment.
        const avatar = document.createElement('img')
        avatar.src = `/images/avatars/${commentJson.avatar}`
        cardAvatar.appendChild(avatar);
        cardTitle.innerHTML = `<h4>${commentJson.fName} ${commentJson.lName}</h4>`;
        cardContent.innerHTML = `<p>${commentJson.content}</p>
        <h3 id = "display${commentJson.id}">likes: 0</h3>`

        //Create like button and add to event listener.
        const likeButton = document.createElement('button');
        likeButton.classList.add('likeButtons');
        likeButton.setAttribute("commentId",`${commentJson.id}`)
        likeButton.setAttribute("setting", "add");
        likeButton.innerHTML = "Add Like"
        //Add event listener to button for adding likes.
        cardContent.appendChild(likeButton);
        likeButtonEventListener(likeButton);
        
        //Append the divs together.
        commentCard.appendChild(cardAvatar);
        commentCard.appendChild(cardTitle);
        commentCard.appendChild(cardContent);
        container.appendChild(commentCard);
    }

    //Add event handler to file input for add-article and edit-article pages
    const fileInput = document.querySelector("#imageInput");
    if(fileInput){
    fileInput.onchange = addCaptionInput;
    }

    //Adds input requiring caption if a file is chosen
    function addCaptionInput() {
        //Only executes code if a file is chosen
        if (fileInput.files.length > 0) {
            //Removes "hidden" class from elements for caption input
            const captionInputElements = document.querySelectorAll(".if-file-chosen");
            captionInputElements.forEach(function(element) {
                element.classList.remove("hidden");
            });
            
            //Adds "required" attribute to caption input
            const captionInput = document.querySelector("#imageCaption");
            captionInput.setAttribute("required", "required");
        }
    }
    
});