# 正規表現テスター

正規表現パターン・フラグ・テスト文字列を入力し、マッチ箇所のハイライトと件数表示をその場で確認する静的単一ページアプリ。値は保存せず、入力のたびに即時再評価する。

## 構成

- `public/index.html` — 本体。`#pattern` / `#flags`（初期値 `g`）/ `#test-input` を入力し、`#error`・`#match-count`・`#result`（`<mark>` ハイライト）を更新する。主要関数は `escapeHtml`・`collectMatches`・`highlight`・`render`
- `tests/app.spec.ts` — Playwright。ハイライト、`g` フラグ有無の件数差、構文エラー、即時更新、HTML エスケープ、0件表示、非永続化、Unicode 空マッチの無限ループ防止を検証
- `PLAN.md` — 初回実装時の計画（歴史的文書）。現状の正は README とテスト

## 技術スタック（不変）

- バニラJS・単一 `public/index.html`（CSS/JSインライン）・ビルドなし
- 配信: Cloudflare Workers assets（`wrangler.jsonc`）
- テスト: Playwright（`tests/app.spec.ts`、`npm test`）
- 保守時もこのスタックを維持すること。フレームワーク・ビルドツール・宣言外ライブラリの導入は禁止

## 品質不変条件

- favicon は `<link rel="icon" href="data:image/svg+xml,...">` のインライン data URI を維持する（外部ファイル・外部 URL 不可）
- hub へのフッター導線を壊さない。リンク先 `https://apps.jozo.beer` とリンクテキスト `apps.jozo.beer` は固定。マークアップの基準形:

  ```html
  <footer style="margin-top:3rem;text-align:center;font-size:.8rem;opacity:.6">
    <a href="https://apps.jozo.beer" style="color:inherit">apps.jozo.beer</a>
  </footer>
  ```

  スタイルはテーマに合わせて調整可。配置は縦方向フローの最下部（body が flex/grid 中央寄せのときはレイアウト崩れに注意）
- 変更後は `npm run verify` が通る状態を維持する

## 保守の進め方

1. 変更前に受け入れ条件を `tests/app.spec.ts` のテストにする
2. 実装する（`public/index.html`）
3. `npm test` で通す
4. `git commit` & `git push`
5. `npm run deploy`
