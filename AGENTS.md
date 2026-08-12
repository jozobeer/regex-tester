# 正規表現テスター

このリポジトリは kojo が生成した単一ページWebアプリです。

## アイデア

# 正規表現テスター

正規表現パターンとテスト対象の文字列をその場で入力し、マッチ箇所をハイライト表示して確認できる静的ツール。

## 意図

コードを書きながら正規表現の挙動を本番コードで試す前に、手元でさっと検証したいエンジニアが、値を保存せず使い捨てで確認するための道具。

## 受け入れ条件の種

- 正規表現パターンとテスト対象文字列を入力すると、パターンに一致した箇所が本文中でハイライト表示される
- グローバルフラグ(g)の有無で一致件数の表示が変わる
- 無効な正規表現（構文エラー）を入力するとエラーメッセージが表示され、ハイライトは行われない


## 技術スタック（不変）

- バニラJS・単一 `public/index.html`（CSS/JSインライン）・ビルドなし
- 配信: Cloudflare Workers assets（`wrangler.jsonc`）
- テスト: Playwright（`tests/app.spec.ts`、`npm test`）
- 保守時もこのスタックを維持すること。フレームワーク・ビルドツール・宣言外ライブラリの導入は禁止

## 制約

- 静的アプリ（`public/` 配下のみ）。サーバコード・外部API・ビルドツールは使わない
- `public/index.html` を単一ファイルで完結させる（CSS/JSインライン可）
- PLAN.md の受け入れ条件それぞれに対応するテストを `tests/app.spec.ts` に追記し、`npm test` が通ること（雛形のスモークテストは削除しない）
- favicon を `<link rel="icon" href="data:image/svg+xml,...">` のインライン data URI で含める（外部ファイル・外部URL不可。アプリのテーマに合った絵柄にする）
- hub（apps.jozo.beer）へのフッター導線を入れる。マークアップは次のとおり固定する:

  ```html
  <footer style="margin-top:3rem;text-align:center;font-size:.8rem;opacity:.6">
    <a href="https://apps.jozo.beer" style="color:inherit">apps.jozo.beer</a>
  </footer>
  ```

  スタイル（リンク色を含む）はアプリのテーマに合わせて調整してよいが、リンク先 `https://apps.jozo.beer` とリンクテキスト `apps.jozo.beer` は変えない。リンク色を変える場合は背景とのコントラストを確保すること

  配置は縦方向の通常フローの最下部に統合する。body がセンタリングレイアウト（display:flex / display:grid で中央寄せ）の場合、`</body>` 直前に置くと footer がその flex/grid アイテムになりレイアウトが崩れる（row 方向 flex では横並びになる）ため、body を flex-direction: column にするか、センタリング済みメインコンテナ内の末尾に置くこと。それ以外の場合は `</body>` 直前でよい
- README.md はテンプレートが生成済み。削除しないこと
- apple-touch-icon / manifest / og-image / robots / sitemap は factory が公開時に自動生成するため、builder は書かない
- 完成条件: PLAN.md の受け入れ条件をすべて満たし、`npm run verify` と `npm test` が通ること
