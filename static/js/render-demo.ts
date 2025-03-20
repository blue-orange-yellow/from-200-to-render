interface LogEntry {
    message: string;
    timestamp: string;
}

interface DOMEventDetails {
    type: string;
    target: Element;
}

// レンダリングプロセスのイベントを記録する関数
function logEvent(message: string): void {
    const eventLog: HTMLElement | null = document.getElementById('event-log');
    if (!eventLog) return;

    const now = new Date();
    const timestamp: string = `${now.toLocaleTimeString('ja-JP', { 
        hour12: false
    })}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    
    const logEntry: HTMLParagraphElement = document.createElement('p');
    const timestampSpan: HTMLSpanElement = document.createElement('span');
    timestampSpan.className = 'timestamp';
    timestampSpan.textContent = `[${timestamp}]`;
    
    logEntry.appendChild(timestampSpan);
    logEntry.appendChild(document.createTextNode(message));
    eventLog.appendChild(logEntry);
    
    // スクロールを最下部に移動
    eventLog.scrollTop = eventLog.scrollHeight;
}

// DOMの読み込みを監視
document.addEventListener('DOMContentLoaded', (): void => {
    logEvent('DOMContentLoaded イベントが発火しました');
    
    // DOM要素の変更を監視
    const observer: MutationObserver = new MutationObserver((mutations: MutationRecord[]): void => {
        mutations.forEach((mutation: MutationRecord): void => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node: Node): void => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as Element;
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
window.addEventListener('load', (): void => {
    logEvent('load イベントが発火しました（全てのリソースが読み込まれました）');
    
    // CSSの読み込み状態を確認
    const styleSheets: StyleSheetList = document.styleSheets;
    logEvent(`読み込まれたスタイルシート数: ${styleSheets.length}`);
    
    // 画像の読み込み状態を確認
    const images: HTMLCollectionOf<HTMLImageElement> = document.getElementsByTagName('img');
    logEvent(`読み込まれた画像数: ${images.length}`);
});

// 非同期スクリプトのデモ
setTimeout((): void => {
    logEvent('非同期スクリプトが実行されました（1秒後）');
}, 1000);

// エラーハンドリングのデモ
window.addEventListener('error', (event: ErrorEvent): void => {
    logEvent(`エラーが発生しました: ${event.message}`);
}); 