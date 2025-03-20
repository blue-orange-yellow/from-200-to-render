"use strict";
// レンダリングプロセスのイベントを記録する関数
function logEvent(message) {
    const eventLog = document.getElementById('event-log');
    if (!eventLog)
        return;
    const now = new Date();
    const timestamp = `${now.toLocaleTimeString('ja-JP', {
        hour12: false
    })}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    const logEntry = document.createElement('p');
    const timestampSpan = document.createElement('span');
    timestampSpan.className = 'timestamp';
    timestampSpan.textContent = `[${timestamp}]`;
    logEntry.appendChild(timestampSpan);
    logEntry.appendChild(document.createTextNode(message));
    eventLog.appendChild(logEntry);
    // スクロールを最下部に移動
    eventLog.scrollTop = eventLog.scrollHeight;
}
// DOMの読み込みを監視
document.addEventListener('DOMContentLoaded', () => {
    logEvent('DOMContentLoaded イベントが発火しました');
    // DOM要素の変更を監視
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node;
                        logEvent(`新しい要素が追加されました: <${element.tagName.toLowerCase()}>`);
                    }
                });
            }
        });
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});
// ページの完全な読み込みを監視
window.addEventListener('load', () => {
    logEvent('load イベントが発火しました（全てのリソースが読み込まれました）');
    // CSSの読み込み状態を確認
    const styleSheets = document.styleSheets;
    logEvent(`読み込まれたスタイルシート数: ${styleSheets.length}`);
    // 画像の読み込み状態を確認
    const images = document.getElementsByTagName('img');
    logEvent(`読み込まれた画像数: ${images.length}`);
});
// 非同期スクリプトのデモ
setTimeout(() => {
    logEvent('非同期スクリプトが実行されました（1秒後）');
}, 1000);
// エラーハンドリングのデモ
window.addEventListener('error', (event) => {
    logEvent(`エラーが発生しました: ${event.message}`);
});
//# sourceMappingURL=render-demo.js.map