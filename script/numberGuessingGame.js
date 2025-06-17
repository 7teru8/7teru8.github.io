// script/numberGuessingGame.js

// === ゲームの要素を取得 ===
// HTMLファイル内の要素をJavaScriptで操作するために取得します
const guessInput = document.getElementById('guessInput'); // 予想入力欄
const submitGuessButton = document.getElementById('submitGuess'); // 予想送信ボタン
const messageDisplay = document.getElementById('message'); // ヒントメッセージ表示Pタグ
const attemptsDisplay = document.getElementById('attempts'); // 試行回数表示Pタグ
const resetButton = document.getElementById('resetGame'); // リセットボタン

// === ゲームの状態を管理する変数 ===
let randomNumber; // コンピューターが選んだ秘密の数字
let attempts = 0; // プレイヤーの試行回数
const maxAttempts = 10; // 最大試行回数 (今回は使わないが、将来的に追加可能)

// === ゲームの初期化関数 ===
// ゲームが開始またはリセットされるときに呼び出されます
function initializeGame() {
    // 1から100までのランダムな整数を生成します
    // Math.random()は0以上1未満の乱数を生成
    // (Math.random() * 100)は0以上100未満
    // Math.floor(...)で小数点以下を切り捨てて整数に
    // + 1 で1から100の範囲に調整
    //randomNumber = Math.floor(Math.random() * 100) + 1;    
    // // -99999から99999までのランダムな整数を生成します
    const minNum = -99999;
    const maxNum = 99999;
    randomNumber = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    attempts = 0; // 試行回数をリセット
    messageDisplay.textContent = ''; // メッセージをクリア
    attemptsDisplay.textContent = ''; // 試行回数表示をクリア
    guessInput.value = ''; // 入力欄をクリア
    guessInput.disabled = false; // 入力欄を有効にする
    submitGuessButton.disabled = false; // 送信ボタンを有効にする
    resetButton.style.display = 'none'; // リセットボタンを非表示にする
    guessInput.focus(); // 入力欄にカーソルを合わせる
    console.log('ゲーム開始！秘密の数字は ' + randomNumber + ' です。'); // デバッグ用
}

// === 予想をチェックする関数 ===
function checkGuess() {
    const userGuess = parseInt(guessInput.value); // 入力された値を数値に変換

    // 入力が有効な数字かチェック
    if (isNaN(userGuess) || userGuess < -99999 || userGuess > 99999) {
        messageDisplay.textContent = '-99999から99999までの有効な数字を入力してください。';
        return; // 無効な入力なら処理を中断
    }

    attempts++; // 試行回数を増やす
    attemptsDisplay.textContent = `試行回数: ${attempts}回`; // 試行回数を表示

    // 予想が正しいかチェック
    if (userGuess === randomNumber) {
        messageDisplay.textContent = `正解！${randomNumber}でした！ ${attempts}回で当てました！`;
        endGame(true); // ゲーム終了（成功）
    } else if (userGuess < randomNumber) {
        messageDisplay.textContent = 'もっと大きい数字です！';
    } else {
        messageDisplay.textContent = 'もっと小さい数字です！';
    }
}

// === ゲーム終了処理関数 ===
function endGame(isWin) {
    guessInput.disabled = true; // 入力欄を無効にする
    submitGuessButton.disabled = true; // 送信ボタンを無効にする
    resetButton.style.display = 'block'; // リセットボタンを表示する
}

// === イベントリスナーの設定 ===
// 予想送信ボタンがクリックされたらcheckGuess関数を呼び出す
submitGuessButton.addEventListener('click', checkGuess);

// 入力欄でEnterキーが押されたらcheckGuess関数を呼び出す
guessInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        checkGuess();
    }
});

// リセットボタンがクリックされたらinitializeGame関数を呼び出す
resetButton.addEventListener('click', initializeGame);

// === ページの読み込みが完了したらゲームを初期化 ===
// これでページを開いたときにゲームが自動的にスタートします
document.addEventListener('DOMContentLoaded', initializeGame);