// js/welcome.js

document.addEventListener('DOMContentLoaded', () => {
    const welcomeOverlay = document.getElementById('welcome-overlay');
    const body = document.body;
    const hasVisited = localStorage.getItem('hasVisitedHomePage');

    // ★まず、ページの本体を初期表示する
    // この行は、if/elseの外に置き、常に実行されるようにする
    // ただし、初回訪問時はwelcomeOverlayが完全に消えた後に実行したいので、少しロジックを変更します。

    if (!hasVisited) {
        // 初回訪問の場合
        // オーバーレイはHTMLで最初から表示されている状態なので、そのまま表示
        // bodyはCSSで非表示になっているが、初回訪問時はオーバーレイがあるのでまだvisibleにしない

        localStorage.setItem('hasVisitedHomePage', 'true');

        const welcomeDisplayDuration = 2000; // 「ようこそ」表示時間
        const overlayFadeDuration = 1000;    // オーバーレイのフェードアウト時間

        // 「ようこそ」オーバーレイの表示時間後に消し始める
        setTimeout(() => {
            if (welcomeOverlay) {
                welcomeOverlay.classList.add('hidden'); // フェードアウト開始
                welcomeOverlay.addEventListener('transitionend', () => {
                    welcomeOverlay.remove(); // オーバーレイをDOMから削除
                    body.classList.add('visible'); // ★オーバーレイが消えた後、bodyを表示
                }, { once: true });
            } else {
                // welcomeOverlayが見つからない場合（HTMLのミスなど）でもbodyを表示
                body.classList.add('visible');
            }
        }, welcomeDisplayDuration);

    } else {
        // 2回目以降の訪問時（リロードや他ページからの遷移も含む）
        // オーバーレイをすぐに非表示にしてDOMから削除
        if (welcomeOverlay) {
            welcomeOverlay.remove();
        }
        // ★bodyをすぐに表示
        body.classList.add('visible');
    }
});