/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  //  set "board" to empty HEIGHT x WIDTH matrix array
 for(let i=0;i<HEIGHT;i++){
    // board.push(Array(WIDTH));
    board.push(Array.from({ length: WIDTH }));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
const htmlBoard=document.querySelector('#board');

  // TODO: Create table row that corresponds to top of a column. When a player 
  // clicks on this row, a ball is dropped into the corresponding column
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // Add the cells (specified by width)for the top row and append the row to the board
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Create the play grid . Create 'height' # of rows and 'width' # of cells to each row
  // Append each row to the board
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
  
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for (let y = HEIGHT-1; y >= 0; y--) {
if(board[y][x]===undefined) {
board[y][x]=currPlayer;
  return y;
}
}
return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const currPiece=document.createElement('div');
  currPiece.classList.add("piece");
  currPiece.classList.add("p"+currPlayer);

  const currCell=document.getElementById(`${y}-${x}`);
 currCell.classList.add("current-cell-p"+currPlayer);
currCell.append(currPiece);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  // console.log(y);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  
  //  check if all cells in board are filled; if so call, call endGame
  const check=board.every(arr=> arr.every(cell=>(cell===1|| cell===2)))
 

// //  Alternate method by creating a function
//  function checkBoard(){
//   for (let y = 0; y < HEIGHT; y++) {
//     for (let x = 0; x < WIDTH; x++) {
//    if(board[y][x]=== undefined) return false;
// }}
// return true;
// }
// let check = checkBoard(); 


if(check) endGame("Game over: Tie!!");

// switch players :switch currPlayer 1 <-> 2
  currPlayer=currPlayer===1?2:1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  
  // Generate  list of all possible combination of 4 cell positions(horizontal, vertical and diagonal) that would 
// lead to a win. If a player wins, the function returns true
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
