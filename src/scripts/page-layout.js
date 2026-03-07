// Performance monitoring
const PerformanceMonitor = {
  init() {
    if ("performance" in window) {
      window.addEventListener("load", () => {
        const entries = performance.getEntriesByType("navigation");
        if (entries.length > 0) {
          const timing = entries[0];
          const loadTime = timing.loadEventEnd - timing.startTime;
          // TODO: Send to analytics if needed
          void loadTime;
        }
      });
    }
  }
};

// Error handling
const ErrorHandler = {
  init() {
    window.addEventListener("error", (event) => {
      console.error("Global error:", event.error);
      const errorBoundary = document.getElementById("error-boundary");
      if (errorBoundary) errorBoundary.classList.remove("hidden");
    });

    window.addEventListener("unhandledrejection", (event) => {
      console.error("Unhandled promise rejection:", event.reason);
    });
  }
};

// Loading indicator
const LoadingIndicator = {
  init() {
    const indicator = document.getElementById("loading-indicator");
    if (!indicator) return;

    // * astro:before-preparation fires when a navigation begins (show the bar).
    document.addEventListener("astro:before-preparation", () => {
      indicator.classList.remove("scale-x-0");
    });

    // * astro:page-load fires when the incoming page is fully ready (hide the bar).
    document.addEventListener("astro:page-load", () => {
      indicator.classList.add("scale-x-0");
    });
  }
};

// Use requestIdleCallback for non-critical operations
const scheduleIdleTask = (callback) => {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(callback, { timeout: 1000 });
  } else {
    setTimeout(callback, 1);
  }
};

// Optimized scroll handling with RAF
const ScrollHandler = {
  init() {
    const backToTopButton = document.getElementById("backToTop");
    const lastUpdateButton = document.getElementById("lastUpdate");

    if (!backToTopButton || !lastUpdateButton) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
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

    backToTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    lastUpdateButton.addEventListener("click", () => {
      window.scrollTo({ 
        top: document.documentElement.scrollHeight,
        behavior: "smooth"
      });
    });

    handleScroll();
  }
};

// * astro:page-load fires after every navigation (hard load + soft View Transition),
//   so re-initializing here ensures event listeners are attached to the fresh DOM.
document.addEventListener("astro:page-load", () => {
  PerformanceMonitor.init();
  ErrorHandler.init();
  LoadingIndicator.init();
  
  scheduleIdleTask(() => {
    ScrollHandler.init();
  });
});
