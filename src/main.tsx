import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BlinkUIProvider, Toaster } from "@blinkdotnew/ui";
import { ClerkProvider } from "@clerk/react";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN as
  | string
  | undefined;
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST as
  | string
  | undefined;

/* ── Preloader: set theme-aware background immediately ── */
const preloaderStartTime = performance.now();
const PRELOADER_MIN_DISPLAY_MS = 1200; // minimum animation time

const preloaderEl = document.getElementById("app-preloader");
const stored = localStorage.getItem("bipul-theme");
const startDark = stored === "dark";

// Apply preloader theme class before React paints
if (preloaderEl) {
  if (!startDark) {
    preloaderEl.classList.add("light-preloader");
  }
}

/** Restore the original Creativity light theme unless the user chose dark mode. */
document.documentElement.classList.add("theme-midnight");
document.documentElement.classList.remove(startDark ? "light" : "dark");
document.documentElement.classList.add(startDark ? "dark" : "light");
document.documentElement.setAttribute(
  "data-theme",
  startDark ? "dark" : "light",
);
if (!stored) localStorage.setItem("bipul-theme", "light");

/** Dismiss the liquid glass preloader with a smooth fade-out. */
function dismissPreloader() {
  if (!preloaderEl) return;
  const elapsed = performance.now() - preloaderStartTime;
  const remaining = Math.max(0, PRELOADER_MIN_DISPLAY_MS - elapsed);

  setTimeout(() => {
    preloaderEl.classList.add("fade-out");
    // Remove from DOM after transition completes
    preloaderEl.addEventListener(
      "transitionend",
      () => {
        preloaderEl.remove();
        // Clean up the inline preloader styles too
        document.getElementById("preloader-styles")?.remove();
      },
      { once: true },
    );
    // Fallback removal if transitionend doesn't fire
    setTimeout(() => {
      if (preloaderEl.parentNode) {
        preloaderEl.remove();
        document.getElementById("preloader-styles")?.remove();
      }
    }, 800);
  }, remaining);
}

async function bootstrap() {
  const root = document.getElementById("root");
  if (!root) {
    throw new Error('Root element "#root" not found');
  }

  let tree = (
    <QueryClientProvider client={queryClient}>
      {/* class mode: we own dark/light on <html> */}
      <BlinkUIProvider theme="midnight">
        <Toaster />
        <App />
      </BlinkUIProvider>
    </QueryClientProvider>
  );

  const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;
  if (clerkKey) {
    tree = <ClerkProvider publishableKey={clerkKey}>{tree}</ClerkProvider>;
  }

  if (posthogKey) {
    const { PostHogProvider } = await import("@posthog/react");
    tree = (
      <PostHogProvider
        apiKey={posthogKey}
        options={{
          api_host: posthogHost || "https://us.i.posthog.com",
        }}>
        {tree}
      </PostHogProvider>
    );
  }

  ReactDOM.createRoot(root).render(
    <React.StrictMode>{tree}</React.StrictMode>,
  );

  // Dismiss preloader after React has mounted
  // Use requestIdleCallback for smooth handoff, fallback to rAF
  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(dismissPreloader);
  } else {
    requestAnimationFrame(() => setTimeout(dismissPreloader, 0));
  }
}

bootstrap().catch((err) => {
  console.error("Failed to bootstrap app:", err);
  // Dismiss preloader even on error so the error state is visible
  dismissPreloader();
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML =
      '<div style="color:#fff;padding:2rem;font-family:system-ui">App failed to load. Check the console.</div>';
  }
});
