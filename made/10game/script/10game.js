/* ===== 設定 ===== */
const CELL_SIZE = 30;
const OFFSET_X = 30;   // 盤面専用
const OFFSET_Y = 80;
const COLS = 13;
const ROWS = 21;

// UI用
const UI_MARGIN = 10;
const UI_TOP = 26;
const UI_LINE = 18;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

/* ===== ゲーム状態 ===== */
let grid = Array.from({ length: ROWS }, () =>
  Array.from({ length: COLS }, () => Math.floor(Math.random() * 9) + 1)
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /* --- グリッド --- */
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let x = c * CELL_SIZE + OFFSET_X;
      let y = r * CELL_SIZE + OFFSET_Y;

      ctx.strokeStyle = "#ccc";
      ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);

      if (grid[r][c] > 0) {
        ctx.fillStyle = "black";
        ctx.font = "24px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(grid[r][c], x + 15, y + 15);
      }
    }
  }

  /* --- UI --- */
  ctx.font = "20px sans-serif";

  // SCORE（左）
  ctx.textAlign = "left";
  ctx.fillStyle = "blue";
  ctx.fillText(`SCORE: ${score}`, UI_MARGIN, UI_TOP);

  // TIME（右）
  ctx.textAlign = "right";
  ctx.fillStyle = timeLimit < 10 ? "red" : "black";
  ctx.fillText(`TIME: ${Math.floor(timeLimit)}`, canvas.width - UI_MARGIN, UI_TOP);

  // Skill表示
  ctx.font = "15px sans-serif";
  ctx.textAlign = "left";

  ctx.fillStyle = "orange";
  ctx.fillText(`Refresh(A): ${skillA}`, UI_MARGIN, UI_TOP + UI_LINE);

  ctx.fillStyle = "red";
  ctx.fillText(`Delete(S): ${skillS}/3`, UI_MARGIN, UI_TOP + UI_LINE * 2);

  // Charge（右側）
  const chargeX = canvas.width - 160;
  const chargeY = UI_TOP + UI_LINE * 2;

  ctx.fillStyle = "green";
  ctx.fillText("Charge:", chargeX, chargeY);

  for (let i = 0; i < charge; i++) {
    ctx.beginPath();
    ctx.arc(chargeX + 60 + i * 14, chargeY + 1.5, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // メッセージ
  if (displayMsg) {
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "magenta";
    ctx.textAlign = "right";
    ctx.fillText(displayMsg, canvas.width - UI_MARGIN - 100, UI_TOP);

  }

  // スキル枠
  if (skillMode) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1;
  }

  // ドラッグ枠
  if (isDragging && startPos && currentPos) {
    let x = Math.min(startPos.x, currentPos.x);
    let y = Math.min(startPos.y, currentPos.y);
    let w = Math.abs(startPos.x - currentPos.x);
    let h = Math.abs(startPos.y - currentPos.y);
    ctx.strokeStyle = "red";
    ctx.strokeRect(x, y, w, h);
  }

  // 終了
  if (gameOver) {
    ctx.fillStyle = "yellow";
    ctx.font = "80px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("FINISH!", canvas.width / 2, canvas.height / 2);
    ctx.textAlign = "left";
  }
}

/* ===== マウス ===== */
function getCell(pos) {
  return {
    col: Math.floor((pos.x - OFFSET_X) / CELL_SIZE),
    row: Math.floor((pos.y - OFFSET_Y) / CELL_SIZE)
  };
}

canvas.addEventListener("mousedown", e => {
  if (gameOver) return;
  const rect = canvas.getBoundingClientRect();
  const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };

  if (skillMode) {
    let { row, col } = getCell(pos);
    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
      grid[row][col] = 0;
      skillMode = false;
    }
    return;
  }

  startPos = pos;
  currentPos = pos;
  isDragging = true;
});

canvas.addEventListener("mousemove", e => {
  if (!isDragging) return;
  const rect = canvas.getBoundingClientRect();
  currentPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
});

canvas.addEventListener("mouseup", e => {
  if (!isDragging || gameOver) return;
  isDragging = false;

  const rect = canvas.getBoundingClientRect();
  const endPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };

  let s = getCell(startPos);
  let e2 = getCell(endPos);

  let r1 = Math.max(0, Math.min(s.row, e2.row));
  let r2 = Math.min(ROWS - 1, Math.max(s.row, e2.row));
  let c1 = Math.max(0, Math.min(s.col, e2.col));
  let c2 = Math.min(COLS - 1, Math.max(s.col, e2.col));

  let sum = 0;
  let cells = [];

  for (let r = r1; r <= r2; r++) {
    for (let c = c1; c <= c2; c++) {
      sum += grid[r][c];
      cells.push([r, c]);
    }
  }

  if (sum === 10) {
    charge++;
    if (charge >= 5) {
      if (skillS < skillSMax) skillS++;
      charge = 0;
    }

    let count = cells.filter(([r, c]) => grid[r][c] > 0).length;
    if (count >= 2) score += (count - 1) * 100;

    cells.forEach(([r, c]) => (grid[r][c] = 0));
  }
});

/* ===== キー ===== */
document.addEventListener("keydown", e => {
  if (gameOver) return;

  // --- Sキー ---
  if (e.key === "s" || e.key === "S") {
    if (skillMode) return;

    if (skillS > 0) {
      skillS--;
      skillMode = true;
      displayMsg = "消したいマスを一つ選んでください";
      msgTimer = 2;
    } else {
      displayMsg = "Sスキルがチャージされていません";
      msgTimer = 2;
    }
  }

  // --- Aキー ---
  if (e.key === "a" || e.key === "A") {
    if (skillMode) return;

    if (skillA > 0) {
      skillA--;
      displayMsg = "ランダムな数字に置き換えました";
      msgTimer = 2;

      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
          if (grid[r][c] > 0)
            grid[r][c] = Math.floor(Math.random() * 9) + 1;
    } else {
      displayMsg = "Aスキルはもう使えません";
      msgTimer = 2;
    }
  }
});


/* ===== ループ ===== */
let last = performance.now();
function loop(now) {
  const dt = (now - last) / 1000;
  last = now;

  if (!gameOver) {
    timeLimit -= dt;
    if (timeLimit <= 0) {
      timeLimit = 0;
      gameOver = true;
    }
  }

  if (msgTimer > 0) {
    msgTimer -= dt;
    if (msgTimer <= 0) displayMsg = "";
  }

  draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
