"use strict";

const playGameButton1 = document.getElementById("play-game-btn1");
const playGameButton2 = document.getElementById("play-game-btn2");
const newGameButton = document.getElementById("new-game-btn");
const gameCells = document.querySelectorAll(".cell");
const gameGrid = document.getElementById("tic-tac-toe-grid");
const modalWindow = document.querySelector(".win-or-lose");
const winnerOrLoserText = document.querySelector(".human-or-comp");
const playAgainButton = document.getElementById("play-again");
const goFirst = "X";
const goSecond = "O";
const goFirstComputer = "X";
const goSecondHuman = "O";
const winningCombos = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [7, 5, 3],
];

let currentPlayer;
let gameBoard = [];

playGameButton1.addEventListener("click", playGame);
playGameButton2.addEventListener("click", playGame2);
playAgainButton.addEventListener("click", resetGame);

function resetGame() {
  modalWindow.style.visibility = "hidden";
  gameGrid.style.opacity = "0.2";
  playGameButton1.style.opacity = "1.0";
  playGameButton2.style.opacity = "1.0";
  gameBoard = Array.from(Array(10).keys());
  for (let i = 0; i < gameCells.length; i++) {
    gameCells[i].innerText = "";
    gameCells[i].style.color = "#07748a";
    gameCells[i].removeEventListener("click", someoneIsClicking);
    gameCells[i].removeEventListener("click", someoneIsClicking2);
  }

  playGameButton1.addEventListener("click", playGame);
  playGameButton2.addEventListener("click", playGame2);
}

//After clicking go 1st or go 2nd, the game squares are assigned an index via the Array.from and for loop
function playGame() {
  gameGrid.style.opacity = "1.0";
  playGameButton1.style.opacity = "0.2";
  playGameButton2.style.opacity = "0.2";
  playGameButton2.removeEventListener("click", playGame2);
  gameBoard = Array.from(Array(10).keys());
  console.log(gameBoard);
  for (let i = 0; i < gameCells.length; i++) {
    gameCells[i].innerText = "";
    gameCells[i].addEventListener("click", someoneIsClicking, false);
  }
}

// function to get the squareID
function someoneIsClicking(square) {
  console.log(square.target.id);
  if (
    typeof gameBoard[square.target.id] === "number" &&
    !checkIfGameOver(gameBoard, goFirst)
  ) {
    theTurn(square.target.id, goFirst);
    let gameWon = checkIfGameOver(gameBoard, goFirst);
    if (!checkTie() && !gameWon) {
      setTimeout(() => {
        theTurn(bestSpot(), goSecond);
      }, 500);
    }
  }
  console.log("Remaining square indexes in game board:", emptySquares());
  if (checkTie()) {
    console.log("Tie condition detected. Game over.");
    gameOver(null, true);
  }
}

// function to populate the correct square with the "X" from the go first button
function theTurn(squareID, player) {
  gameBoard[squareID] = player;
  document.getElementById(squareID).innerText = player;
  let gameWon = checkIfGameOver(gameBoard, player);
  if (gameWon) gameOver(gameWon);
}

function checkIfGameOver(board, player) {
  /* this line of code below utilizes the reduce method. It goes through every element of
the board array and gives back one single value. The accumulator has been initialized
to an empty array. element is each element in the board array, and
index is its index place. So, if the element is equal to the player, then we add the accumulator
index to the array. If the element does not equal the player, then we return the 
accumulator as it was */
  let plays = board.reduce(
    (accumulator, element, index) =>
      element === player ? accumulator.concat(index) : accumulator,
    []
  );
  let gameWon = null;
  /* a "for of" loop to loop through every possible winning combination. It checks the index of the 
winning combinations variable AND the winning numbers */
  for (let [index, win] of winningCombos.entries()) {
    /* Has the player played in every spot that counts as a win? Code below checks for that */
    if (win.every((element) => plays.indexOf(element) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

/* A "for of" loop to see if any of the winning conditions have been met, 
if so, change the fontcolor. Then, remove the ability to click on any more squares */
function gameOver(gameWon, isTie) {
  if (!isTie) {
    for (let index of winningCombos[gameWon.index]) {
      document.getElementById(index).style.color =
        gameWon.player == goFirst ? "gold" : "gold";
    }
  }

  for (let i = 0; i < gameCells.length; i++) {
    gameCells[i].removeEventListener("click", someoneIsClicking, false);
  }

  playGameButton1.removeEventListener("click", playGame);
  setTimeout(function () {
    let winnerText = "";
    if (isTie) {
      winnerText = "Neither of you";
    } else if (gameWon.player === goSecond) {
      winnerText = "The computer";
    } else if (gameWon.player === goFirst) {
      winnerText = "You";
    }

    winnerOrLoserText.textContent = `${winnerText} won the game!`;
    modalWindow.style.visibility = "visible";
    gameGrid.style.opacity = "0.2";
    playGameButton1.style.opacity = "0.2";
    playGameButton2.style.opacity = "0.2";
  }, 1000);
  throw new Error("a bandaid ass solution, god help me");
}

function emptySquares() {
  return gameBoard.filter((s) => typeof s === "number");
}

function bestSpot() {
  return emptySquares()[1];
}

function bestSpot2() {
  return emptySquares()[3];
}

function checkTie() {
  if (emptySquares().length === 1) {
    for (let i = 0; i < gameCells.length; i++) {
      gameCells[i].removeEventListener("click", someoneIsClicking, false);
    }

    return true;
  }
  return false;
}

function playGame2() {
  gameGrid.style.opacity = "1.0";
  playGameButton1.style.opacity = "0.2";
  playGameButton2.style.opacity = "0.2";
  gameBoard = Array.from(Array(10).keys());
  console.log(gameBoard);
  playGameButton1.removeEventListener("click", playGame);
  for (let i = 0; i < gameCells.length; i++) {
    gameCells[i].innerText = "";
    gameCells[i].addEventListener("click", someoneIsClicking2);
  }
  setTimeout(() => {
    theTurn2(bestSpot2(), goFirstComputer);
  }, 500);
}

function someoneIsClicking2(square) {
  console.log(square.target.id);
  if (
    typeof gameBoard[square.target.id] === "number" &&
    !checkIfGameOver(gameBoard, goSecondHuman)
  ) {
    theTurn2(square.target.id, goSecondHuman);
    let gameWon = checkIfGameOver(gameBoard, goSecondHuman);
    if (!checkTie2() && !gameWon) {
      setTimeout(() => {
        theTurn2(bestSpot2(), goFirstComputer);
      }, 500);
    }
  }

  if (checkTie2()) {
    gameOver2(null, true);
  }
}

function theTurn2(squareID, player) {
  gameBoard[squareID] = player;
  document.getElementById(squareID).innerText = player;
  let gameWon = checkIfGameOver(gameBoard, player);
  if (gameWon) gameOver2(gameWon);
}

function gameOver2(gameWon, isTie) {
  if (!isTie) {
    for (let index of winningCombos[gameWon.index]) {
      document.getElementById(index).style.color =
        gameWon.player == goFirstComputer ? "gold" : "gold";
    }
  }

  for (let i = 0; i < gameCells.length; i++) {
    gameCells[i].removeEventListener("click", someoneIsClicking2, false);
  }

  playGameButton2.removeEventListener("click", playGame2);
  setTimeout(function () {
    let winnerText = "";
    if (isTie) {
      winnerText = "Neither of you";
    } else if (gameWon.player === goFirstComputer) {
      winnerText = "The computer";
    } else if (gameWon.player === goSecondHuman) {
      winnerText = "You";
    }

    winnerOrLoserText.textContent = `${winnerText} won the game!`;
    modalWindow.style.visibility = "visible";
    gameGrid.style.opacity = "0.2";
    playGameButton1.style.opacity = "0.2";
    playGameButton2.style.opacity = "0.2";
  }, 1000);
  throw new Error("a bandaid ass solution, god help me");
}

function checkTie2() {
  if (emptySquares().length === 2) {
    for (let i = 0; i < gameCells.length; i++) {
      gameCells[i].removeEventListener("click", someoneIsClicking2, false);
    }

    return true;
  }
  return false;
}
