// getting score display elements, assigning them values of 0
let pOneScore = document.getElementById("score-p1");
let pTwoScore = document.getElementById("score-p2");

// take scores from URL, separate player scores and display them (same as round-2.js logic for this)
let urlHash = window.location.hash
let hashArray = urlHash.split("")
hashArray.shift()
hashArray = hashArray.join("").split("&")
let pOne = Number(hashArray[0])
let pTwo = Number(hashArray[1])
pOneScore.textContent = pOne;
pTwoScore.textContent = pTwo;

// grab turn element display from html
let turnElement = document.getElementById("turn");

// set initial turn / define variable for it
let turn = 1;

// display turn
turnElement.textContent = turn;

// defining variables for final question and final answer
let finalQuestion = document.getElementById('final-question')
let finalAnswer = 'final jeopardy answer'

// defining variables for player wagers
let wagerOne = 0;
let wagerTwo = 0; 

// variables for player answers
let answerOne = ""
let answerTwo = ""

// getting input and submit elements from html 
let userInput = document.getElementById('user-input')
let submitButton = document.getElementById('guess')

// add event listener to submit button
submitButton.addEventListener('click', function wagerP1(evt) {
    evt.preventDefault()

    // set player one wager
    wagerOne = Number(userInput.value)

    // clear input, change turn, remove event listener
    userInput.value = ''
    changeTurn()
    submitButton.removeEventListener('click', wagerP1)

    // listener for player 2 wager
    submitButton.addEventListener('click', function wagerP2(evt) {
        evt.preventDefault()

        // set wager
        wagerTwo = Number(userInput.value)
        userInput.value = ''
        submitButton.removeEventListener('click', wagerP2)
        changeTurn()

        // change text to display final jeopardy question 
        finalQuestion.textContent = 'The answer to this final jeopardy placeholder question is "final jeopardy answer."'

        // change input placeholder to ask for answer
        userInput.setAttribute('placeholder', 'Enter your answer...')

        // listener for player 1 answer
        submitButton.addEventListener('click', function answerP1() {
            evt.preventDefault()

            // set p1 answer
            answerOne = userInput.value
            userInput.value = ""
            submitButton.removeEventListener('click', answerP1)
            changeTurn()

            // listener for p2 answer
            submitButton.addEventListener('click', function answerP2() {
                evt.preventDefault()

                // set answer
                answerTwo = userInput.value
                userInput.value = ""
                submitButton.removeEventListener('click', answerP2)

                // convert wagers to numbers
                wagerOne = Number(wagerOne)
                wagerTwo = Number(wagerTwo)

                // adding or subtracting wagers from player scores
                if (answerOne == finalAnswer) {
                    pOne += wagerOne
                } else if (answerOne != finalAnswer) {
                    pOne -= wagerOne
                }

                if (answerTwo == finalAnswer) {
                    pTwo += wagerTwo
                } else if(answerTwo != finalAnswer) {
                    pTwo -= wagerTwo
                }

                // displaying final scores
                pOneScore.textContent = pOne;
                pTwoScore.textContent = pTwo;

                // calculating and announcing winner
                if(pOne > pTwo) {
                    finalQuestion.textContent = "Player 1 Wins!"
                    window.alert('Player 1 wins. Thanks for playing Jeopardy!')
                } else if(pTwo > pOne) {
                    finalQuestion.textContent = "Player 2 Wins!"
                    window.alert('Player 2 wins. Thanks for playing Jeopardy!')
                } else {
                    finalQuestion.textContent = "It's a draw!"
                    window.alert('It\'s a draw. Thanks for playing Jeopardy!')
                }

                // disable submit button at end of game
                submitButton.disabled = true;
            })

        })


    })
})

// change turn function
function changeTurn() {
    // change turn
    if (turn == 1 || turn == "1") {
      turn = 2;
    } else {
      turn = 1;
    }
    // set turn indicator
    turnElement.textContent = turn;
  }
