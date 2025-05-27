// script/welcome-gamen.js

document.addEventListener('DOMContentLoaded', () => {
    const welcomeOverlay = document.getElementById('welcome-overlay');
    const hasVisited = localStorage.getItem('hasVisitedHomePage'); // LocalStorageから訪問履歴を取得

    // 初めての訪問時のみオーバーレイを表示
    if (!hasVisited) {
        // オーバーレイを表示したことをLocalStorageに保存
        localStorage.setItem('hasVisitedHomePage', 'true');

        // 数秒後にフェードアウトして非表示にする
        setTimeout(() => {
            if (welcomeOverlay) {
                welcomeOverlay.classList.add('hidden');
                // アニメーション終了後に要素を完全に削除（任意）
                welcomeOverlay.addEventListener('transitionend', () => {
                    welcomeOverlay.remove();
                }, { once: true }); // イベントリスナーは一度だけ実行
            }
        }, 2000); // 2000ミリ秒（2秒）後に消える
    } else {
        // 2回目以降の訪問時は、最初からオーバーレイを非表示にする
        if (welcomeOverlay) {
            welcomeOverlay.classList.add('hidden');
            welcomeOverlay.remove(); // DOMからも削除
        }
    }
});