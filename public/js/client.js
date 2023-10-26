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
            if (usernameExists) {
             console.log(true);
            } else {
            console.log(false);
            }
          } catch (error) {
            console.error("Error checking username availability:", error);
            return;
          }
    });
});