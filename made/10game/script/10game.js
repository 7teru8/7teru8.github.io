/* ===== 設定 ===== */
const CELL_SIZE = 30;
const OFFSET_X = 30;
const OFFSET_Y = 80;
const COLS = 13;
const ROWS = 21;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

/* ===== ゲーム状態 ===== */
let grid = Array.from({length: ROWS}, () =>
  Array.from({length: COLS}, () => Math.floor(Math.random()*9)+1)
);

let score = 0;
let timeLimit = 120;
let gameOver = false;

/* スキル */
let skillA = 2;
let skillS = 0;
let skillSMax = 3;
let charge = 0;
let skillMode = false;

/* メッセージ */
let displayMsg = "";
let msgTimer = 0;

/* ドラッグ */
let isDragging = false;
let startPos = null;
let currentPos = null;

/* ===== 描画 ===== */
function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // グリッド
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      let x = c*CELL_SIZE + OFFSET_X;
      let y = r*CELL_SIZE + OFFSET_Y;

      ctx.strokeStyle = "#ccc";
      ctx.strokeRect(x,y,CELL_SIZE,CELL_SIZE);

      if(grid[r][c] > 0){
        ctx.fillStyle = "black";
        ctx.font = "24px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(grid[r][c], x+15, y+15);
      }
    }
  }

  // UI
  ctx.fillStyle = "blue";
  ctx.font = "30px sans-serif";
  ctx.fillText(`SCORE: ${score}`, OFFSET_X, 30);

  ctx.fillStyle = timeLimit < 10 ? "red":"black";
  ctx.fillText(`TIME: ${Math.floor(timeLimit)}`, 300, 30);

  ctx.font = "18px sans-serif";
  ctx.fillStyle = "orange";
  ctx.fillText(`Refresh(A): ${skillA}`, OFFSET_X, 55);

  ctx.fillStyle = "red";
  ctx.fillText(`Delete(S): ${skillS}/3`, OFFSET_X+150, 55);

  ctx.fillStyle = "green";
  ctx.fillText("Charge:", OFFSET_X+280, 55);
  for(let i=0;i<charge;i++){
    ctx.beginPath();
    ctx.arc(OFFSET_X+350+i*15, 48, 6, 0, Math.PI*2);
    ctx.fill();
  }

  // メッセージ
  if(displayMsg){
    ctx.fillStyle = "magenta";
    ctx.font = "26px sans-serif";
    ctx.fillText(displayMsg, OFFSET_X, 80);
  }

  // スキル枠
  if(skillMode){
    ctx.strokeStyle = "red";
    ctx.lineWidth = 5;
    ctx.strokeRect(0,0,canvas.width,canvas.height);
    ctx.lineWidth = 1;
  }

  // ドラッグ枠
  if(isDragging && startPos && currentPos){
    let x = Math.min(startPos.x,currentPos.x);
    let y = Math.min(startPos.y,currentPos.y);
    let w = Math.abs(startPos.x-currentPos.x);
    let h = Math.abs(startPos.y-currentPos.y);
    ctx.strokeStyle = "red";
    ctx.strokeRect(x,y,w,h);
  }

  // 終了
  if(gameOver){
    ctx.fillStyle = "yellow";
    ctx.font = "80px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("FINISH!", canvas.width/2, canvas.height/2);
    ctx.textAlign = "left";
  }
}

/* ===== マウス ===== */
function getCell(pos){
  return {
    col: Math.floor((pos.x-OFFSET_X)/CELL_SIZE),
    row: Math.floor((pos.y-OFFSET_Y)/CELL_SIZE)
  };
}

canvas.addEventListener("mousedown", e=>{
  if(gameOver) return;
  const rect = canvas.getBoundingClientRect();
  const pos = {x:e.clientX-rect.left, y:e.clientY-rect.top};

  if(skillMode){
    let {row,col} = getCell(pos);
    if(row>=0 && row<ROWS && col>=0 && col<COLS){
      grid[row][col] = 0;
      skillMode = false;
    }
    return;
  }

  startPos = pos;
  currentPos = pos;
  isDragging = true;
});

canvas.addEventListener("mousemove", e=>{
  if(!isDragging) return;
  const rect = canvas.getBoundingClientRect();
  currentPos = {x:e.clientX-rect.left, y:e.clientY-rect.top};
});

canvas.addEventListener("mouseup", e=>{
  if(!isDragging || gameOver) return;
  isDragging = false;

  const rect = canvas.getBoundingClientRect();
  const endPos = {x:e.clientX-rect.left, y:e.clientY-rect.top};

  let s = getCell(startPos);
  let e2 = getCell(endPos);

  let r1 = Math.max(0, Math.min(s.row,e2.row));
  let r2 = Math.min(ROWS-1, Math.max(s.row,e2.row));
  let c1 = Math.max(0, Math.min(s.col,e2.col));
  let c2 = Math.min(COLS-1, Math.max(s.col,e2.col));

  let sum = 0;
  let cells = [];

  for(let r=r1;r<=r2;r++){
    for(let c=c1;c<=c2;c++){
      sum += grid[r][c];
      cells.push([r,c]);
    }
  }

  if(sum === 10){
    charge++;
    if(charge>=5){
      if(skillS < skillSMax) skillS++;
      charge = 0;
    }

    let count = cells.filter(([r,c])=>grid[r][c]>0).length;
    if(count>=2) score += (count-1)*100;

    cells.forEach(([r,c])=>grid[r][c]=0);
  }
});

/* ===== キー ===== */
document.addEventListener("keydown", e=>{
  if(gameOver) return;

  if(e.key==="s"||e.key==="S"){
    if(skillS>0 && !skillMode){
      skillS--;
      skillMode = true;
      displayMsg="~S~ skill active!";
      msgTimer=2;
    }
  }

  if(e.key==="a"||e.key==="A"){
    if(skillA>0 && !skillMode){
      skillA--;
      displayMsg="random refresh";
      msgTimer=2;
      for(let r=0;r<ROWS;r++)
        for(let c=0;c<COLS;c++)
          if(grid[r][c]>0)
            grid[r][c]=Math.floor(Math.random()*9)+1;
    }
  }
});

/* ===== ループ ===== */
let last = performance.now();
function loop(now){
  const dt = (now-last)/1000;
  last = now;

  if(!gameOver){
    timeLimit -= dt;
    if(timeLimit<=0){
      timeLimit=0;
      gameOver=true;
    }
  }

  if(msgTimer>0){
    msgTimer -= dt;
    if(msgTimer<=0) displayMsg="";
  }

  draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);