window.addEventListener("load", () =>{
    const usernameInput = document.querySelector("#username");

    //Everytime an input is made in form trigger event listener
    usernameInput.addEventListener("input", async () => {
        const currentInput = usernameInput.value;
        try {
            //make call to server
            const response = await fetch(`./new/${currentInput}`);
            const json = await response.json();
            const usernameExists = json.value;
            //If the username exists change inner.HTML to reflect this
            if (usernameExists) {
                document.querySelector("#checkExists").innerHTML= "Username Taken";
            } else {
                document.querySelector("#checkExists").innerHTML= "";
            }
          } catch (error) {
            console.error(error);
            return;
          }
    });
});