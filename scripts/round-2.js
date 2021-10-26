// ROUND 2 - identical to round-1.js except for importing scores from hash in URL, different question lookup array, and that it redirects to final jeopardy
// this could eventually be refactored to eliminate redundancies in the two files

// grab turn element display from html
let turnElement = document.getElementById("turn");

// set initial turn / define variable for it
let turn = 1;

// display turn
turnElement.textContent = turn;

// define global variable for correct & incorrect answers
let correctAnswer = false;

let textInput = document.getElementById("text-box");

// storing guess and pass buttons
let guessButton = document.getElementById("guess");
let passButton = document.getElementById("pass");

// getting score display elements, assigning them values of 0
let pOneScore = document.getElementById("score-p1");
let pTwoScore = document.getElementById("score-p2");

// take scores from URL
let urlHash = window.location.hash;
// processing to separate the two scores
let hashArray = urlHash.split("");
hashArray.shift();
hashArray = hashArray.join("").split("&");

// setting and displaying scores from last round
let pOne = Number(hashArray[0]);
let pTwo = Number(hashArray[1]);
pOneScore.textContent = pOne;
pTwoScore.textContent = pTwo;

// get grid container and store in boardCollection
let boardCollection = document.getElementById("board");

let cardClicked = false;

// get variable for guess or pass alert display
let guessPass = document.getElementById("guess-pass");

// define question timer interval so variable is global
let intervalId;

// create array of questions
let questions = [
  {
    id: "1",
    value: 200,
    question: "$200 question",
    answer: "$200 answer",
    used: false,
  },
  {
    id: "2",
    value: 400,
    question: "$400 question",
    answer: "$400 answer",
    used: false,
  },
  {
    id: "3",
    value: 600,
    question: "$600 question",
    answer: "$600 answer",
    used: false,
  },
  {
    id: "4",
    value: 800,
    question: "$800 question",
    answer: "$800 answer",
    used: false,
  },
  {
    id: "5",
    value: 1000,
    question: "$1000 question",
    answer: "$1000 answer",
    used: false,
  },
];

// create global variable for passButton callback function
let passEvt;

// create global variable for guessButton callback function
let guessEvt;

// create counter to see if board is cleared (game will redirect to next round if it reaches 30)
let boardCount = 0;

// set 5 min round timer, & upon finishing redirect to round 2 page
roundTimer(300, "final-jeopardy");

// call play function
play();

function play() {
  // remove old event listeners to prevent stacking during recursion
  guessButton.removeEventListener("click", guessEvt);
  passButton.removeEventListener("click", passEvt);

  // disabling guess and pass buttons
  if (cardClicked === false) {
    guessButton.disabled = true;
    passButton.disabled = true;
    guessPass.textContent = " ";
  }

  // reset text input display
  textInput.value = "";

  // add event listeners to all items in grid container
  boardCollection.addEventListener("click", function boardClick(evt) {
    // store & parse id's of board items
    let itemId = evt.target.id.split("");
    let currentCard = document.getElementById(evt.target.id);
    let itemIdNumber = Number(itemId[0] - 1);

    // if condition to exclude categories from function actions
    if (itemId[1] === "-") {
      cardClicked = true;
      // remove all event listeners after click
      boardCollection.removeEventListener("click", boardClick);

      // change card styling to display question
      currentCard.textContent = questions[itemIdNumber].question;
      currentCard.style.fontFamily = "serif";
      currentCard.style.fontSize = "1em";
      currentCard.style.color = "white";

      guessButton.disabled = false;
      passButton.disabled = false;
      guessPass.textContent = "Select guess or pass to continue";

      // Start question timer here
      questTimer(5, currentCard, itemIdNumber);

      // create an event listener for the pass button, assign its callback to passEvt variable
      passButton.addEventListener(
        "click",
        (passEvt = function passEvent(evt) {
          evt.preventDefault();

          //change turn (also clears timer interval)
          changeTurn();

          // Restart question timer
          questTimer(5, currentCard, itemIdNumber);
        })
      );

      // create an event listener for the guess button
      guessButton.addEventListener(
        "click",
        (guessEvt = function guessEvent(evt) {
          evt.preventDefault();

          // logic for guessing
          // if correct
          if (textInput.value === questions[itemIdNumber].answer) {
            correct(questions[itemIdNumber].value, currentCard);

            // if incorrect
          } else {
            subtractScore(questions[itemIdNumber].value);

            // switch players
            changeTurn();
            guessButton.removeEventListener("click", guessEvt);

            // restart question timer
            questTimer(5, currentCard, itemIdNumber);

            // give other player a chance to answer incorrectly answered question
            guessButton.addEventListener(
              "click",
              (guessEvt = function guessEvent(evt) {
                // if correct
                if (textInput.value === questions[itemIdNumber].answer) {
                  correct(questions[itemIdNumber].value, currentCard);
                  // if incorrect
                } else {
                  // return card to original styling
                  currentCard.textContent = "$" + questions[itemIdNumber].value;
                  currentCard.style.fontFamily = "Oswald";
                  currentCard.style.color = "goldenrod";
                  currentCard.style.fontSize = "2.5em";

                  // disable guess and pass buttons
                  guessButton.disabled = "true";
                  passButton.disabled = "true";
                  guessPass.textContent = " ";

                  // change turn
                  changeTurn();

                  // restart play function
                  play();
                }
                // Reset question timer here
              })
            );
          }
        })
      );
    } // end category exclusion clause
  }); // end event listener
} // end of play function

// score adding function
function score(amount) {
  if (turn == 1) {
    pOne += amount;
  } else if (turn == 2) {
    pTwo += amount;
  }
  pOneScore.textContent = pOne;
  pTwoScore.textContent = pTwo;
}

// score subtracting function
function subtractScore(amount) {
  if (turn == 1) {
    pOne -= amount;
  } else if (turn == 2) {
    pTwo -= amount;
  }
  pOneScore.textContent = pOne;
  pTwoScore.textContent = pTwo;
}

// function to change turns
function changeTurn() {
  // clear question timer interval
  clearInterval(intervalId);

  // change turn
  if (turn == 1 || turn == "1") {
    turn = 2;
  } else {
    turn = 1;
  }
  // set turn indicator
  turnElement.textContent = turn;
}

// function for correct answer logic
function correct(amount, activeCard) {
  clearInterval(intervalId);
  // update score
  score(amount);

  // change card styling
  activeCard.style.backgroundColor = "black";
  activeCard.textContent = "";

  // remove id from card to exclude it from next iteration
  activeCard.id = null;

  cardClicked = false;

  // increment count of finished cards on board
  boardCount++;

  // clear question timer interval
  clearInterval(intervalId);

  // change round if all cards are selected
  if (boardCount >= 30) {
    changeRound("final-jeopardy");
  } else {
    // call play() again
    play();
  }
}

// define round change function
function changeRound(newRound) {
  // create url with target round and player scores
  window.location = `/${newRound}.html#` + pOne + "&" + pTwo;
}

// define round timer function
function roundTimer(length, nextRound) {
  let roundId = setInterval(tick, 1000);

  function tick() {
    length -= 1;
    if (length === 0) {
      clearInterval(roundId);

      // NAVIGATE TO NEXT PAGE
      changeRound(nextRound);
    }
  }
}

// define question timer function (CONTAINS VARIABLE SHADOWING)
function questTimer(length, currentCard, itemIdNumber) {
  intervalId = setInterval(tick, 1000);

  function tick() {
    length -= 1;
    if (length === 0) {
      window.alert("Player " + turn + " ran out of time!");

      clearInterval(intervalId);

      // return card to original styling
      currentCard.textContent = "$" + questions[itemIdNumber].value;
      currentCard.style.fontFamily = "Oswald";
      currentCard.style.color = "goldenrod";
      currentCard.style.fontSize = "2.5em";

      // disable guess and pass buttons
      guessButton.disabled = "true";
      passButton.disabled = "true";
      guessPass.textContent = " ";

      // remove event listeners
      guessButton.removeEventListener("click", guessEvt);
      passButton.removeEventListener("click", passEvt);

      // change turn, reset
      changeTurn();

      play();
    }
  }
}
