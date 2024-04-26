/*
Page is loaded with the first question and the corresponding answers
User clicks a multiple choice answer which can be either right or wrong
The client saves the current question, asnwers, and correct answer
After each question the current question, asnwers, and corecct answer should be updated
And the next questions should loaded into the shadow DOM

If it is correct an animation occurs removing the current question
and displays the next question

If it is wrong an animation occurs highlighting the wrong answer and the user is prompted to guess again

After each selection and post should be made to an endpoint storing the guesses with the right and wrong guesses

When the user reaches the end of the questions a webpage is displayed with the stats and the performance of the user

User is finally prompted to either edit the deck or to review another

CRUD:

A user should be able to make a deck with MCQ, TF, and q cards/ definitions

A user should be able to edit a deck by add/removing/editing questions and answers

A user should be able to delete a deck
*/

// Initalize the JS
document.addEventListener("DOMContentLoaded", init);

const triviaCard = document.getElementsByClassName("trivia-card")[0];
// triviaCard.innerHTML = ""
const question = document.getElementsByClassName("question");
let answers = document.getElementsByClassName("answer-card");
// The requested Deck
let deck;

//Current question of the deck
let currentQuestion;

//The current answers for the current question
let currentAnswers;

//The current correct answer for the current question
let correctAnswer;

//Current stage for the current question
let currentCard;

//List of all the questions
let questions;
let playerMoves = {
  questions: [],
  answers: [],
  results: [],
};
async function init() {
    let back = document.getElementById("back")
    back.onclick = () =>{
        history.back()
    }
  console.log("Page loaded " + window.location.pathname);
  //The deck ID is the last value in the URL
  let requestedDeckID = location.pathname.slice(
    location.pathname.lastIndexOf("/"),
    location.pathname.length + 1
  );
  console.log(requestedDeckID);
  try {
    const response = await fetch("/trivia/data" + requestedDeckID);
    deck = await response.json();
    console.log(deck);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  questions = deck.questions;

  currentCard = 0;
  currentQuestion = questions[currentCard].question;
  currentAnswers = questions[currentCard].answers;
  correctAnswer = questions[currentCard].correctAnswer;

  //Adds the event lstener for the answers for a player move
  let i = 0;
  for (i; i < answers.length; i++) {
    answers[i].addEventListener("click", checkAnswer);
  }

  console.log("Questions: " + questions);
  console.log(currentQuestion);
  console.log(currentAnswers);
  console.log(correctAnswer);
}
function clearTrivia() {
  elements = document.querySelectorAll(".trivia-card");
  elements.forEach((element) => {
    element.style.display = "none";
    // Add more styles as needed
  });
}

//Creates the trivia elements
function createTrivia() {
  // Sets the current stage This needs to be moved once animations are added
  currentCard += 1;
  currentQuestion = questions[currentCard].question;
  currentAnswers = questions[currentCard].answers;
  correctAnswer = questions[currentCard].correctAnswer;

  // Create a div element with class "trivia-card"
  const triviaCard = document.createElement("div");
  triviaCard.className = "trivia-card";
  // triviaCard.style.zIndex = "-1"
  // Create a div element with class "sub-header"
  const subHeader = document.createElement("div");
  subHeader.className = "sub-header";

  // Create a p element for "Multiple Choice"
  const multipleChoice = document.createElement("p");
  multipleChoice.textContent = "Multiple Choice";

  // Create an img element for the right arrow icon
  const rightArrow = document.createElement("img");
  rightArrow.src = "../public/Images/right.svg";
  rightArrow.className = "skip";

  // Append "Multiple Choice" and the right arrow icon to the "sub-header"
  subHeader.appendChild(multipleChoice);
  subHeader.appendChild(rightArrow);

  // Create a p element for the question text
  const question = document.createElement("p");
  question.className = "question";
  question.textContent = currentQuestion;

  // Create a form element with class "answers" and action "./userAnswer"
  const answersForm = document.createElement("form");
  answersForm.className = "answers";
  answersForm.action = "./userAnswer";

  // Create and append input elements for the answer options
  for (let i = 0; i < currentAnswers.length; i++) {
    const answerInput = document.createElement("input");
    answerInput.type = "button";
    answerInput.className = "answer-card";
    answerInput.value = currentAnswers[i];
    answerInput.name = `option${i}`;
    answersForm.appendChild(answerInput);
    // Add click event listener to each answer button
    answerInput.addEventListener("click", checkAnswer);
  }

  // Append the "sub-header", question, and answers form to the "trivia-card"
  triviaCard.appendChild(subHeader);
  triviaCard.appendChild(question);
  triviaCard.appendChild(answersForm);

  // Append the "trivia-card" to the body or any other container element in the DOM
  document.body.appendChild(triviaCard);
}

function checkAnswer() {
  console.log("You Guessed: " + this.value);
  console.log("The correct answer: " + correctAnswer);

  playerMoves.questions.push(currentQuestion)
  playerMoves.answers.push(this.value)
  // If the guess is correct display positive result and store it
  if (this.value == correctAnswer) {
    console.log("Correct");
    playerMoves.results.push(true)
    console.log(playerMoves.results)
  }
  //Otherwise display a negative result
  else {
    playerMoves.results.push(false)
  }
  clearTrivia();
    if (currentCard != questions.length - 1) {
      createTrivia();
    } else {
      console.log("No More Questions");
      console.log(playerMoves)
      console.log(playerMoves.questions)
      console.log(playerMoves.answers)
      console.log(playerMoves.results)
      resultPage()
    }
}
function resultPage() {
    console.log(questions[0].correctAnswer);
    let i = 0;
    for (i; i < playerMoves.answers.length; i++){
        let container = document.createElement("div")
        container.classList.add("qresult")

        let subHeader = document.createElement("h4")
        subHeader.textContent = `${playerMoves.questions[i]}`

        let flex = document.createElement("div")
        flex.className = "flex-container"

        let userGuess = document.createElement("p")
        userGuess.textContent = `You Guessed: ${playerMoves.answers[i]}`
        let userResult = document.createElement("p")
        userResult.textContent = `Correct Answer: ${questions[i].correctAnswer}`

        if (playerMoves.answers[i] == questions[i].correctAnswer){
            container.setAttribute("data-result", "correct")
        }
        else{
            container.setAttribute("data-result", "incorrect")
        }

        flex.appendChild(userGuess)
        flex.appendChild(userResult)
        container.appendChild(subHeader)
        container.appendChild(flex)
        document.body.appendChild(container)
    }
    let returnHome = document.createElement("input")
    returnHome.type = "button"
    returnHome.value = "Go Back"
    returnHome.onclick = () =>{
        history.back()
    }
    document.body.appendChild(returnHome)

}
