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


const buttons = document.querySelectorAll(".preference-button");
const welcomeMenu = document.querySelector("#welcome-menu");
const voteMenu = document.querySelector("#vote-menu");
const scale = document.querySelector("#scale");
let preference = null;
buttons.forEach((button) => {
    button.addEventListener("click", function(e) {
        preference = e.target.value;
        // Load example from DB
        // Clear page
        welcomeMenu.remove();
        // Populate page
        voteMenu.style.display = "block";
        
    })
});

voteButton.addEventListener("click", function(e) {
    // get selected rating
    // update db
    // show results
});

