/**
 * HTML構造テスト
 * index.html の必須要素・セクション・ナビゲーションが正しく存在するかを検証する
 */

const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");

let document;

beforeAll(() => {
  document = new DOMParser().parseFromString(html, "text/html");
});

// ==========================================
// <head> 内の基本要素
// ==========================================
describe("head要素", () => {
  test("DOCTYPE宣言が存在する", () => {
    expect(html.trim().startsWith("<!DOCTYPE html>")).toBe(true);
  });

  test("lang属性が ja に設定されている", () => {
    const htmlEl = document.querySelector("html");
    expect(htmlEl.getAttribute("lang")).toBe("ja");
  });

  test("charset が UTF-8 に設定されている", () => {
    const meta = document.querySelector('meta[charset="UTF-8"]');
    expect(meta).not.toBeNull();
  });

  test("viewport メタタグが存在する", () => {
    const meta = document.querySelector('meta[name="viewport"]');
    expect(meta).not.toBeNull();
    expect(meta.getAttribute("content")).toContain("width=device-width");
  });

  test("title が設定されている", () => {
    const title = document.querySelector("title");
    expect(title).not.toBeNull();
    expect(title.textContent.length).toBeGreaterThan(0);
  });

  test("meta description が設定されている", () => {
    const meta = document.querySelector('meta[name="description"]');
    expect(meta).not.toBeNull();
    expect(meta.getAttribute("content").length).toBeGreaterThan(0);
  });

  test("favicon が設定されている", () => {
    const link = document.querySelector('link[rel="icon"]');
    expect(link).not.toBeNull();
  });

  test("CSSファイルが読み込まれている", () => {
    const link = document.querySelector('link[rel="stylesheet"][href="style.css"]');
    expect(link).not.toBeNull();
  });
});

// ==========================================
// SEO・OGP関連
// ==========================================
describe("SEO・OGP", () => {
  test("canonical URL が設定されている", () => {
    const link = document.querySelector('link[rel="canonical"]');
    expect(link).not.toBeNull();
  });

  test("og:title が設定されている", () => {
    const meta = document.querySelector('meta[property="og:title"]');
    expect(meta).not.toBeNull();
    expect(meta.getAttribute("content").length).toBeGreaterThan(0);
  });

  test("og:description が設定されている", () => {
    const meta = document.querySelector('meta[property="og:description"]');
    expect(meta).not.toBeNull();
  });

  test("og:image が設定されている", () => {
    const meta = document.querySelector('meta[property="og:image"]');
    expect(meta).not.toBeNull();
    expect(meta.getAttribute("content")).toContain("https://");
  });

  test("og:type が設定されている", () => {
    const meta = document.querySelector('meta[property="og:type"]');
    expect(meta).not.toBeNull();
  });

  test("Twitter Card が設定されている", () => {
    const meta = document.querySelector('meta[property="twitter:card"]');
    expect(meta).not.toBeNull();
  });

  test("JSON-LD 構造化データが存在する", () => {
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const data = JSON.parse(script.textContent);
    expect(data["@type"]).toBe("LocalBusiness");
    expect(data.name).toBe("Life Plus株式会社");
    expect(data.telephone).toBeDefined();
    expect(data.address).toBeDefined();
  });
});

// ==========================================
// ヘッダー・ナビゲーション
// ==========================================
describe("ヘッダー・ナビゲーション", () => {
  test("header 要素が存在する", () => {
    expect(document.querySelector("header.header")).not.toBeNull();
  });

  test("ロゴが存在する", () => {
    const logo = document.querySelector(".logo");
    expect(logo).not.toBeNull();
    expect(logo.textContent).toContain("LifePlus");
  });

  test("nav 要素が存在する", () => {
    expect(document.querySelector("nav.nav")).not.toBeNull();
  });

  test("ナビゲーションリンクが5つ存在する", () => {
    const navLinks = document.querySelectorAll(".nav .nav-link");
    expect(navLinks.length).toBe(5);
  });

  test("モバイルメニューボタンが存在する", () => {
    const btn = document.querySelector(".menu-btn");
    expect(btn).not.toBeNull();
    expect(btn.getAttribute("aria-label")).toBeDefined();
  });

  const expectedNavTargets = ["#about", "#employment", "#grouphome", "#facilities", "#contact"];
  test.each(expectedNavTargets)("ナビゲーションに %s へのリンクがある", (href) => {
    const link = document.querySelector(`.nav a[href="${href}"]`);
    expect(link).not.toBeNull();
  });
});

// ==========================================
// 各セクションの存在
// ==========================================
describe("ページセクション", () => {
  test("ヒーローセクションが存在する", () => {
    expect(document.querySelector(".hero")).not.toBeNull();
  });

  test("h1 タイトルが存在する", () => {
    const h1 = document.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1.textContent.length).toBeGreaterThan(0);
  });

  const sectionIds = ["about", "employment", "services", "grouphome", "facilities", "contact"];
  test.each(sectionIds)("セクション #%s が存在する", (id) => {
    const section = document.getElementById(id);
    expect(section).not.toBeNull();
  });

  test("フッターが存在する", () => {
    expect(document.querySelector("footer.footer")).not.toBeNull();
  });

  test("コピーライト表記が存在する", () => {
    const footer = document.querySelector(".footer-bottom");
    expect(footer).not.toBeNull();
    expect(footer.textContent).toContain("ライフプラス");
  });
});

// ==========================================
// コンテンツの検証
// ==========================================
describe("コンテンツ", () => {
  test("特徴カードが3つ存在する", () => {
    const cards = document.querySelectorAll(".feature-card");
    expect(cards.length).toBe(3);
  });

  test("サービスカードが存在する", () => {
    const cards = document.querySelectorAll(".service-card");
    expect(cards.length).toBeGreaterThanOrEqual(2);
  });

  test("施設カードが3つ存在する", () => {
    const cards = document.querySelectorAll(".facility-card");
    expect(cards.length).toBe(3);
  });

  test("お問い合わせ電話番号が表示されている", () => {
    const phoneLink = document.querySelector('a[href="tel:0154-65-9387"]');
    expect(phoneLink).not.toBeNull();
  });

  test("CTAボタンが存在する", () => {
    const buttons = document.querySelectorAll(".btn");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });
});

// ==========================================
// 画像の検証
// ==========================================
describe("画像", () => {
  test("全ての img に alt 属性が設定されている", () => {
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      expect(img.hasAttribute("alt")).toBe(true);
    });
  });

  test("ヒーロー画像が存在する", () => {
    const heroImg = document.querySelector('.hero-image img[src="images/hero.png"]');
    expect(heroImg).not.toBeNull();
  });
});

// ==========================================
// JavaScript の読み込み
// ==========================================
describe("スクリプト", () => {
  test("script.js が読み込まれている", () => {
    const script = document.querySelector('script[src="script.js"]');
    expect(script).not.toBeNull();
  });

  test("Google Analytics が設定されている", () => {
    const gaScript = document.querySelector('script[src*="googletagmanager"]');
    expect(gaScript).not.toBeNull();
  });
});
