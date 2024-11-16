let rows, cols, numMines;
let grid = [];

// Set difficulty
function setDifficulty(difficulty) {
    if (difficulty === 'beginner') {
        rows = 8;
        cols = 8;
        numMines = 10;
    } else if (difficulty === 'intermediate') {
        rows = 16;
        cols = 16;
        numMines = 40;
    } else if (difficulty === 'hard') {
        rows = 16;
        cols = 30;
        numMines = 99;
    }
}

// Start the game
function startGame() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = ''; // Clear the board for a new game
    setDifficulty(document.getElementById('difficulty').value); // Set difficulty
    grid = []; // Reset grid
    createGrid();
}

// Create the grid
function createGrid() {
    const gameBoard = document.getElementById('game-board');

    for (let row = 0; row < rows; row++) {
        grid[row] = [];
        for (let col = 0; col < cols; col++) {
            grid[row][col] = { mine: false, revealed: false, adjacentMines: 0 };

            const cell = document.createElement('div');
            cell.id = `cell-${row}-${col}`;
            cell.classList.add('cell');
            cell.addEventListener('click', () => {
                revealCell(row, col);
                checkWin();
            });
            gameBoard.appendChild(cell);
        }
    }

    gameBoard.style.display = 'grid';
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    gameBoard.style.gap = '2px';

    placeMines();
    calculateAdjacentMines();
}

// Place mines
function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < numMines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (!grid[row][col].mine) {
            grid[row][col].mine = true;
            minesPlaced++;
        }
    }
}

// Calculate adjacent mines
function calculateAdjacentMines() {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],          [0, 1],
        [1, -1], [1, 0], [1, 1],
    ];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (!grid[row][col].mine) {
                let count = 0;
                for (const [dx, dy] of directions) {
                    const newRow = row + dx;
                    const newCol = col + dy;
                    if (
                        newRow >= 0 && newRow < rows &&
                        newCol >= 0 && newCol < cols &&
                        grid[newRow][newCol].mine
                    ) {
                        count++;
                    }
                }
                grid[row][col].adjacentMines = count;
            }
        }
    }
}

// Reveal a cell
function revealCell(row, col) {
    const cell = grid[row][col];
    if (cell.revealed) return;

    cell.revealed = true;
    const cellElement = document.getElementById(`cell-${row}-${col}`);
    cellElement.classList.add('revealed');

    if (cell.mine) {
        cellElement.textContent = '💣';
        alert('Game Over! You clicked on a mine.');
        revealAllMines(row, col);
        return;
    }

    if (cell.adjacentMines > 0) {
        cellElement.textContent = cell.adjacentMines;
    } else {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],          [0, 1],
            [1, -1], [1, 0], [1, 1],
        ];

        for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;
            if (
                newRow >= 0 && newRow < rows &&
                newCol >= 0 && newCol < cols
            ) {
                revealCell(newRow, newCol);
            }
        }
    }
}

// Reveal all mines
function revealAllMines(clickedRow, clickedCol) {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = grid[row][col];
            const cellElement = document.getElementById(`cell-${row}-${col}`);
            if (cell.mine) {
                cellElement.textContent = '💣';
                if (row === clickedRow && col === clickedCol) {
                    cellElement.classList.add('clicked-mine');
                }
                cellElement.classList.add('revealed');
            }
        }
    }
}

// Check for win
function checkWin() {
    let revealedCells = 0;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (grid[row][col].revealed && !grid[row][col].mine) {
                revealedCells++;
            }
        }
    }

    if (revealedCells === rows * cols - numMines) {
        alert('Congratulations! You win!');
    }
}

// Event listener for start button
document.getElementById('start-game').addEventListener('click', startGame);
