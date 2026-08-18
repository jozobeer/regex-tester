import { test, expect } from "@playwright/test";
import { pathToFileURL } from "node:url";

// 静的アプリなのでサーバ不要。kojo の visualGate と同じ file:// 方式で開く
const APP_URL = pathToFileURL("public/index.html").href;

test("ページがロードできページエラーが出ない", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(String(err)));
  await page.goto(APP_URL);
  await expect(page.locator("body")).toBeVisible();
  expect(errors).toEqual([]);
});

// このスモークは削除しないこと。機能テストは PLAN.md の受け入れ条件ごとに追記する

test("パターン一致箇所が本文中でハイライト表示される", async ({ page }) => {
  await page.goto(APP_URL);
  await page.fill("#pattern", "foo");
  await page.fill("#test-input", "foo bar foo");
  await expect(page.locator("#result mark")).toHaveCount(2);
  await expect(page.locator("#result mark").first()).toHaveText("foo");
});

test("gフラグの有無でハイライト件数と件数表示が変わる", async ({ page }) => {
  await page.goto(APP_URL);
  await page.fill("#pattern", "a");
  await page.fill("#test-input", "banana");
  await page.fill("#flags", "g");
  await expect(page.locator("#result mark")).toHaveCount(3);
  await expect(page.locator("#match-count")).toContainText("3件一致");

  await page.fill("#flags", "");
  await expect(page.locator("#result mark")).toHaveCount(1);
  await expect(page.locator("#match-count")).toContainText("1件一致");
});

test("無効な正規表現でエラー表示されハイライトされない", async ({ page }) => {
  await page.goto(APP_URL);
  await page.fill("#pattern", "[a-");
  await page.fill("#test-input", "abc");
  await expect(page.locator("#error")).not.toBeEmpty();
  await expect(page.locator("#result mark")).toHaveCount(0);
});

test("入力変更でボタンなしに結果が即時更新される", async ({ page }) => {
  await page.goto(APP_URL);
  await page.fill("#pattern", "cat");
  await page.fill("#test-input", "a cat");
  await expect(page.locator("#result mark")).toHaveCount(1);

  await page.fill("#test-input", "a cat and a cat");
  await expect(page.locator("#result mark")).toHaveCount(2);
});

test("HTML特殊文字はタグとして解釈されず文字として表示される", async ({ page }) => {
  await page.goto(APP_URL);
  await page.fill("#pattern", "alert");
  await page.fill("#test-input", '<script>alert(1)</script>');
  await expect(page.locator("#result script")).toHaveCount(0);
  await expect(page.locator("#result")).toContainText("<script>alert(1)</script>");
  await expect(page.locator("#result mark")).toHaveCount(1);
  await expect(page.locator("#result mark")).toHaveText("alert");
});
test("マッチ0件のときマッチなしであることが分かる表示になる", async ({ page }) => {
  await page.goto(APP_URL);
  await page.fill("#pattern", "zzz");
  await page.fill("#test-input", "hello");
  await expect(page.locator("#match-count")).toContainText("0件一致");
  await expect(page.locator("#result mark")).toHaveCount(0);
});

test("再読み込み後に入力値は復元されない", async ({ page }) => {
  await page.goto(APP_URL);
  await page.fill("#pattern", "persist");
  await page.fill("#flags", "gi");
  await page.fill("#test-input", "should not remain");
  await page.reload();
  await expect(page.locator("#pattern")).toHaveValue("");
  await expect(page.locator("#flags")).toHaveValue("g");
  await expect(page.locator("#test-input")).toHaveValue("");
});

test("Unicode空マッチでも無限ループせず件数表示される", async ({ page }) => {
  await page.goto(APP_URL);
  await page.fill("#pattern", "(?:)");
  await page.fill("#flags", "gu");
  await page.fill("#test-input", "😀");
  await expect(page.locator("#match-count")).toContainText("2件一致", {
    timeout: 2000,
  });
  await expect(page.locator("#error")).toBeEmpty();
});

test("meta description があり空でない", async ({ page }) => {
  await page.goto(APP_URL);
  const content = await page.locator('meta[name="description"]').getAttribute("content");
  expect(content?.trim()).toBeTruthy();
});

test("JSON-LD に WebApplication の必須フィールドがある", async ({ page }) => {
  await page.goto(APP_URL);
  const raw = await page.locator('script[type="application/ld+json"]').textContent();
  expect(raw?.trim()).toBeTruthy();

  const parsed = JSON.parse(raw!);
  const nodes = Array.isArray(parsed) ? parsed : [parsed];
  const app = nodes.find((node) => {
    const type = node?.["@type"];
    return type === "WebApplication" || (Array.isArray(type) && type.includes("WebApplication"));
  });

  expect(app).toBeTruthy();
  expect(String(app.name).trim()).toBeTruthy();
  expect(String(app.description).trim()).toBeTruthy();
  expect(String(app.url).trim()).toBeTruthy();
  expect(String(app.applicationCategory).trim()).toBeTruthy();
  expect(String(app.offers?.price)).toBe("0");
});

test("使い方とFAQのセクションがDOM上にある", async ({ page }) => {
  await page.goto(APP_URL);
  await expect(page.locator("#how-to")).toBeVisible();
  await expect(page.getByRole("heading", { name: "使い方" })).toBeVisible();
  await expect(page.locator("#faq")).toBeVisible();
  await expect(page.getByRole("heading", { name: "FAQ" })).toBeVisible();
});
