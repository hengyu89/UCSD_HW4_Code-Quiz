// 4 different pages.
var startPage = document.querySelector('.start-page');
var questionPage = document.querySelector('.question-page');
var summaryPage = document.querySelector('.summary-page');
var scorePage = document.querySelector('.score-page');
startPage.hidden = false;
questionPage.hidden = true;
summaryPage.hidden = true;
scorePage.hidden = true;
var resultArea = document.querySelector('.result-area');
var checkCorrect = document.querySelector('.result');

// buttons (all submit and chooses buttons) and display data (like timer and score)
var timerEl = document.querySelector('.timer-count');       // all pages: top right time left
var startButton = document.querySelector('.start-quiz');    // 1st page: start button
var questionButton = document.querySelector('.answer-area');// 2nd page: 4 chooses buttons
var correctButton = document.querySelector('.qb-correct');
var initialButton = document.querySelector('.submit-score');// 3rd page: submit button
var scoreDisplay = document.querySelector('.total-score');  // 3rd page: Final score
var initialInput = document.querySelector('#initial');      // 3rd page: input area
var scoreList = document.querySelector('#score-list');      // 4th page: score list
var goBackButton = document.querySelector('.go-back');      // 4th page: go back to main page
var clearButton = document.querySelector('.reset-score');   // 4th page: clear all scores.

// Values needed for this quiz.
var timerCount;             // Time left
var questionLeft;           // # of questions in Quiz
var questionScore;          // credit of each question
var totalScore;       // Current score (100 initially)
var scoreboard = [];   // All users data.
var currentUser = {         // current users data
    initial: "",
    score: 0
};
var correctSign = false;
var questionSet = [
    {Q: "1 + 7 = ___.",A1:"6",A2:"8",A3:"9",A4:"7",Correct:2},
    {Q: "70 * 100 = ___.",A1:"700",A2:"70",A3:"70000",A4:"7000",Correct:4},
    {Q: "Today is 3-12, 'yesterday' is: ___.",A1:"3-11",A2:"3-12",A3:"3-13",A4:"3-10",Correct:1},
    {Q: "If you wake up at 7:30, and need to take 14 mins to drive to School, then will you brush your teeth?",A1:"I prefer to drink tea.",A2:"What if I sleep early?",A3:"Of course, for health.",A4:"I'll wake up early.",Correct:3},
    {Q: "If you have a pen and an apple, then _____.",A1:"I have an apple and a pen.",A2:"I'm hungry.",A3:"Do you like apple?",A4:"Apple-pen!",Correct:4},
    {Q: "____ Do you wanna build a snowman?",A1:"Let it go.",A2:"Elsa!",A3:"Bazinga!",A4:"Woooooooo!",Correct:2},
    {Q: "I don't know what else questions I could create,so: ",A1:"Answer 1",A2:"Answer 2",A3:"Answer 3(correct)",A4:"Answer 4",Correct:3}
];
var currentQuestionSet;

function resetValues() {
    currentQuestionSet = [...questionSet];
}

function init() {
    var storedScoreboard = JSON.parse(localStorage.getItem("Scoreboard"));
    if(storedScoreboard !== null) {
        scoreboard = storedScoreboard;
        totalScore = 0;
    } else {
        totalScore = 0;
    }
}

// start the quiz right after click the start button at welcome page.
function startQuiz() {
    // set timer and # of questions and each questions' credit
    timerCount = 60;
    questionLeft = 5;                           // Number of questions this quiz  have.
    questionScore = 100/questionLeft;    // how many credit each question worth
    resultArea.hidden = true;
    // turn to question page right after click the start
    chooseQuestion();
    startPage.hidden = true;
    questionPage.hidden = false;                // go to 2nd page
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
function nextQuestion(event) {
    event.stopPropagation();
    // Turn to the page determined by how many questions left
    if (questionLeft > 1) {
        questionPage.hidden = false;    // Go to question page
        summaryPage.hidden = true;
        resultArea.hidden = false;      // check correction of previous one
        timerCount = timerCount - 10;
        checkCorrect.textContent = "Wrong..."
        chooseQuestion();
    } else {
        scoreDisplay.textContent = totalScore;
        questionPage.hidden = true;
        summaryPage.hidden = false;     // Go to summary page
        clearInterval(timer);
    }

    questionLeft --;
}

function nextCorrectQuestion(event) {
    event.stopPropagation();
    // Turn to the page determined by how many questions left
    if (questionLeft > 1) {
        questionPage.hidden = false;    // Go to question page
        summaryPage.hidden = true;
        resultArea.hidden = false;      // check correction of previous one
        totalScore = totalScore + questionScore;
        checkCorrect.textContent = "Correct!";
        chooseQuestion();
    } else {
        totalScore = totalScore + questionScore;
        scoreDisplay.textContent = totalScore;
        questionPage.hidden = true;
        summaryPage.hidden = false;     // Go to summary page
        clearInterval(timer);
    }

    questionLeft --;
}

function chooseQuestion() {
    var index = Math.floor(Math.random() * currentQuestionSet.length);
    var answerSet = [currentQuestionSet[index].A1, currentQuestionSet[index].A2,currentQuestionSet[index].A3, currentQuestionSet[index].A4];
    var correctIndex = currentQuestionSet[index].Correct - 1;
    document.querySelector(".question-title").textContent = currentQuestionSet[index].Q;
    document.querySelector(".answer-area").innerHTML = "";
    for (var i = 0; i < 4; i++) {
        var currentAnswer = answerSet[i];
        var button = document.createElement("button");
        button.textContent = (i+1) + ". " + currentAnswer;
        if (correctIndex == i) {
            button.setAttribute("class", "qb-correct");
            document.querySelector(".answer-area").appendChild(button);
            document.querySelector(".qb-correct").addEventListener("click", nextCorrectQuestion);
        } else {
            button.setAttribute("class", "qb"+i);
            document.querySelector(".answer-area").appendChild(button);
            document.querySelector(".qb"+i).addEventListener("click", nextQuestion);
        }
    }
    currentQuestionSet.splice(index,1);
}


// read the initial from user and turn to 4th page (scoreboard).
function toScoreboard() {
    currentUser.initial = initialInput.value.trim();

    if (currentUser.initial === "") {
        currentUser.initial = "anonymity";
    }

    currentUser.score = Math.floor(totalScore);
    scoreboard.push(currentUser);
    scoreboard.sort(sortByName);    // sort by name
    scoreboard.sort(sortByScore);   // then sort by score

    writeScoreboard();
    storeScores();

    summaryPage.hidden = true;
    scorePage.hidden = false;
    initialInput.value = "";
}

function writeScoreboard() {
    // Scoreboard stores 5 scores total.
    while(scoreboard.length > 5) {
        scoreboard.pop();
    }

    scoreList.innerHTML = "";
    for (var i = 0; i < scoreboard.length; i++) {
        var currentUserInfo = (i+1) + ". " + scoreboard[i].initial + " - " + scoreboard[i].score;
        var li = document.createElement("li");
        li.textContent = currentUserInfo;
        li.setAttribute("score-index",i);
        if (i%2 == 0) {
            li.classList.add("odd-list");
        }
        scoreList.appendChild(li);

    }
}

function storeScores() {
    localStorage.setItem("Scoreboard", JSON.stringify(scoreboard));
}

function sortByName(a,b) {
    const nameA = a.initial.toUpperCase();
    const nameB = b.initial.toUpperCase();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
}

function sortByScore(a,b) {
    return b.score - a.score;
}

function goBack() {
    startPage.hidden = false;
    questionPage.hidden = true;
    summaryPage.hidden = true;
    scorePage.hidden = true;
    init();
    resetValues();
    currentQuestionSet = [...questionSet];
    timerEl.textContent = 60;
}

function clearScoreboard() {
    scoreboard = [];
    storeScores();
    writeScoreboard();
    var li = document.createElement("li");
    li.textContent = "--";
    li.classList.add("odd-list");
    scoreList.appendChild(li);
}


startButton.addEventListener("click", startQuiz);
initialButton.addEventListener("click", toScoreboard);
goBackButton.addEventListener("click", goBack);
clearButton.addEventListener("click", clearScoreboard);

resetValues();
init();