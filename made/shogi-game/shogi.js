const board = document.getElementById('board');

    // 9x9マスを生成
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.x = x;
        cell.dataset.y = y;
        // 駒を置く場合はここに文字を入れる
        // 例: if (y === 6) cell.textContent = '歩';
        board.appendChild(cell);
      }
    }