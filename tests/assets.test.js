/**
 * アセット存在確認テスト
 * HTML から参照されているファイルが実際に存在するかを検証する
 */

const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");

describe("必須ファイルの存在確認", () => {
  const requiredFiles = [
    "index.html",
    "style.css",
    "script.js",
    "favicon.png",
    "CNAME",
  ];

  test.each(requiredFiles)("%s が存在する", (file) => {
    const filePath = path.join(rootDir, file);
    expect(fs.existsSync(filePath)).toBe(true);
  });
});

describe("画像ファイルの存在確認", () => {
  const imageFiles = [
    "images/hero.png",
    "images/facility-kushiro.png",
  ];

  test.each(imageFiles)("%s が存在する", (file) => {
    const filePath = path.join(rootDir, file);
    expect(fs.existsSync(filePath)).toBe(true);
  });
});

describe("HTMLから参照されているローカルアセット", () => {
  let html;

  beforeAll(() => {
    html = fs.readFileSync(path.join(rootDir, "index.html"), "utf8");
  });

  test("CSS参照先のファイルが存在する", () => {
    const cssMatches = html.match(/href="([^"]+\.css)"/g) || [];
    cssMatches.forEach((match) => {
      const href = match.match(/href="([^"]+)"/)[1];
      // 外部URLはスキップ
      if (href.startsWith("http")) return;
      const filePath = path.join(rootDir, href);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  test("JS参照先のローカルファイルが存在する", () => {
    const jsMatches = html.match(/src="([^"]+\.js)"/g) || [];
    jsMatches.forEach((match) => {
      const src = match.match(/src="([^"]+)"/)[1];
      // 外部URLはスキップ
      if (src.startsWith("http")) return;
      const filePath = path.join(rootDir, src);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  test("画像参照先のローカルファイルが存在する", () => {
    const imgMatches = html.match(/src="(images\/[^"]+)"/g) || [];
    imgMatches.forEach((match) => {
      const src = match.match(/src="([^"]+)"/)[1];
      const filePath = path.join(rootDir, src);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});
