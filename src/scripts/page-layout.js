// Performance monitoring
const PerformanceMonitor = {
  init() {
    if ("performance" in window) {
      window.addEventListener("load", () => {
        const entries = performance.getEntriesByType("navigation");
        if (entries.length > 0) {
          const timing = entries[0];
          const loadTime = timing.loadEventEnd - timing.startTime;
          console.log("Page load time:", loadTime);
          // Send to analytics if needed
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
      // Show error boundary
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

    // Show loading indicator on navigation
    document.addEventListener("astro:page-load", () => {
      indicator.classList.remove("scale-x-0");
    });

    // Hide loading indicator when page is loaded
    document.addEventListener("astro:after-swap", () => {
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

          // Always show back to top button when scrolled down enough
          backToTopButton.classList.toggle("visible", scrollY > showThreshold);

          // Show last update button except when at the very bottom
          lastUpdateButton.classList.toggle("visible",
            scrollY + viewportHeight < documentHeight - 20
          );

          ticking = false;
        });
        ticking = true;
      }
    };

    // Passive scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Smooth scroll handlers
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    lastUpdateButton.addEventListener("click", () => {
      window.scrollTo({ 
        top: document.documentElement.scrollHeight,
        behavior: "smooth"
      });
    });

    // Initial check
    handleScroll();
  }
};

// Initialize all managers when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  PerformanceMonitor.init();
  ErrorHandler.init();
  LoadingIndicator.init();
  
  // Initialize scroll handler with idle callback
  scheduleIdleTask(() => {
    ScrollHandler.init();
  });
});
