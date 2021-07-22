/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor(height, width, player1, player2) {
    this.height = height;
    this.width = width;
    this.player1 = player1;
    this.player2 = player2;
    this.currPlayer = player1.color;
    this.board = [];
    this.gameOver = false;
    this.makeBoard();
    this.makeHtmlBoard();
  }

  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */
  makeBoard() {
    // console.log(1, this);
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const board = document.getElementById("board");
    // console.log(2, this);
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", this.handleClick.bind(this));

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    // piece.classList.add(`p${this.currPlayer}`);
    piece.style.top = -50 * (y + 2);
    piece.style.backgroundColor = this.currPlayer;

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */
  endGame(msg) {
    this.gameOver = true;
    alert(msg);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    if (!this.gameOver) {
      // console.log(3, this);

      // get x from ID of clicked cell
      const x = +evt.target.id;

      // get next spot in column (if none, ignore click)

      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }

      // place piece in board and add to HTML table
      this.board[y][x] = this.currPlayer;
      this.placeInTable(y, x);

      // check for win
      if (this.checkForWin()) {
        return this.endGame(`The ${this.currPlayer} player  won!`);
      }

      // check for tie
      if (this.board.every((row) => row.every((cell) => cell))) {
        return this.endGame("Tie!");
      }

      // switch players
      this.currPlayer =
        this.currPlayer === this.player1.color
          ? this.player2.color
          : this.player1.color;
    }
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    const _win = (cells) => {
      // console.log(4, this); this here is undefined if we dont write _win as arrow function

      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    };

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

// Create a Player class. It should have a constructor that takes a string color name (eg, “orange” or “#ff3366”) and store that on the player instance.
class Player {
  constructor(color) {
    this.color = color;
  }
}

const startBtn = document.querySelector("#start");

//  create the two player instances and pass it to the game class

startBtn.addEventListener("click", () => {
  let p1 = new Player(document.querySelector("#player1").value);

  let p2 = new Player(document.querySelector("#player2").value);
  new Game(6, 7, p1, p2);
});
