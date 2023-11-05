window.addEventListener("load", () =>{

    const themeToggleButton = document.querySelector("#theme-change");
    const body = document.body;
    
    //Initialize theme based on saved preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        body.classList.add("theme-dark");
        body.classList.remove("theme-light");
    } else {
        body.classList.add("theme-light");
        body.classList.remove("theme-dark");
    }
    
    if(themeToggleButton){
        themeToggleButton.addEventListener("click", () => {
            body.classList.toggle("theme-light");
            body.classList.toggle("theme-dark");

            const theme = body.classList.contains("theme-dark") ? "dark" : "light";
            localStorage.setItem("theme", theme);
    });
}

    const usernameInput = document.querySelector("#username");
    const serverResponse = document.querySelector("#checkExists");

    //Everytime an input is made in form trigger event listener.
    //The Try-catch is optional, but could use it if calling server then DB from client.
    if (usernameInput != null){
        usernameInput.addEventListener("input", async () => {
            const currentInput = usernameInput.value;
            try {
                const response = await fetch(`./new/${currentInput}`);
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

    if (addRating){
        addRating.addEventListener('submit', async (event) =>{
            event.preventDefault();
            document.querySelector("#displayRating").innerHTML ="";
            const selectedRating = document.querySelectorAll('.ratingValue');
            const currentArticle = document.querySelector('#currentArticle');
            let userRating;
            for (let i = 0; i < selectedRating.length; i++){
                if (selectedRating[i].checked){
                    const rating = selectedRating[i].value;
                    userRating = parseInt(rating);
                }
            }
            const response = await fetch(`rating/${userRating}/${currentArticle.value}`);
            const jsonData = await response.json();
            const starImage = getRatingStars(jsonData.avRating);
            const halfStar = isHalfStar(jsonData.avRating);

            if(halfStar) {
                document.querySelector("#displayRating").innerHTML = `Average Rating <img src="images/icons/${starImage}-star.png"><img src="images/icons/half-star.png">`; 
            }else {
                document.querySelector("#displayRating").innerHTML = `Average Rating <img src="images/icons/${starImage}-star.png">`;
            }
        });
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

    //Client Side processing for comments.
    const addCommentForm = document.querySelector('#comment-form');

    if(addCommentForm){
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
    }

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

        
        const likeButton = document.createElement('button');
        likeButton.classList.add('likeButtons');
        likeButton.setAttribute("commentId",`${commentJson.id}`)
        likeButton.setAttribute("setting", "add");
        likeButton.innerHTML = "Add Like"

        const removeButton = document.createElement('button');
        removeButton.setAttribute("commentId", `${commentJson.id}`);
        removeButton.classList.add('removeButtons');
        removeButton.innerHTML = "Remove";
   
        cardContent.appendChild(likeButton);
        cardContent.appendChild(removeButton);
        likeButtonEventListener(likeButton);
        
        //Append the divs together.
        commentCard.appendChild(cardAvatar);
        commentCard.appendChild(cardTitle);
        commentCard.appendChild(cardContent);
        container.appendChild(commentCard);

        removeCommentEventListener(removeButton, commentCard);
    }

    function removeCommentEventListener(button,comment){
        button.addEventListener('click', async ()=>{
            const commentId = button.getAttribute('commentId');
            await fetch(`delete-comment/${commentId}`);
            comment.innerHTML = "";
            return;
        });
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

    //Adds confirmation dialog before deleting articles
    const deleteFormsArray = document.querySelectorAll(".delete-article-form");
    if (deleteFormsArray) {
        deleteFormsArray.forEach((element) => {
            element.onsubmit = () => {
                return confirm(`Are you sure you want to permanently delete "${element.dataset.articleTitle}"?`);
            }
        });
    }
    const deleteAccountButton = document.querySelector("#deleteAccount");
    if (deleteAccountButton){
        deleteAccountButton.onsubmit = () => {
            return confirm(`Are you sure you want to delete your account. This action cannot be undone.`)
        }
    }

    //Add a click event listener to the card
    const cards = document.querySelectorAll(".summary-card");
        cards.forEach(function(card) {
            card.addEventListener("click", function() {
                window.location.href = `full-article?id=${card.dataset.articleId}`;
            });
        }
    );

    // Find all inner links and add a click event to stop propagation
    const innerLinks = document.querySelectorAll(".inner-link");
        innerLinks.forEach(function(link) {
            link.addEventListener("click", function(event) {
            event.stopPropagation();
        });
    });
});

