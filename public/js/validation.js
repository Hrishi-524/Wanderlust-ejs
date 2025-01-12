//self-executing anonymous funtion 
(() => {
    //strict mode
    "use strict";
    //get all forms node list
    const forms = document.querySelectorAll(".needs-validation");
    //convert nodelist into array 
    Array.from(forms).forEach((form) => {
        //for each form on submit check for validity
        form.addEventListener("submit", (event) => {
            //form.checkValidity() is a built in funtion to validate required elemets, min-max etc
            if(!form.checkValidity()) {
                /*If the form is not valid, the default submission is prevented (event.preventDefault()),
                and event propagation is stopped (event.stopPropagation()).*/
                event.preventDefault();
                event.stopPropagation();
            }
            //Adds the class was-validated to the form
            form.classList.add("was-validated");
        });
    })
})();