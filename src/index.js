const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const startButton = document.querySelector('#start');
const playButton = document.querySelector('#playBtn');
const soundFXButton = document.querySelector('#soundFXBtn');
const grid = document.querySelector('.grid');
const score = document.querySelector('#score');
const timerDisplay = document.querySelector('#timer'); 
const clickSound = new Audio("./assets/kiss_sound_short.mp3");
const music = new Audio("./assets/molesong.mp3");

let time = 0;
let timer;
let lastHole = 0;
let points = 0;
let difficulty = "easy";
clickSound.muted = true;

/**
 * Generates a random integer within a range.
 *
 * The function takes two values as parameters that limits the range 
 * of the number to be generated. For example, calling randomInteger(0,10)
 * will return a random integer between 0 and 10. Calling randomInteger(10,200)
 * will return a random integer between 10 and 200.
 *
 */
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Sets the time delay given a difficulty parameter.
 *
 * The function takes a `difficulty` parameter that can have three values: `easy`
 * `normal` or `hard`. If difficulty is "easy" then the function returns a time delay
 * of 1500 milliseconds (or 1.5 seconds). If the difficulty is set to "normal" it should
 * return 1000. If difficulty is set to "hard" it should return a randomInteger between
 * 600 and 1200.
 *
 * Example: 
 * setDelay("easy") //> returns 1500
 * setDelay("normal") //> returns 1000
 * setDelay("hard") //> returns 856 (returns a random number between 600 and 1200).
 *
 */
function setDelay(difficulty) {
  if (difficulty === "easy") {
    return 1500;
  } else if (difficulty === "normal") {
    return 1000;
  } else if (difficulty === "hard") {
    return randomInteger(600, 1200);
  } else {  // default to easy mode if difficulty is not set to one of the three values above.
    return 1500;
  }
}

/**
 * Chooses a random hole from a list of holes.
 *
 * This function should select a random Hole from the list of holes.
 * 1. generate a random integer from 0 to 8 and assign it to an index variable
 * 2. get a random hole with the random index (e.g. const hole = holes[index])
 * 3. if hole === lastHole then pick a different hole
 * 4. if hole is not the same as the lastHole then keep track of 
 * it (lastHole = hole) and return the hole
 *
 * Example: 
 * const holes = document.querySelectorAll('.hole');
 * chooseHole(holes) //> returns one of the 9 holes that you defined
 */
function chooseHole(holes) {
  holeNum = randomInteger(0, 8);
  let hole = holes[holeNum];
  if (hole === lastHole) {  // compares the hole to the lastHole, if they match, choose another
    if (holeNum === 0) { // doing this the simple way without recursion
      hole = holes[8];
      lastHole = hole;
      return hole;
    } else {
      hole = holes[holeNum - 1];
      lastHole = hole;
      return hole;
    }
  } else {
    lastHole = hole;
    return hole;
  }
}

/**
*
* Calls the showUp function if time > 0 and stops the game if time = 0.
*
* The purpose of this function is simply to determine if the game should
* continue or stop. The game continues if there is still time `if(time > 0)`.
* If there is still time then `showUp()` needs to be called again so that
* it sets a different delay and a different hole. If there is no more time
* then it should call the `stopGame()` function. The function also needs to
* return the timeoutId if the game continues or the string "game stopped"
* if the game is over.
*
*  // if time > 0:
*  //   timeoutId = showUp()
*  //   return timeoutId
*  // else
*  //   gameStopped = stopGame()
*  //   return gameStopped
*
*/
function gameOver() {
  if (time > 0) {
    const timeoutID = showUp();
    return timeoutID;
  } else {
    stopGame();
    return "game stopped";
  }
}

/**
*
* Calls the showAndHide() function with a specific delay and a hole.
*
* This function simply calls the `showAndHide` function with a specific
* delay and hole. The function needs to call `setDelay()` and `chooseHole()`
* to call `showAndHide(hole, delay)`.
*
*/
function showUp() {
  let delay = setDelay(difficulty);
  const hole = chooseHole(holes);
  return showAndHide(hole, delay);
}

/**
*
* The purpose of this function is to show and hide the mole given
* a delay time and the hole where the mole is hidden. The function calls
* `toggleVisibility` to show or hide the mole. The function should return
* the timeoutID
*
*/
function showAndHide(hole, delay){

  toggleVisibility(hole); // shows the mole/bird

  const timeoutID = setTimeout(() => {
    toggleVisibility(hole);
    gameOver();
  }, delay);
  return timeoutID;
}

/**
*
* Adds or removes the 'show' class that is defined in styles.css to 
* a given hole. It returns the hole.
*
*/
function toggleVisibility(hole){
  try { // added a try/catch block since this threw and error in early coding
    hole.classList.toggle("show");
  }
  catch (error) {
    console.log(`Caught an error, kiss the bird! ${error}`);
  }
  return hole;
}

/**
*
* This function increments the points global variable and updates the scoreboard.
* Use the `points` global variable that is already defined and increment it by 1.
* After the `points` variable is incremented proceed by updating the scoreboard
* that you defined in the `index.html` file. To update the scoreboard you can use 
* `score.textContent = points;`. Use the comments in the function as a guide 
* for your implementation:
*
*/
function updateScore() {
  points += 1;
  score.textContent = points;
  return points;
}

/**
*
* This function clears the score by setting `points = 0`. It also updates
* the board using `score.textContent = points`. The function should return
* the points.
*
*/
function clearScore() {
  points = 0;
  score.textContent = points;
  return points;
}

/**
*
* Updates the control board with the timer if time > 0
*
*/
function updateTimer() {
  if (time > 0){
    time -= 1;
    timerDisplay.textContent = time;
  }

  return time;
}

/**
*
* Starts the timer using setInterval. For each 1000ms (1 second)
* the updateTimer function get called. This function is already implemented
*
*/
function startTimer() {
  timer = setInterval(updateTimer, 1000);
  return timer;
}

/**
*
* This is the event handler that gets called when a player
* clicks on a mole. The setEventListeners should use this event
* handler (e.g. mole.addEventListener('click', whack)) for each of
* the moles.
*
*/
function whack() {
  updateScore();
  return points;
}

/**
*
* Adds the 'click' event listeners to the moles. See the instructions
* for an example on how to set event listeners using a for loop.
*/
function setEventListeners(){
  moles.forEach(
    mole => mole.addEventListener('click', whack)
  );

  return moles;
}

/**
*
* This function sets the duration of the game. The time limit, in seconds,
* that a player has to click on the sprites.
*
*/
function setDuration(duration) {
  time = duration;
  timerDisplay.textContent = time;
  return time;
}

/**
*
* This function is called when the game is stopped. It clears the
* timer using clearInterval. Returns "game stopped".
*
*/
function stopGame(){
  stopAudio(music);  
  clearInterval(timer);
  startButton.disabled = false;
  
  startButton.textContent = "Start Game";
  return "game stopped";
}

/**
*
* This is the function that starts the game when the `startButton`
* is clicked.
*
*/
function startGame(){
  startButton.disabled = true;
  startButton.textContent = "Game In Progress";
  clearScore();  // clear the score before each game
  setDuration(10);
  showUp();
  startTimer();
  setEventListeners();
  return "game started";
}

startButton.addEventListener("click", startGame);


// Audio feature sections go here

function playAudio(audioObject) {  // plays the audio object
  audioObject.play();
}

function loopAudio(audioObject) { // loops the audio object playback
  audioObject.loop = true;
  playAudio(audioObject);
}

function stopAudio(audioObject) { // stops the audio object playback
  audioObject.pause();
}

function toggleMusic(){ // toggles the music on or off
  if (!music.paused) {
    stopAudio(music);
  } else {
    loopAudio(music);
  }
}

function playClickSound(){ // plays a sound when clicking on the grid
  playAudio(clickSound);
}

function toggleSoundFX(){ // toggles the mouse click sound on or off
  if (clickSound.muted) {
    clickSound.muted = false;
    grid.addEventListener("click", playClickSound);
  } else {
    clickSound.muted = true;
    grid.removeEventListener("click", playClickSound);
  }
}

playButton.addEventListener("click", toggleMusic);
soundFXButton.addEventListener("click", toggleSoundFX);

// Please do not modify the code below.
// Used for testing purposes.
window.randomInteger = randomInteger;
window.chooseHole = chooseHole;
window.setDelay = setDelay;
window.startGame = startGame;
window.gameOver = gameOver;
window.showUp = showUp;
window.holes = holes;
window.moles = moles;
window.showAndHide = showAndHide;
window.points = points;
window.updateScore = updateScore;
window.clearScore = clearScore;
window.whack = whack;
window.time = time;
window.setDuration = setDuration;
window.toggleVisibility = toggleVisibility;
window.setEventListeners = setEventListeners;
