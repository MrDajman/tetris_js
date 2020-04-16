const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");

const ROW = 20;
const COL = COLUMN = 40;
const SQ = squareSize = 20;
const VACANT = "WHITE";

//draw a square
function drawSquare(x,y,color){
  ctx.fillStyle = color;
  ctx.fillRect(x*SQ,y*SQ,SQ,SQ);

  ctx.strokeStyle = "BLACK";
  ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);
}

drawSquare(2,2,"red");

// create a board

let board = [];
for(r = 0; r<ROW; r++){
  board[r]= [];
  for(c = 0; c<COL; c++){
    board[r][c] = VACANT;
  }
}

// draw the board
function drawBoard(){
  for(r = 0; r<ROW; r++){
    for(c = 0; c<COL; c++){
      drawSquare(c,r,board[r][c])
    }
  }
}

drawBoard();

drawSquare(2,2,"red");

const PIECES = [
  [Z, "red"],
  [S,"green"],
  [T,"yellow"],
  [O,"blue"],
  [L,"purple"],
  [I,"cyan"],
  [J,"orange"]
];

//initate a piece

let p = new Piece(PIECES[0][0], PIECES[0][1]);



// The Object Piece

function Piece(tetromino, color){
  this.tetromino = tetromino;
  this.color = color;

  this.tetrominoN = 0;
  this.activeTetromino = this.tetromino[this.tetrominoN];

  this.x = 3;
  this.y = 0;
}

// fill function

Piece.prototype.fill = function(color){

  for(r = 0; r<this.activeTetromino.length; r++){
    board[r]= [];
    for(c = 0; c<this.activeTetromino.length; c++){
      if(this.activeTetromino[r][c]){
        drawSquare(this.x +c, this.y + r, color);
      }
    }
  }
}


// draw a piece to the drawBoard

Piece.prototype.draw = function(){
  this.fill(this.color);
}

// p.draw();
Piece.prototype.undraw = function(){
  this.fill(VACANT);
}
// undraw a piece

// move down the Piece

Piece.prototype.moveDown = function(){
  if(!this.collision(0,1,this.activeTetromino)){
    this.undraw();
    this.y++;
    this.draw();
  }
}

// move right the piece
Piece.prototype.moveRight = function(){
  if(!this.collision(1,0,this.activeTetromino)){
    this.undraw();
    this.x++;
    this.draw();
  }
}
// move left the piece
Piece.prototype.moveLeft = function(){
  if(!this.collision(-1,0,this.activeTetromino)){
    this.undraw();
    this.x--;
    this.draw();
  }
}

//rotate tetromino
Piece.prototype.rotate = function(){
  let newPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length]
  if(!this.collision(0,0,newPattern)){
    this.undraw();
    this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.draw();
  }
}
//collision function

Piece.prototype.collision = function(x,y,piece){
  for(r = 0; r<piece.length; r++){
    board[r]= [];
    for(c = 0; c<piece.length; c++){
      // if the square is emty
      if(!piece[r][c]){
        continue;
      }
      // new cooords
      let newX = this.x + c + x;
      let newY = this.y + r + y;

      // contidions
      if(newX < 0 || newX >= COL || newY >= ROW){
        return true;
      }
      // skip newY < 0 board[-1] will crush our game
      if(newY < 0){
        continue;
      }
      // check for locked
      if(board[newY][newX] != VACANT){
        return true;
      }
    }
  }
  return false;
}


//Control the Piece

document.addEventListener("keydown",CONTROL);

function CONTROL(event){
  if(event.keyCode == 37){
    p.moveLeft();
  }else if(event.keyCode == 38){
    p.rotate();
  }else if(event.keyCode == 39){
    p.moveRight();
  }else if(event.keyCode == 40){
    p.moveDown();
  }

}

// drop the piece every sec

let dropStart = Date.now();
function drop(){
  let now = Date.now();
  let delta = now - dropStart;
  if(delta > 1000){
    p.moveDown();
    dropStart = Date.now();
  }
  requestAnimationFrame(drop);
}

drop();
