/**
 * ライフプラス - JavaScript
 * 就労継続支援B型事業所
 * モバイルメニュー・スムーススクロール
 */

document.addEventListener("DOMContentLoaded", function () {
  // ----------------------------------------
  // モバイルメニューの開閉
  // ----------------------------------------
  const menuBtn = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      nav.classList.toggle("active");

      // ハンバーガーアイコンのアニメーション
      menuBtn.classList.toggle("active");
    });

    // ナビリンクをクリックしたらメニューを閉じる
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("active");
        menuBtn.classList.remove("active");
      });
    });
  }

  // ----------------------------------------
  // スムーススクロール
  // ----------------------------------------
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

  smoothScrollLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // #のみの場合はスキップ
      if (href === "#") return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        // ヘッダーの高さを考慮
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ----------------------------------------
  // スクロール時のヘッダースタイル変更
  // ----------------------------------------
  const header = document.querySelector(".header");

  if (header) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        header.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.1)";
      } else {
        header.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.08)";
      }
    });
  }

  // ----------------------------------------
  // スクロールアニメーション（フェードイン）
  // ----------------------------------------
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // アニメーション対象の要素
  const animatedElements = document.querySelectorAll(
    ".feature-card, .service-card, .facility-card, .target-item"
  );

  animatedElements.forEach(function (el) {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
});
