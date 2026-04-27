/**
 * Schedules non-critical browser work during idle time.
 * Falls back to a short timeout when requestIdleCallback is unavailable.
 * @param {() => void} callback
 */
export const scheduleIdleTask = (callback) => {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(callback, { timeout: 1000 });
  } else {
    setTimeout(callback, 1);
  }
};
