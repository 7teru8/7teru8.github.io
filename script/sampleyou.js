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
  }*/