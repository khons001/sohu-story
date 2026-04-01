const hero = document.querySelector(".hero");
const video = document.querySelector(".hero__video");
const moreTrigger = document.querySelector("[data-more-trigger]");
const moreCard = document.querySelector(".more-card");
const moreClose = document.querySelector("[data-more-close]");
const pleaCard = document.querySelector(".more-card--plea");

const prefetchedPages = new Set();

const prefetchPage = (url) => {
  if (!url || prefetchedPages.has(url)) return;
  prefetchedPages.add(url);

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.as = "document";
  link.href = url;
  document.head.appendChild(link);
};

if (hero && video) {
  const markReady = () => hero.classList.add("is-video-ready");

  if (video.readyState >= 2) {
    markReady();
  } else {
    video.addEventListener("canplay", markReady, { once: true });
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!reducedMotion.matches) {
    const autoplayAttempt = video.play();
    if (autoplayAttempt && typeof autoplayAttempt.catch === "function") {
      autoplayAttempt.catch(() => {
        hero.classList.remove("is-video-ready");
      });
    }
  }
}

if (moreTrigger && moreCard) {
  const setMoreState = (open) => {
    moreCard.classList.toggle("is-open", open);
    moreCard.setAttribute("aria-hidden", String(!open));
    moreTrigger.setAttribute("aria-expanded", String(open));
  };

  const setPleaState = (open) => {
    if (!pleaCard) return;
    pleaCard.classList.toggle("is-open", open);
    pleaCard.setAttribute("aria-hidden", String(!open));
  };

  moreTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = moreCard.classList.contains("is-open");
    setMoreState(!isOpen);
    if (!isOpen) {
      setPleaState(false);
    }
  });

  if (moreClose) {
    moreClose.addEventListener("click", (event) => {
      event.stopPropagation();
      setMoreState(false);
      setPleaState(true);
    });
  }

  document.addEventListener("click", (event) => {
    if (!moreCard.contains(event.target) && !moreTrigger.contains(event.target)) {
      setMoreState(false);
      setPleaState(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMoreState(false);
      setPleaState(false);
    }
  });
}

const internalPageLinks = Array.from(document.querySelectorAll("a[href$='.html']"))
  .map((link) => link.getAttribute("href"))
  .filter(Boolean);

for (const href of internalPageLinks) {
  prefetchPage(href);
}

for (const link of document.querySelectorAll("a[href$='.html']")) {
  const href = link.getAttribute("href");
  if (!href) continue;

  link.addEventListener(
    "pointerenter",
    () => {
      prefetchPage(href);
    },
    { once: true }
  );

  link.addEventListener(
    "touchstart",
    () => {
      prefetchPage(href);
    },
    { once: true, passive: true }
  );
}
