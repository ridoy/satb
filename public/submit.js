console.log("Script loaded");

const header = document.querySelector(".header > h1");
const submitMenu = document.querySelector("#submit-menu");
const submitButton = document.querySelector(".submit-button");
const homeButton = document.querySelector(".home-button");

const submitMenuGenderSelection = document.querySelector(".submit-menu-gender-selection");
const submitMenuRatingSelection = document.querySelector(".submit-menu-rating-selection");
const submitMenuPrompt = document.querySelector("#submit-menu-prompt");
const submitMenuSuccessMessage = document.querySelector("#submit-menu > .success-message");
const submitMenuErrorMessage = document.querySelector("#submit-menu > .error-message");
const voteCompletionMessage = document.querySelector("#completion-message");
const voteMenuErrorMessage = document.querySelector("#vote-menu > .error-message");

let preference = null;
let currentPromptId = null;
let currentPromptData = null;
let chart = null;
let numVotesThisSession = 0;

homeButton.addEventListener("click", (e) => {
    window.location.href = "/";
})

submitButton.addEventListener("click", (e) => {
    submitMenuSuccessMessage.innerText = "";
    let gender = submitMenuGenderSelection.value;
    let rating = submitMenuRatingSelection.value;
    let prompt = submitMenuPrompt.value;
    if (!gender || !rating || !prompt) { 
        submitMenuErrorMessage.innerText = "Fill out all the fields and try again :D";
        return;
    }
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Confirmation message, show next
            submitMenuPrompt.value = "";
            submitMenuErrorMessage.innerText = "";
            submitMenuSuccessMessage.innerText = "We got it! Wanna submit another?"
        }
        // TODO handle error
    };
    xhttp.open("GET", `/submit?prompt=${prompt}&gender=${gender}&rating=${rating}`, true);
    xhttp.send();
});