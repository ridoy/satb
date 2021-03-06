console.log("Script loaded");

const leaderboard = document.querySelector("#leaderboard");
const leaderboardButtons = document.querySelectorAll(".leaderboard-button");
const homeButton = document.querySelector(".home-button");

homeButton.addEventListener("click", (e) => {
    window.location.href = "/";
})

leaderboardButtons.forEach((button) => {
    button.addEventListener("click", function(e) {
        let selectedButton = document.querySelector(".button-selected");
        selectedButton.classList.remove("button-selected");
        e.target.classList += " button-selected";
        let value = e.target.value;
        if (!value) {
            return; // TODO error
        }
        let values = {
            "he0": ["he", "0"],
            "he10": ["he", "10"],
            "she0": ["she", "0"],
            "she10": ["she", "10"],
            "he100": ["he", "100"],
            "she100": ["she", "100"]
        };
        let gender = values[value][0];
        let rating = values[value][1];
        if (!gender || !rating) {
            return; // TODO error
        }
        getAndShowLeaderboard(gender, rating);
    })
});

function getAndShowLeaderboard(gender, rating) {
    gtag('event', 'showLeaderboard', {
        'event_label': `gender: ${gender}, rating: ${0}`
    })
    let data = getLeaderboard(gender, rating)
        .then((data) => {
            showLeaderboard(data, rating);
        });
}

function getLeaderboard(gender, rating) {
    return new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let data = JSON.parse(xhttp.responseText);
                if (data.length > 0) {
                    resolve(data);
                } else {
                    // TODO handle error
                }
            } else if (this.status == 400) {
                // TODO handle error
            }
        };
        xhttp.open("GET", `/leaderboard?pref=${gender}&rating=${rating}`, true);
        xhttp.send();
    })
}

function showLeaderboard(data, rating) {
    let oldLeaderboardItems = document.querySelectorAll(".leaderboard-item");
    oldLeaderboardItems.forEach(item => item.remove());
    // create els and inject
    for (let row of data) {
        let leaderboardItem = document.createElement('div');
        let leaderboardItemPrompt = document.createElement('span');
        let leaderboardItemVoteCount = document.createElement('span');
        leaderboardItemPrompt.innerText = `${(row.pref == "he") ? "He" : "She"}'s a ${row.defaultrating} but ${row.text}`;
        leaderboardItemVoteCount.innerText = `${row.count} people voted ${rating}`;
        leaderboardItemVoteCount.classList += " leaderboard-item-vote-count";
        leaderboardItem.appendChild(leaderboardItemPrompt);
        leaderboardItem.appendChild(leaderboardItemVoteCount);
        leaderboardItem.setAttribute("class", "leaderboard-item");
        leaderboard.appendChild(leaderboardItem);
    }
}

getAndShowLeaderboard("he", "0");