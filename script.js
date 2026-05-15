const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originTextElement = document.querySelector("#origin-text p");
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");

// Keep track of the score display elements:
const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");
const score3 = document.getElementById("score3");

// Store the score elements in an array so we can update them with a loop:
const scoreElements = [score1, score2, score3];

// Keep track of the performance display elements:
const wpmDisplay = document.getElementById("wpm");
const errorDisplay = document.getElementById("errors");

// Paragraphs used for random text selection:
const paragraphs = [
  "The quick brown fox jumps over the lazy dog.",
  "JavaScript makes websites interactive and fun to build.",
  "Typing accurately is more important than typing quickly.",
  "Practice every day to improve your speed and confidence.",
  "Clean code is easier to read, debug, and maintain.",
];

// This will hold the current text the user needs to type:
let originText = "";

// Run a standard minute/second/hundredths timer:

// Load saved scores from localStorage.
// If no scores exist yet, start with an empty array.
const savedScores = localStorage.getItem("typingScores");
let scores = savedScores ? JSON.parse(savedScores) : [];

let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;
let isFinished = false;

// Error tracking:
let errorCount = 0;
let isCurrentlyInError = false;

// Pick a random paragraph and place it on the page:
function setRandomParagraph() {
  const randomIndex = Math.floor(Math.random() * paragraphs.length);

  originText = paragraphs[randomIndex];
  originTextElement.textContent = originText;
}

// Format milliseconds into MM:SS:HHundredths:
// function formatTime(time) {
//   let minutes = Math.floor(time / (1000 * 60));
//   let seconds = Math.floor((time / 1000) % 60);
//   let hundredths = Math.floor((time % 1000) / 10);

//   // Add leading zero to numbers 9 or below (purely for aesthetics):
//   minutes = String(minutes).padStart(2, "0");
//   seconds = String(seconds).padStart(2, "0");
//   hundredths = String(hundredths).padStart(2, "0");

//   return `${minutes}:${seconds}:${hundredths}`;
// }

// Add a leading zero if the number is a single digit.
function addLeadingZero(number) {
  if (number < 10) {
    return "0" + number;
  }

  return String(number);
}

// Format milliseconds into MM:SS:HHundredths.
function formatTime(time) {
  let minutes = Math.floor(time / (1000 * 60));
  let seconds = Math.floor((time / 1000) % 60);
  let hundredths = Math.floor((time % 1000) / 10);

  minutes = addLeadingZero(minutes);
  seconds = addLeadingZero(seconds);
  hundredths = addLeadingZero(hundredths);

  return `${minutes}:${seconds}:${hundredths}`;
}

// Display the top three scores on the page:
function displayScores() {
  scoreElements.forEach((scoreElement, index) => {
    if (scores[index] !== undefined) {
      scoreElement.textContent = formatTime(scores[index]);
    } else {
      scoreElement.textContent = "---";
    }
  });
}

// Save a new score, sort the scores, and keep only the top three:
function saveScore(finalTime) {
  scores.push(finalTime);

  // Smaller time is better, so sort from fastest to slowest:
  scores.sort((a, b) => a - b);

  // Keep only the top three fastest scores:
  scores = scores.slice(0, 3);

  // Save the updated scores array into localStorage:
  localStorage.setItem("typingScores", JSON.stringify(scores));

  // Refresh the scores shown on the page:
  displayScores();
}

// Calculate and display WPM:
function updateWPM() {
  const totalCharacters = testArea.value.length;
  const totalSeconds = elapsedTime / 1000;

  if (totalSeconds === 0) {
    wpmDisplay.textContent = "0";
    return;
  }

  const wpm = Math.round(totalCharacters / 5 / (totalSeconds / 60));
  wpmDisplay.textContent = wpm;
}

// Display the current error count:
function updateErrorCount() {
  errorDisplay.textContent = errorCount;
}

// Start the timer:
function stop() {
  if (isRunning) {
    clearInterval(timer);
    isRunning = false;
    timer = null;
  }
}

// Reset everything:
function reset() {
  clearInterval(timer);

  startTime = 0;
  elapsedTime = 0;
  isRunning = false;
  isFinished = false;
  timer = null;

  errorCount = 0;
  isCurrentlyInError = false;

  theTimer.textContent = "00:00:00";
  testArea.value = "";
  testArea.readOnly = false;

  testWrapper.classList.remove("correct", "error", "finished");

  // Pick a new paragraph every time the user starts over:
  setRandomParagraph();

  // Reset the performance numbers:
  updateWPM();
  updateErrorCount();
}

function update() {
  const currentTime = Date.now();
  elapsedTime = currentTime - startTime;

  theTimer.textContent = formatTime(elapsedTime);
  updateWPM();
}

// Set up the page when it first loads:
setRandomParagraph();
displayScores();
updateWPM();
updateErrorCount();

// Event listeners for keyboard input and the reset button:
testArea.addEventListener("input", function startTimer() {
  const typedText = testArea.value;

  if (typedText === "") {
    testWrapper.classList.remove("error", "correct", "finished");
    isCurrentlyInError = false;
    updateWPM();
    return;
  }

  if (!isRunning && !isFinished) {
    startTime = Date.now() - elapsedTime;
    timer = setInterval(update, 10);
    isRunning = true;
  }

  if (typedText === originText && !isFinished) {
    // Get the most accurate final time before stopping:
    elapsedTime = Date.now() - startTime;
    theTimer.textContent = formatTime(elapsedTime);
    updateWPM();

    stop();

    // Save the completed time to localStorage:
    saveScore(elapsedTime);

    testWrapper.classList.add("finished");
    testWrapper.classList.remove("correct", "error");

    isFinished = true;
    isCurrentlyInError = false;
    testArea.readOnly = true;

    return;
  }

  if (originText.startsWith(typedText)) {
    testWrapper.classList.add("correct");
    testWrapper.classList.remove("error", "finished");
    isCurrentlyInError = false;
  } else {
    testWrapper.classList.add("error");
    testWrapper.classList.remove("correct", "finished");

    // Count a mistake only when the user first enters an error state:
    if (!isCurrentlyInError) {
      errorCount++;
      updateErrorCount();
      isCurrentlyInError = true;
    }
  }

  updateWPM();
});

resetButton.addEventListener("click", () => {
  reset();
});
