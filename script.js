const board = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const playerNameInput = document.getElementById("playerName");
const leaderboard = document.getElementById("leaderboard");
const modeRadios = document.querySelectorAll("input[name='mode']");

let currentPlayer = "X";
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameMode = "human"; // Default mode

const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

modeRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    gameMode = document.querySelector("input[name='mode']:checked").value;
    resetGame();
  });
});

function handleClick(event) {
  const index = event.target.dataset.index;
  if (gameState[index] !== "" || !gameActive) return;

  clickSound.play();
  makeMove(index, currentPlayer);
  checkResult();

  if (gameMode === "computer" && gameActive && currentPlayer === "O") {
    setTimeout(() => {
      computerMove();
      checkResult();
    }, 500);
  }
}

function makeMove(index, player) {
  gameState[index] = player;
  board[index].textContent = player;
  currentPlayer = player === "X" ? "O" : "X";
}

function computerMove() {
  const emptyCells = gameState
    .map((val, idx) => (val === "" ? idx : null))
    .filter((idx) => idx !== null);
  if (emptyCells.length === 0) return;

  const move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  makeMove(move, "O");
  clickSound.play();
}

function checkResult() {
  let roundWon = false;
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (
      gameState[a] &&
      gameState[a] === gameState[b] &&
      gameState[a] === gameState[c]
    ) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    const winner = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `${winner} Wins!`;
    winSound.play();
    gameActive = false;

    const name = playerNameInput.value || "Player";
    updateLeaderboard(name, winner);
    return;
  }

  if (!gameState.includes("")) {
    statusText.textContent = "Draw!";
    gameActive = false;
    return;
  }

  statusText.textContent = `It's ${currentPlayer}'s Turn`;
}

function resetGame() {
  gameState = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  board.forEach((cell) => (cell.textContent = ""));
  statusText.textContent = "New Game Started!";
}

function updateLeaderboard(name, winner) {
  const scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
  scores.push({ name, winner, time: new Date().toLocaleTimeString() });
  localStorage.setItem("leaderboard", JSON.stringify(scores));
  displayLeaderboard();
}

function displayLeaderboard() {
  leaderboard.innerHTML = "";
  const scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
  scores
    .slice(-5)
    .reverse()
    .forEach((score) => {
      const li = document.createElement("li");
      li.textContent = `${score.name} (${score.winner}) at ${score.time}`;
      leaderboard.appendChild(li);
    });
}

board.forEach((cell) => cell.addEventListener("click", handleClick));
displayLeaderboard();
