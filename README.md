# 正規表現テスター

ブラウザ上で正規表現パターン・フラグ・テスト文字列を入力すると、マッチ箇所を `<mark>` でハイライトし件数を表示する静的ツール。入力のたびに即時再評価し、値は保存しない。無効なパターンはエラー表示のみでハイライトしない。HTML 特殊文字はエスケープして表示する。

## 公開URL

https://regex-tester.jozo.beer

## 開発

[kojo](https://github.com/jozobeer/kojo)（1日1アプリ自動生成基盤）により生成されたリポジトリです。

初回セットアップ: `npm install`（Playwright ブラウザ未取得の環境では `npx playwright install chromium`）

- `npm test` — Playwright によるブラウザテスト
- `npm run verify` — 不変条件チェック（favicon / apps.jozo.beer フッター）
- `npm run deploy` — Cloudflare Workers へデプロイ

## 構成

- `public/index.html` — アプリ本体（CSS/JSインラインの単一ファイル）
- `tests/app.spec.ts` — Playwright テスト（現状の振る舞いの正）
- `PLAN.md` — 初回実装時の計画（歴史的文書）
