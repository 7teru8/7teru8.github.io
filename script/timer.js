  /*ピクロスのjssample*//*
  // const size = 12;
  const puzzle = document.getElementById('puzzle');
  // 盤面の状態を2次元配列で管理（false=空、true=塗りつぶし）
  const board = Array(size).fill(null).map(() => Array(size).fill(false));

  // マスを生成
  for(let r=0; r<size; r++){
    for(let c=0; c<size; c++){
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = r;
      cell.dataset.col = c;

      // クリックで切り替え
      cell.addEventListener('click', () => {
        board[r][c] = !board[r][c];
        cell.classList.toggle('filled', board[r][c]);
      });

      puzzle.appendChild(cell);
    }
  }*//*
let d = new Date();
console.log(d) // Tue Feb 23 2021 21:56:22 GMT+0900 (日本標準時)/**/ 

// 【重要】目標の日付と時刻を設定してください。
// 例: 2026年1月1日 00:00:00 JST
const targetDate = new Date('2026 2/13').getTime();

// カウントダウンを表示する要素
const countdownElement = document.getElementById('timer');

// 時間の単位（ミリ秒）
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

function updateCountdown() {
    // 1. 現在時刻をミリ秒で取得
    const now = new Date().getTime();

    // 2. 目標時刻までの残り時間（差分）を計算
    const distance = targetDate - now;

    // 3. 残り時間を日/時/分/秒に変換
    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    // 4. 結果を表示
    if (distance > 0) {
        countdownElement.innerHTML = 
            `${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`;
    } else {
        // 5. カウントダウン終了時の処理
        countdownElement.innerHTML = "**〆**";
        // setIntervalを停止する
        clearInterval(timerInterval);
    }
}

// ページロード時に一度実行し、その後1秒(1000ミリ秒)ごとに実行
updateCountdown();
const timerInterval = setInterval(updateCountdown, 1000);