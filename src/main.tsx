import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BlinkUIProvider, Toaster } from "@blinkdotnew/ui";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN as
  | string
  | undefined;
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST as
  | string
  | undefined;

/** Apply theme class before React paints — avoids BlinkUI / FOUC fight */
const stored = localStorage.getItem("bipul-theme");
const startDark = stored !== "light";
document.documentElement.classList.add("theme-midnight");
document.documentElement.classList.remove(startDark ? "light" : "dark");
document.documentElement.classList.add(startDark ? "dark" : "light");
document.documentElement.setAttribute(
  "data-theme",
  startDark ? "dark" : "light",
);

async function bootstrap() {
  const root = document.getElementById("root");
  if (!root) {
    throw new Error('Root element "#root" not found');
  }

  let tree = (
    <QueryClientProvider client={queryClient}>
      {/* class mode: we own dark/light on <html> */}
      <BlinkUIProvider theme="midnight" darkMode="class">
        <Toaster />
        <App />
      </BlinkUIProvider>
    </QueryClientProvider>
  );

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
}

bootstrap().catch((err) => {
  console.error("Failed to bootstrap app:", err);
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML =
      '<div style="color:#fff;padding:2rem;font-family:system-ui">App failed to load. Check the console.</div>';
  }
});
