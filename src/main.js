import { Tetris } from "./tetris.js";
import { PLAYFIELD_COLUMNS, PLAYFIELD_ROWS, convertPositionToIndex,  } from "./utiliti.js"; 

let hammer;
const tetris = new Tetris();
const cells = document.querySelectorAll('.grid > div');

let timeoutId;  
let requestId;  

initKeydown();
initTouch();

moveDown();

function initKeydown() {
    document.addEventListener('keydown', onkeydown);
}

function onkeydown(event) {
    switch (event.key) {
        case 'ArrowUp':
            rotate();
            break;
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
        case ' ':
            dropDown();
            break;
    }
}

function initTouch() {
    document.addEventListener('dblclick', (event) => {
        event.preventDefault();
    });

    hammer = new Hammer(document.querySelector('body'));

    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

    let deltaX = 0;
    let deltaY = 0;
    const threshold = 30;

    hammer.on('panstart', () => {
        deltaX = 0;
        deltaY = 0;
    });

    hammer.on('panleft', (event) => {
        if (Math.abs(event.deltaX - deltaX) > threshold) {
            moveLeft();
            deltaX = event.deltaX;
            deltaY = event.deltaY;
        }
    });

    hammer.on('panright', (event) => {
        if (Math.abs(event.deltaX - deltaX) > threshold) {
            moveRight();
            deltaX = event.deltaX;
            deltaY = event.deltaY;
        }
    });

    hammer.on('pandown', (event) => {
        if (Math.abs(event.deltaY - deltaY) > threshold) {
            moveDown();
            deltaX = event.deltaX;
            deltaY = event.deltaY;
        }
    });

    hammer.on('swipedown', (event) => {
        dropDown();
    });

    hammer.on('tap', () => {
        rotate();
    });
}

function stopLoop() {
    clearTimeout(timeoutId);
    cancelAnimationFrame(requestId);
}

function startLoop() {
    timeoutId = setTimeout(() => {
        requestId = requestAnimationFrame(moveDown);
    }, 700);
}

function rotate() {
    tetris.rotateTetromino();
    draw();
}

function moveDown() {
    tetris.moveTetrominoDown();
    draw();
    stopLoop();
    startLoop();
    if (tetris.isGameOver) {
        console.log("moveDown: gameOver true");
        gameOver();
    }
}

function dropDown() {
    tetris.dropTetrominoDown();
    draw();
    stopLoop();
    startLoop();
    if (tetris.isGameOver) {
        console.log("dropDown: gameOver true");
        gameOver();
    }
}

function moveLeft() {
    tetris.moveTetrominoLeft();
    draw();
}

function moveRight() {
    tetris.moveTetrominoRight();
    draw();
}

function draw() {
    cells.forEach(cell => {
        cell.removeAttribute('class');
    });
    drawPlayfield();
    drawTetromino();
    if (typeof tetris.calculateGhostPosition === 'function') {
        tetris.calculateGhostPosition();
    } else if (typeof tetris.calculateGhostPosistion === 'function') {
        tetris.calculateGhostPosistion();
    }
    drawGhostTetromino();
}

function drawPlayfield() {
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if (!tetris.playfield[row][column]) continue;
            const name = tetris.playfield[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            if (cellIndex >= 0 && cellIndex < cells.length) {
                cells[cellIndex].classList.add(name);
            }
        }
    }
}

function drawTetromino() {
    const name = tetris.tetromino.name;
    const matrixSize = tetris.tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let col = 0; col < matrixSize; col++) {
            if (!tetris.tetromino.matrix[row][col]) continue;
            if (tetris.tetromino.row + row < 0) continue;
            const index = convertPositionToIndex(
                tetris.tetromino.row + row,
                tetris.tetromino.column + col
            );
            if (index >= 0 && index < cells.length) {
                cells[index].classList.add(name);
            }
        }
    }
}

function drawGhostTetromino() {
    const matrixSize = tetris.tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let col = 0; col < matrixSize; col++) {
            if (!tetris.tetromino.matrix[row][col]) continue;
            if (tetris.tetromino.ghostRow + row < 0) continue;
            const cellIndex = convertPositionToIndex(
                tetris.tetromino.ghostRow + row,
                tetris.tetromino.ghostColumn + col
            );
            if (cellIndex >= 0 && cellIndex < cells.length) {
                cells[cellIndex].classList.add('ghost');
            }
        }
    }
}

function gameOver() {
    stopLoop();
    document.removeEventListener('keydown', onkeydown);
    hammer.off('panstart panleft panright pandown swipedown tap');

  
}

