# From 200 to Render

このプロジェクトは、Web ページが表示されるまでの過程を実践的に学ぶためのハンズオン教材です。

## 学習内容

1. **URL の構造とパース**

   - プロトコル、ホスト、パスの理解
   - クエリパラメータの処理
   - パスパラメータの活用

2. **DNS 名前解決**

   - ドメイン名から IP アドレスへの解決
   - 解決時間の計測
   - Round Robin DNS の理解

3. **HTTP リクエスト/レスポンス**

   - 各種 HTTP メソッド（GET, POST, PUT, DELETE）
   - ステータスコード
   - ヘッダー情報

4. **HTML レンダリングプロセス**
   - DOM の構築過程
   - CSS の適用タイミング
   - JavaScript の実行順序

## プロジェクト構造

```
.
├── backend/                 # バックエンド
│   ├── Cargo.toml
│   └── src/
│       ├── main.rs         # メインサーバーコード
│       └── dns_resolver.rs # DNS解決機能
└── frontend/               # フロントエンド
    ├── src/
    │   └── ts/
    │       └── render-demo.ts
    └── public/
        └── css/
            └── render-demo.css
```

## セットアップと実行

1. フロントエンドのビルド

```bash
cd frontend
npm install
npm run build
```

2. サーバーの起動

```bash
cd backend
cargo run
```

3. ブラウザでアクセス

```
http://localhost:8080
```

## 機能説明

### メインページ (`/`)

- リクエストの詳細表示
- DNS Lookup Tool
- HTTP Playground

### DNS Lookup (`/dns-lookup`)

- ドメイン名の名前解決
- 解決時間の計測

### HTTP メソッドテスト (`/echo`)

- 各種 HTTP メソッドの動作確認
- リクエスト/レスポンスの詳細表示

### レンダリングデモ (`/render-demo`)

- HTML レンダリングプロセスの可視化
- DOM イベントの監視
- リソース読み込みの追跡
