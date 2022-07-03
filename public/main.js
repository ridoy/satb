// Load preferences... "she's a 10 but... he's a 10 but... both"
//

/*
 * Load page. Get pref. Pick random from DB. Show prompt, scale, and results. Write vote to DB.
 * Show results as histogram with numbers or percents.
 * Load page. Goes to submit. "Show she's a {num dropdown} but... " and textarea. Submit. Write to DB.
 *
 */

/*
 * table prompts
 * rows... prompts
 * columns: text, 10 columns for rating counts, "he" or "she" column
 */
console.log("Script loaded");


// TODO
// submit your own prompt
//   server: store prompt
// show graphs


const buttons = document.querySelectorAll(".preference-button");
const welcomeMenu = document.querySelector("#welcome-menu");
const voteMenu = document.querySelector("#vote-menu");
const scale = document.querySelector("#scale");
const voteButton = document.querySelector(".vote-button");
const header = document.querySelector(".header > h1");
const prompt = document.querySelector("#prompt > h1");
let preference = "she";
buttons.forEach((button) => {
    button.addEventListener("click", function(e) {
        preference = e.target.value;
        updateHeader();
        // Load example from DB
        // Clear page
        welcomeMenu.remove();
        // Populate page
        voteMenu.style.display = "block";
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
    })
});

function updateHeader(gender, defaultRating) {
    header.innerText = `${gender}'s a ${defaultRating} but...`;
}

voteButton.addEventListener("click", function(e) {
    // get selected rating
    // update db
    // show results
});

