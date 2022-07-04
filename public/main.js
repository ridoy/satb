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
const header = document.querySelector(".header > h1");
const scale = document.querySelector("#scale");
const prompt = document.querySelector("#prompt > h1");
const welcomeMenu = document.querySelector("#welcome-menu");
const voteMenu = document.querySelector("#vote-menu");
const submissionMenu = document.querySelector("#submission-menu");
const prefButtons = document.querySelectorAll(".preference-button");
const voteButtons = document.querySelectorAll(".vote-button");
const nextButton = document.querySelector(".next-button");
const submissionButton = document.querySelector(".submission-button");

let preference = null;
let currentPromptId = null;
let currentPromptData = null;
let chart = null;

submissionButton.addEventListener("click", (e) => {
    welcomeMenu.style.display = "none";
    submissionMenu.style.display = "block";
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

function showGraph(data, selectedRating) {
    // document.getElementById("chart").display = "block";
    let ratings = [
        '10', '9', '8', '7',
        '6',  '5', '4', '3',
        '2',  '1', '0'
      ];
    let counts = ratings.map((rating) => data[rating]);
    counts[Math.abs(parseInt(selectedRating) - 10)] += 1; // incremenet selected rating to reflect new vote
    console.log(counts);
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
          'reverse': true,
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


function updateHeader(gender, defaultRating) {
    header.innerText = `${gender}'s a ${defaultRating} but...`;
}

function loadPrompt() {
    nextButton.style.display = "none";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(xhttp.responseText)[0];
            currentPromptData = data;
            let text = data.text;
            currentPromptId = data.id;
            updateHeader(data.pref, data.defaultrating);
            showVoteButtons();
            //document.getElementById("chart").display = "none";
            prompt.innerText = text;
        }
    };
    xhttp.open("GET", `/prompt?pref=${preference}`, true);
    xhttp.send();
}
