window.addEventListener("load", () =>{
    const usernameInput = document.querySelector("#username");
    const serverResponse = document.querySelector("#checkExists");
    const viewArticle = document.querySelectorAll("#read-more");
    const testing = document.querySelector("#arthead")
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