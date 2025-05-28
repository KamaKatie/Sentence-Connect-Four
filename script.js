// Dynamic sentences arrays
const aSentences = [
    "I like",
    "She enjoys",
    "We love",
    "They hate"
];

const bSentences = [
    "playing soccer",
    "reading books",
    "watching movies",
    "doing homework"
];

// Cached references
const gameContainer = document.getElementById("gameContainer");

let cells = [];
let currentPlayer = 1;
let gameOver = false;
let moveHistory = [];

// Create the board dynamically
function createBoard() {
    // Clear previous board if any
    gameContainer.innerHTML = "";

    // Create board container
    const board = document.createElement("div");
    board.className = "game-board";

    // Top-left corner empty
    const corner = document.createElement("div");
    corner.className = "corner";
    board.appendChild(corner);

    // B labels (top row, columns 2-5)
    for (const bText of bSentences) {
        const bLabel = document.createElement("div");
        bLabel.className = "b-label";
        bLabel.textContent = bText;
        board.appendChild(bLabel);
    }

    cells = [];

    // For each row: add A label + 4 cells
    for (let row = 0; row < aSentences.length; row++) {
        // A label (first column)
        const aLabel = document.createElement("div");
        aLabel.className = "a-label";
        aLabel.textContent = aSentences[row];
        board.appendChild(aLabel);

        // 4 cells in this row
        for (let col = 0; col < bSentences.length; col++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            const cellIndex = row * bSentences.length + col;
            cell.dataset.index = cellIndex;

            // Add click listener
            cell.addEventListener("click", () => handleCellClick(cellIndex));
            board.appendChild(cell);
            cells.push(cell);
        }
    }

    gameContainer.appendChild(board);
}

function handleCellClick(index) {
    if (gameOver) return;

    const cell = cells[index];
    if (cell.classList.contains("player1") || cell.classList.contains("player2")) return;

    cell.classList.add(currentPlayer === 1 ? "player1" : "player2");
    cell.textContent = "";
    moveHistory.push(index);

    if (checkWin(currentPlayer)) {
        document.getElementById("currentPlayer").textContent = `🎉 Player ${currentPlayer} wins! 🎉`;
        gameOver = true;
        return;
    }

    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateStatus();
}

function updateStatus() {
    document.getElementById("currentPlayer").textContent =
        `Current Player: Player ${currentPlayer} (${currentPlayer === 1 ? "Red" : "Blue"})`;
}

function checkWin(player) {
    const className = player === 1 ? "player1" : "player2";
    const rows = aSentences.length;
    const cols = bSentences.length;

    const get = (r, c) => {
        if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
        return cells[r * cols + c].classList.contains(className);
    };

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (get(r, c) && get(r, c + 1) && get(r, c + 2) && get(r, c + 3)) return true; // Horizontal
            if (get(r, c) && get(r + 1, c) && get(r + 2, c) && get(r + 3, c)) return true; // Vertical
            if (get(r, c) && get(r + 1, c + 1) && get(r + 2, c + 2) && get(r + 3, c + 3)) return true; // Diagonal \
            if (get(r, c) && get(r + 1, c - 1) && get(r + 2, c - 2) && get(r + 3, c - 3)) return true; // Diagonal /
        }
    }
    return false;
}

function undoMove() {
    if (moveHistory.length === 0 || gameOver) return;

    const lastIndex = moveHistory.pop();
    const cell = cells[lastIndex];

    cell.classList.remove("player1", "player2");
    cell.textContent = "";

    gameOver = false;
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateStatus();
}

function resetGame() {
    cells.forEach(cell => {
        cell.classList.remove("player1", "player2");
        cell.textContent = "";
    });
    moveHistory = [];
    currentPlayer = 1;
    gameOver = false;
    updateStatus();
}

// Initialize
createBoard();
updateStatus();
