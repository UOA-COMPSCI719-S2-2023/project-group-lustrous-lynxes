window.addEventListener("load", () =>{
    const usernameInput = document.querySelector("#username");
    const serverResponse = document.querySelector("#checkExists");

    //Everytime an input is made in form trigger event listener
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
});