/**
 * サーバー配信テスト
 * ローカルHTTPサーバーでサイトを配信し、実際のHTTPレスポンスを検証する
 * GitHub Pages での表示と同等の動作確認を行う
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const PORT = 0; // OS が空きポートを自動割り当て

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json",
};

let server;
let baseUrl;

function createStaticServer() {
  return http.createServer((req, res) => {
    const urlPath = req.url === "/" ? "/index.html" : req.url;
    const filePath = path.join(ROOT_DIR, urlPath);
    const ext = path.extname(filePath);

    // パストラバーサル防止
    if (!filePath.startsWith(ROOT_DIR)) {
      res.writeHead(403);
      res.end();
      return;
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }

    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
}

function fetch(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`${baseUrl}${urlPath}`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
      res.on("error", reject);
    }).on("error", reject);
  });
}

beforeAll((done) => {
  server = createStaticServer();
  server.listen(PORT, "127.0.0.1", () => {
    const addr = server.address();
    baseUrl = `http://127.0.0.1:${addr.port}`;
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

// ==========================================
// ページ応答の確認
// ==========================================
describe("ページ応答", () => {
  test("トップページが 200 で返る", async () => {
    const res = await fetch("/");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/html");
  });

  test("トップページに HTML コンテンツが含まれる", async () => {
    const res = await fetch("/");
    expect(res.body).toContain("<!DOCTYPE html>");
    expect(res.body).toContain("</html>");
  });

  test("存在しないページが 404 で返る", async () => {
    const res = await fetch("/nonexistent-page.html");
    expect(res.status).toBe(404);
  });
});

// ==========================================
// 静的アセットの配信確認
// ==========================================
describe("静的アセットの配信", () => {
  test("style.css が 200 で配信される", async () => {
    const res = await fetch("/style.css");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/css");
  });

  test("script.js が 200 で配信される", async () => {
    const res = await fetch("/script.js");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("javascript");
  });

  test("favicon.png が 200 で配信される", async () => {
    const res = await fetch("/favicon.png");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("image/png");
  });
});

// ==========================================
// ページ内の主要コンテンツ確認
// ==========================================
describe("配信されるHTMLの主要コンテンツ", () => {
  let html;

  beforeAll(async () => {
    const res = await fetch("/");
    html = res.body;
  });

  test("会社名が表示されている", () => {
    expect(html).toContain("LifePlus");
  });

  test("ナビゲーションリンクが含まれている", () => {
    expect(html).toContain('href="#about"');
    expect(html).toContain('href="#contact"');
  });

  test("主要セクションIDが含まれている", () => {
    const sectionIds = ["about", "employment", "services", "grouphome", "facilities", "contact"];
    sectionIds.forEach((id) => {
      expect(html).toContain(`id="${id}"`);
    });
  });

  test("CSSファイルへの参照が含まれている", () => {
    expect(html).toContain('href="style.css"');
  });

  test("JSファイルへの参照が含まれている", () => {
    expect(html).toContain('src="script.js"');
  });
});

// ==========================================
// 画像ファイルの配信確認
// ==========================================
describe("画像の配信", () => {
  test("ヒーロー画像が 200 で配信される", async () => {
    const res = await fetch("/images/hero.png");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("image/png");
  });

  test("HTMLから参照されている全画像が配信可能", async () => {
    const indexHtml = fs.readFileSync(path.join(ROOT_DIR, "index.html"), "utf8");
    const imgMatches = indexHtml.match(/src="(images\/[^"]+)"/g) || [];
    const imgPaths = imgMatches.map((m) => "/" + m.match(/src="([^"]+)"/)[1]);

    for (const imgPath of imgPaths) {
      const res = await fetch(imgPath);
      expect(res.status).toBe(200);
    }
  });
});
