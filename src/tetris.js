import {
    PLAYFIELD_COLUMNS,
    PLAYFIELD_ROWS,
    TETROMINO_NAMES,
    TETROMINOES,
    getRandomElement,
    rotateMatrix
} from "./utiliti.js";

export class Tetris {
    constructor() {
        this.init();
        this.isCameOver = false;
    }

    init() {
        this.generatePlayfield();  
        this.generateTetromino();
    }

    generatePlayfield() {
        this.playfield = new Array(PLAYFIELD_ROWS).fill()
            .map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
    }

    generateTetromino() {
        const name = getRandomElement(TETROMINO_NAMES);
        const matrix = TETROMINOES[name];

        const column = Math.floor(PLAYFIELD_COLUMNS / 2 - matrix.length / 2);
        const row = -1;

        this.tetromino = {
            name,
            matrix,
            row,
            column,
            ghostColumn:column,
            ghostRow:row
        };

        this.calculateGhostPosistion();
    }

    moveTetrominoDown() {
        this.tetromino.row += 1;
        if (!this.isValid()) {
            this.tetromino.row-= 1
            this.placeTetromino();
        }
    }

    moveTetrominoLeft() {
        this.tetromino.column -= 1;
           if (!this.isValid()) {
            this.tetromino.column+= 1
        }
    }

    moveTetrominoRight() {
        this.tetromino.column += 1;
           if (!this.isValid()) {
            this.tetromino.column-= 1
        }
    }

    rotateTetromino() {
        const oldMatrix =this.tetromino.matrix;
        const rotatedMatrix = rotateMatrix(this.tetromino.matrix);
        this.tetromino.matrix = rotatedMatrix;
           if (!this.isValid()) {
            this.tetromino.matrix = oldMatrix
        }
    } 


    dropTetrominoDown() {
        this.tetromino.row = this.tetromino.ghostRow
        this.placeTetromino()
    }

    isValid() {
        const matrixSize = this.tetromino.matrix.length
        for (let row = 0; row < matrixSize; row++){
            for (let column = 0; column < matrixSize; column++) {
                if (!this.tetromino.matrix[row] [column]) continue; 
                 if(this.is0utside0fGameBoard(row, column)) return false   
                 if(this.isCollides(row,column)) return false;
                
            }
        } 
        return true
     }

     is0utside0fGameBoard(row,column) {
        return this.tetromino.column + column < 0 ||
            this.tetromino.column + column >= PLAYFIELD_COLUMNS ||
            this.tetromino.row + row >= this.playfield.length;
     }

     isCollides(row,column){
        return this.playfield[this.tetromino.row + row]?.[this.tetromino.column + column];
     }


    placeTetromino() {
    const matrixSize = this.tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            if (!this.tetromino.matrix[row][column]) continue;
            if(this.is0utside0fTopBoard(row)) {
                this.isCameOver = true
                return
            }
            this.playfield[this.tetromino.row + row][this.tetromino.column + column] = this.tetromino.name;
        }
    }
    this.processFilledRows();
    this.generateTetromino();
}


    is0utside0fTopBoard(row) {
        return this.tetromino.row + row < 0
    }

     processFilledRows() {
        const filledLines = this.findFilledRows()
        this.removeFilledRows(filledLines);
     }


     findFilledRows() {
        const filledRows = [];
        for(let row = 0; row < PLAYFIELD_ROWS; row++ ) {
            if (this.playfield[row].every(cell => Boolean(cell))) {
                filledRows.push(row)
            }
        }


        return filledRows;
     }

     removeFilledRows(filledRows) {
        filledRows.forEach(row => {
            this.dropRowsAbove(row);
        });
     }

dropRowsAbove(rowToDelete) {
    for (let row = rowToDelete; row > 0; row--) {
        this.playfield[row] = [...this.playfield[row - 1]];
    }
    this.playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
}


calculateGhostPosistion() {
    const originalRow = this.tetromino.row;

   
    this.tetromino.row++;
    while (this.isValid()) {
        this.tetromino.row++;
    }


    this.tetromino.ghostRow = this.tetromino.row - 1;
    this.tetromino.ghostColumn = this.tetromino.column;

  
    this.tetromino.row = originalRow;
}

}
