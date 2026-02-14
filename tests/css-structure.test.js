/**
 * CSS構造テスト
 * style.css の基本的な構造とレスポンシブ対応を検証する
 */

const fs = require("fs");
const path = require("path");

const css = fs.readFileSync(path.resolve(__dirname, "../style.css"), "utf8");

describe("CSS変数の定義", () => {
  const expectedVars = [
    "--color-primary",
    "--color-secondary",
    "--color-bg",
    "--color-text",
    "--font-main",
  ];

  test.each(expectedVars)("CSS変数 %s が定義されている", (varName) => {
    expect(css).toContain(varName);
  });
});

describe("必須セレクタの存在", () => {
  const requiredSelectors = [
    ".header",
    ".hero",
    ".nav",
    ".container",
    ".section",
    ".feature-card",
    ".service-card",
    ".facility-card",
    ".contact",
    ".footer",
    ".btn",
  ];

  test.each(requiredSelectors)("セレクタ %s が定義されている", (selector) => {
    expect(css).toContain(selector);
  });
});

describe("レスポンシブ対応", () => {
  test("1024px ブレークポイントが存在する", () => {
    expect(css).toContain("max-width: 1024px");
  });

  test("768px ブレークポイントが存在する", () => {
    expect(css).toContain("max-width: 768px");
  });

  test("480px ブレークポイントが存在する", () => {
    expect(css).toContain("max-width: 480px");
  });
});

describe("アニメーション", () => {
  test("fadeInUp アニメーションが定義されている", () => {
    expect(css).toContain("@keyframes fadeInUp");
  });

  test("fadeInRight アニメーションが定義されている", () => {
    expect(css).toContain("@keyframes fadeInRight");
  });
});

describe("基本的なリセットスタイル", () => {
  test("box-sizing: border-box が設定されている", () => {
    expect(css).toContain("box-sizing: border-box");
  });

  test("ヘッダーが fixed ポジションである", () => {
    expect(css).toContain("position: fixed");
  });
});
