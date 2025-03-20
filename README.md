# HTTP Playground with DNS Lookup

HTTP リクエストのテストと DNS ルックアップ機能を提供する Web アプリケーション。

## 機能

- HTTP リクエストのテスト（GET, POST, PUT, DELETE）
- カスタムヘッダーとリクエストボディの設定
- レスポンス詳細の表示（ステータス、ヘッダー、ボディ）
- DNS ルックアップ（ドメイン名から IP アドレスの解決）

## 必要要件

### フロントエンド

- Node.js (v18 以上)
- npm (v9 以上)

### バックエンド

- Rust (1.70 以上)
- Cargo

## セットアップ

1. リポジトリのクローン:

```bash
git clone [repository-url]
cd from-200-to-render
```

2. バックエンドの起動:

```bash
cd backend
cargo run
# サーバーが http://localhost:8080 で起動します
```

3. フロントエンドの起動:

```bash
cd frontend
npm install
npm run dev
# アプリケーションが http://localhost:3001 で起動します
```

## プロジェクト構成

```
.
├── frontend/
│   ├── src/
│   │   ├── components/  # UIコンポーネント
│   │   ├── styles/      # CSSスタイル
│   │   ├── types/       # 型定義
│   │   └── api/         # APIクライアント
│   └── ...
└── backend/
    ├── src/
    │   ├── handlers/    # APIハンドラー
    │   ├── models/      # データモデル
    │   └── utils/       # ユーティリティ関数
    └── ...
```

## API エンドポイント

### HTTP リクエストテスト

- `GET /echo` - GET リクエストのテスト
- `POST /echo` - POST リクエストのテスト
- `PUT /echo` - PUT リクエストのテスト
- `DELETE /echo` - DELETE リクエストのテスト

### DNS ルックアップ

- `POST /dns-lookup` - ドメイン名の DNS 解決
  - リクエストボディ: `{ "domain": "example.com" }`
  - レスポンス: `{ "ips": ["93.184.216.34"] }`

## 開発

- フロントエンドの開発サーバーはホットリロードに対応しています
- バックエンドの変更は再起動が必要です
- `npm run build`でフロントエンドのプロダクションビルドを生成できます
