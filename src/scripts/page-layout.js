import { scheduleIdleTask } from "./browser-utils.js";

// Error handling
const ErrorHandler = {
  initialized: false,
  init() {
    if (this.initialized) return;
    this.initialized = true;

    window.addEventListener("error", (event) => {
      console.error("Global error:", event.error);
      const errorBoundary = document.getElementById("error-boundary");
      if (errorBoundary) {
        errorBoundary.classList.remove("hidden");
        errorBoundary.focus();
      }
    });

    window.addEventListener("unhandledrejection", (event) => {
      console.error("Unhandled promise rejection:", event.reason);
    });
  }
};

// Loading indicator
const LoadingIndicator = {
  initialized: false,
  init() {
    if (this.initialized) return;
    this.initialized = true;

    // * astro:before-preparation fires when a navigation begins (show the bar).
    document.addEventListener("astro:before-preparation", () => {
      const indicator = document.getElementById("loading-indicator");
      const statusText = document.getElementById("loading-indicator-text");
      if (!indicator) return;
      indicator.classList.remove("scale-x-0");
      if (statusText) statusText.textContent = "Loading page…";
    });

    // * astro:page-load fires when the incoming page is fully ready (hide the bar).
    document.addEventListener("astro:page-load", () => {
      const indicator = document.getElementById("loading-indicator");
      const statusText = document.getElementById("loading-indicator-text");
      if (!indicator) return;
      indicator.classList.add("scale-x-0");
      if (statusText) statusText.textContent = "";
    });
  }
};

// Optimized scroll handling with RAF
const ScrollHandler = {
  initialized: false,
  init() {
    if (this.initialized) return;
    this.initialized = true;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const backToTopButton = document.getElementById("backToTop");
          const lastUpdateButton = document.getElementById("lastUpdate");
          if (!backToTopButton || !lastUpdateButton) {
            ticking = false;
            return;
          }

          const scrollY = window.scrollY;
          const viewportHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          const showThreshold = 200;

          backToTopButton.classList.toggle("visible", scrollY > showThreshold);

          lastUpdateButton.classList.toggle("visible",
            scrollY + viewportHeight < documentHeight - 20
          );

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const backToTopButton = target.closest("#backToTop");
      if (backToTopButton) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const lastUpdateButton = target.closest("#lastUpdate");
      if (lastUpdateButton) {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth"
        });
      }
    });

    handleScroll();
  }
};

let bootstrapComplete = false;
document.addEventListener("astro:page-load", () => {
  if (bootstrapComplete) return;
  bootstrapComplete = true;

  ErrorHandler.init();
  LoadingIndicator.init();

  scheduleIdleTask(() => {
    ScrollHandler.init();
  });
});
