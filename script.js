const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
const xScoreEl = document.getElementById("xScore");
const oScoreEl = document.getElementById("oScore");
const twoPlayerBtn = document.getElementById("twoPlayerBtn");
const aiBtn = document.getElementById("aiBtn");

let cells = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;
let vsAI = false;
let scores = { X: 0, O: 0 };

function createBoard() {
  board.innerHTML = "";
  cells.fill("");
  gameActive = true;
  currentPlayer = "X";
  statusText.textContent = (`Player ${currentPlayer}'s Turn`);

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", cellClick);
    board.appendChild(cell);
  }
}

function cellClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || cells[index] !== "") return;

  cells[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  checkWinner();

  if (vsAI && gameActive && currentPlayer === "O") {
    setTimeout(aiMove, 500);
  }
}

function checkWinner() {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  for (let pattern of winPatterns) {
    const [a,b,c] = pattern;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      gameActive = false;
      document.querySelectorAll(".cell")[a].classList.add("win");
      document.querySelectorAll(".cell")[b].classList.add("win");
      document.querySelectorAll(".cell")[c].classList.add("win");

      statusText.textContent =(`Player ${currentPlayer} Wins!`);
      scores[currentPlayer]++;
      updateScore();
      return;
    }
  }

  if (!cells.includes("")) {
    gameActive = false;
    statusText.textContent = "It's a Draw!";
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = (`Player ${currentPlayer}'s Turn`);
}

function aiMove() {
  let emptyCells = cells.map((val, i) => val === "" ? i : null).filter(v => v !== null);
  let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  if (randomIndex !== undefined) {
    cells[randomIndex] = "O";
    const cellEl = document.querySelector(`.cell[data-index='${randomIndex}']`);
    cellEl.textContent = "O";
    checkWinner();
  }
}

function updateScore() {
  xScoreEl.textContent = scores.X;
  oScoreEl.textContent = scores.O;
}

resetBtn.addEventListener("click", createBoard);
twoPlayerBtn.addEventListener("click", () => { vsAI = false; createBoard(); });
aiBtn.addEventListener("click", () => { vsAI = true; createBoard(); });

createBoard();