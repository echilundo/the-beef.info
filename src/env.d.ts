/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface FocusManagerApi {
  announce: (message: string, priority?: "polite" | "assertive") => void;
}

interface Window {
  focusManager?: FocusManagerApi;
}
