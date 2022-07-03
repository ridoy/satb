// Load preferences... "she's a 10 but... he's a 10 but... both"
//

/*
 * Load page. Get pref. Pick random from DB. Show prompt, scale, and results. Write vote to DB.
 * Show results as histogram with numbers or percents.
 * Load page. Goes to submit. "Show she's a {num dropdown} but... " and textarea. Submit. Write to DB.
 *
 */
console.log("Script loaded");


// TODO
// submit your own prompt
//   server: store prompt
// show graphs


const prefButtons = document.querySelectorAll(".preference-button");
const welcomeMenu = document.querySelector("#welcome-menu");
const voteMenu = document.querySelector("#vote-menu");
const scale = document.querySelector("#scale");
const voteButtons = document.querySelector(".vote-button");
const header = document.querySelector(".header > h1");
const prompt = document.querySelector("#prompt > h1");

let preference = null;

prefButtons.forEach((prefButton) => {
    prefButton.addEventListener("click", function(e) {
        preference = e.target.value || "both";
        updateHeader();
        // Load example from DB
        // Clear page
        welcomeMenu.remove();
        // Populate page
        voteMenu.style.display = "block";
    })
});

voteButtons.forEach((voteButton) => {
    voteButton.addEventListener("click", (e) => {
        let promptId = currentPromptId;
        let selectedRating = e.target.value;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // Confirmation message, go to next
                
            }
        };
        xhttp.open("GET", `/vote?promptId=${promotId}&rating=${selectedRating}`, true);
        xhttp.send();
    });
});


function updateHeader(gender, defaultRating) {
    header.innerText = `${gender}'s a ${defaultRating} but...`;
}

function loadPrompt() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(xhttp.responseText)[0];
            let text = data.text; 
            updateHeader(data.pref, data.defaultrating);
            prompt.innerText = text;
        }
    };
    xhttp.open("GET", `/prompt?pref=${preference}`, true);
    xhttp.send();
}
