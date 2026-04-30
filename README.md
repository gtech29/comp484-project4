# Timed Typing Test App

A browser-based typing test application that measures how quickly and accurately a user can type a provided text sample. The timer starts when the user begins typing and stops when the typed text matches the prompt exactly.

## Live Demo

- **GitHub Pages:** https://gtech29.github.io/comp484-project4/
- **GitHub Repository:** https://github.com/gtech29/comp484-project4

## Features

- Starts the timer automatically when the user begins typing.
- Stops the timer when the typed text matches the prompt exactly.
- Provides real-time visual feedback with border colors:
  - **Blue** for correct typing so far.
  - **Orange/Red** when a typo is detected.
  - **Green** when the test is completed successfully.
- Includes a reset button that clears the text area, resets the timer, resets visual feedback, and unlocks the typing area.
- Saves and displays the top three fastest scores using `localStorage`.
- Persists top scores across browser refreshes.
- Randomizes the typing prompt from multiple paragraph options when starting over.
- Displays live performance metrics, including:
  - Words Per Minute (WPM)
  - Error count

## Technologies Used

- HTML5
- CSS3
- JavaScript
- DOM Manipulation
- Event Listeners
- `localStorage`

## How It Works

The app compares the user's current input against the original text in real time. If the typed text matches the beginning of the prompt, the border turns blue. If the typed text no longer matches the prompt, the border changes to the error state. Once the full text matches exactly, the timer stops, the text area becomes read-only, and the final time is saved if it qualifies as one of the top three fastest scores.

Scores are stored in the browser using `localStorage`, so they remain available after refreshing the page.

## Running Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/gtech29/comp484-project4.git
   ```
2. Open the project folder:

   ```bash
   cd comp484-project4
   ```
3. Open `index.html` in a browser.

## Project Structure

```text
comp484-project4/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Author

Juan C Rodriguez - CSUN COMP484
