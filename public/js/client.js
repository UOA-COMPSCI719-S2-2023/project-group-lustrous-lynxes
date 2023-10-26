window.addEventListener("load", () =>{
    const usernameInput = document.querySelector("#username");

    //Everytime an input is made in form trigger event listener
    usernameInput.addEventListener("input", async () => {
        const currentInput = usernameInput.value;
        if(currentInput.length < 5){
            return;
        }
        try {
            //make call to server
            const usernameExists = await fetch(`./new/${currentInput}`);
            console.log(usernameExists);
            //if (usernameExists) {
             // message.innerHTML = "Username is available!";
            //} else {
             // message.innerHTML = "Username is already taken.";
            //}
          } catch (error) {
            console.error("Error checking username availability:", error);
            return;
          }
    });
});