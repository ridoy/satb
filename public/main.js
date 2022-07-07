console.log("Script loaded");

const header = document.querySelector(".header > h1");
const scale = document.querySelector("#scale");
const prompt = document.querySelector("#prompt > h1");
const welcomeMenu = document.querySelector("#welcome-menu");
const voteMenu = document.querySelector("#vote-menu");
const submitMenu = document.querySelector("#submit-menu");
const prefButtons = document.querySelectorAll(".preference-button");
const voteButtons = document.querySelectorAll(".vote-button");
const nextButton = document.querySelector(".next-button");
const openSubmitMenuButton = document.querySelector(".open-submit-menu-button");
const submitButton = document.querySelector(".submit-button");
const copyLinkButton = document.querySelector(".share-with-a-friend-link");

const submitMenuGenderSelection = document.querySelector(".submit-menu-gender-selection");
const submitMenuRatingSelection = document.querySelector(".submit-menu-rating-selection");
const submitMenuPrompt = document.querySelector("#submit-menu-prompt");
const submitMenuSuccessMessage = document.querySelector("#submit-menu > .success-message");
const submitMenuErrorMessage = document.querySelector("#submit-menu > .error-message");
const voteCompletionMessage = document.querySelector("#completion-message");

let preference = null;
let currentPromptId = null;
let currentPromptData = null;
let chart = null;
let numVotesThisSession = 0;

openSubmitMenuButton.addEventListener("click", (e) => {
    welcomeMenu.style.display = "none";
    submitMenu.style.display = "block";
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
})

prefButtons.forEach((prefButton) => {
    prefButton.addEventListener("click", function(e) {
        preference = e.target.value || "both";
        // Load example from DB
        loadPrompt();
        // Clear page
        welcomeMenu.style.display = "none";
        // Populate page
        voteMenu.style.display = "block";
    })
});

voteButtons.forEach((voteButton) => {
    voteButton.addEventListener("click", (e) => {
        let promptId = currentPromptId;
        let selectedRating = e.target.value;
        var xhttp = new XMLHttpRequest();
        nextButton.style.display = "block";
        playSound();
        numVotesThisSession++;
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // Confirmation message, show next
                hideVoteButtons();
                showGraph(currentPromptData, selectedRating);
            }
            // TODO handle error
        };
        xhttp.open("GET", `/vote?promptId=${promptId}&rating=${selectedRating}`, true);
        xhttp.send();
    });
});

function playSound() {
    let sounds = ["g3", "a3", "b3", "c4", "d4", "e4", "fsharp4", "g4"];
    // let soundToPlay = "https://www.shesatenbut.org/audio" + sounds[numVotesThisSession % 8] + ".mp3";
    let soundToPlay = "audio/" + sounds[numVotesThisSession % 8] + ".mp3";
    let audio = new Audio(soundToPlay);
    audio.play();
}

function hideVoteButtons() {
    voteButtons.forEach((voteButton) => {
        voteButton.style.display = "none";
    })
}


function showVoteButtons() {
    voteButtons.forEach((voteButton) => {
        voteButton.style.display = "inline-block";
    })
}

// Store prompts we've seen so there's no repeats
function updateSeenPromptIds(newId) {
    let seen = localStorage.getItem('seen');
    if (!seen) {
        seen = `${newId}`;
    } else {
        seen += `,${newId}`;
    }
    localStorage.setItem('seen', seen);
}

function getSeenPromptIds() {
    return localStorage.getItem('seen');
}

function showGraph(data, selectedRating) {
    // document.getElementById("chart").display = "block";
    let ratings = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "100"]; 
    let counts = ratings.map((rating) => data[rating]);
    if (selectedRating === "100") {
        counts[11] += 1; // incremenet selected rating to reflect new vote
    } else {
        counts[selectedRating] += 1;
    }
    const chartData = {
      labels: ratings,
      datasets: [{
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: counts,
      }]
    };
  
    const config = {
      type: 'bar',
      data: chartData,
      options: {
          'aspectRatio': 1.5,
          'maintainAspectRatio': false,
          'responsive': true,
          //'reverse': true,
          'plugins': {
              'legend': {
                  'display': false
              },
              title: {
                  display: true,
                  color: "#000",
                  text: "Here's what the people say:",
                  font: {
                      size: 20,
                      family: "Patrick Hand"
                  }
              }
          },
          'scales': {
            x: {
                title: { 
                    display: true,
                    text: "Rating",
                    color: "#000",
                    font: {
                        size: 20,
                        family: "Patrick Hand"
                    }
                },
                grid: {
                    display:false
                },
                ticks: {
                    autoSkip: false, // Don't skip ratings when ona  small screen, squeeze em
                    color: "#000",
                    font: {
                        size: 20,
                        family: "Patrick Hand"
                    }
                }
            },
            y: {
                title: {
                    color: "#000",
                    display: true,
                    text: "Number of votes",
                    font: {
                        size: 20,
                        family: "Patrick Hand"
                    }
                },
                grid: {
                    display:false
                },
                ticks: {
                    precision: 0,
                    color: "#000",
                    font: {
                        size: 20,
                        family: "Patrick Hand"
                    }
                }
            }
          }
      }
    };
    chart = new Chart(
        document.getElementById('chart'),
        config
    );
}

nextButton.addEventListener("click", (e) => {
    chart.destroy();
    loadPrompt();
});

// skipButton.addEventListener("click", (e) => {
//     loadPrompt();
// })

copyLinkButton.addEventListener('click', function() {
    gtag('event', 'share');
    navigator.clipboard.writeText("https://www.shesatenbut.org");
});


function updateHeader(gender, defaultRating) {
    header.innerText = `${gender}'s a ${defaultRating} but...`;
}

function loadPrompt() {
    nextButton.style.display = "none";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (JSON.parse(xhttp.responseText).length === 0) {
                voteCompletionMessage.innerText = 
                    "Looks like we're out of questions for you! We're working hard on adding new ones, so check back later."
                document.getElementById("scale").remove();
                nextButton.remove();
                return;
            }
            let data = JSON.parse(xhttp.responseText)[0];
            currentPromptData = data;
            let text = data.text;
            currentPromptId = data.id;
            updateHeader(data.pref, data.defaultrating);
            showVoteButtons();
            //document.getElementById("chart").display = "none";
            prompt.innerText = text;
            updateSeenPromptIds(currentPromptId);
        }
    };
    let url =  `/prompt?pref=${preference}`;
    let seenIds = getSeenPromptIds();
    if (seenIds) {
        url += `&seen=${seenIds}`;
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}
