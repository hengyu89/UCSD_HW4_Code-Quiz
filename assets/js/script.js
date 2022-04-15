// 4 different pages.
var startPage = document.querySelector('.start-page');
var questionPage = document.querySelector('.question-page');
var summaryPage = document.querySelector('.summary-page');
var scorePage = document.querySelector('.score-page');
startPage.hidden = false;
questionPage.hidden = true;
summaryPage.hidden = true;
scorePage.hidden = true;

// buttons (all submit and chooses buttons) and display data (like timer and score)
var timerEl = document.querySelector('.timer-count');       // all pages: top right time left
var startButton = document.querySelector('.start-quiz');    // 1st page: start button
var questionButton = document.querySelector('.answer-area');// 2nd page: 4 chooses buttons
var initialButton = document.querySelector('.submit-score');// 3rd page: submit button
var scoreDisplay = document.querySelector('.total-score');  // 3rd page: Final score
var initialInput = document.querySelector('#initial');      // 3rd page: input area
var scoreList = document.querySelector('#score-list');      // 4th page: score list

// Values needed for this quiz.
var timerCount;             // Time left
var questionLeft;           // # of questions in Quiz
var questionScore;          // credit of each question
var totalScore = 80;       // Current score (100 initially)
var scoreboard = [];   // All users data.
var currentUser = {         // current users data
    initial: "",
    score: 0
};
console.log(currentUser);
function init() {
    var storedScoreboard = JSON.parse(localStorage.getItem("Scoreboard"));
    if(storedScoreboard !== null) {
        scoreboard = storedScoreboard;
    }
}

// start the quiz right after click the start button at welcome page.
function startQuiz() {
    // set timer and # of questions and each questions' credit
    timerCount = 60;
    questionLeft = 5;   // Number of questions this quiz  have.
    questionScore = totalScore/questionLeft; // how many credit each question worth
    // turn to question page right after click the start
    startPage.hidden = true;
    questionPage.hidden = false;
    // start tik-tok.
    startTimer();
}

// Timer to tik-tok
function startTimer() {
    timer = setInterval(function() {
        // tik-tok the timer and show on the top-right.
        timerCount --;
        timerEl.textContent = timerCount;
        // Time out when count to 0
        if (timerCount === 0) {
            clearInterval(timer);
            turnScorePage();
        }
    }, 1000)
}

// Turn to the summary score page, and wait for user to write initial name for scoreboard.
function turnScorePage() {
    scoreDisplay.textContent = totalScore;
    startPage.hidden = true;
    questionPage.hidden = true;
    summaryPage.hidden = false;
    scorePage.hidden = true;
}

// switch questions, and turn to summary after answering 5 questions.
function nextQuestion() {
    // Turn to the page determined by how many questions left
    if (questionLeft > 1) {
        questionPage.hidden = false;
        summaryPage.hidden = true;
    } else {
        scoreDisplay.textContent = totalScore;
        questionPage.hidden = true;
        summaryPage.hidden = false;
        clearInterval(timer);
        chooseQuestion();
    }

    console.log(questionLeft);
    questionLeft --;
}

// read the initial from user and turn to 4th page (scoreboard).
function toScoreboard() {
    currentUser.initial = initialInput.value.trim();

    if (currentUser.initial === "") {
        currentUser.initial = "anonymity";
    }
    currentUser.score = Math.floor(totalScore);
    console.log(currentUser);
    scoreboard.push(currentUser);
    console.log(scoreboard)
    // test
    console.log("before sort: "+JSON.stringify(scoreboard));
    // finish test
    scoreboard.sort(compareByScore);
    // test
    console.log("after sort: "+JSON.stringify(scoreboard));
    console.log('length: '+scoreboard.length);
    // finish test

    // Scoreboard stores 5 scores total.
    while(scoreboard.length > 5) {
        scoreboard.pop();
    }

    scoreList.innerHTML = "";
    for (var i = 0; i < scoreboard.length; i++) {
        var currentUserInfo = i + ". " + scoreboard[i].initial + " - " + scoreboard[i].score;
        console.log(currentUserInfo);
        var li = document.createElement("li");
        li.textContent = currentUserInfo;
        li.setAttribute("score-index",i);
        if (i%2 == 0) {
            li.classList.add("odd-list");
            console.log("this works at:",i);
        }
        scoreList.appendChild(li);

    }
    storeScores();

    summaryPage.hidden = true;
    scorePage.hidden = false;
}

function storeScores() {
    localStorage.setItem("Scoreboard", JSON.stringify(scoreboard));
}

function compareByScore(a,b) {
    return b.score - a.score;
}


startButton.addEventListener("click", startQuiz);
questionButton.addEventListener("click", nextQuestion);
initialButton.addEventListener("click", toScoreboard);

init();