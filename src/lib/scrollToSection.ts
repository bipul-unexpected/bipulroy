/**
 * Reliable in-page navigation for sticky-header portfolio layouts.
 * Scrolls immediately (no deferred timeouts) so the first click always works.
 */

const NAV_GAP = 96;

export function scrollToSection(
  hrefOrId: string,
  options?: { behavior?: ScrollBehavior },
): boolean {
  const id = hrefOrId.replace(/^#/, "").trim();
  if (!id) return false;

  const target = document.getElementById(id);
  if (!target) {
    console.warn(`[scrollToSection] No element with id="${id}"`);
    return false;
  }

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const behavior: ScrollBehavior =
    options?.behavior ?? (prefersReduced ? "auto" : "smooth");

  target.style.scrollMarginTop = `${NAV_GAP}px`;

  // Freeze CSS scroll-behavior so it doesn't fight window.scrollTo on first click
  const html = document.documentElement;
  const previousBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";

  const absoluteTop =
    target.getBoundingClientRect().top + window.scrollY - NAV_GAP;

  window.scrollTo({
    top: Math.max(0, absoluteTop),
    behavior,
  });

  // Restore after the jump starts
  window.requestAnimationFrame(() => {
    html.style.scrollBehavior = previousBehavior;
  });

  if (history.replaceState) {
    history.replaceState(null, "", `#${id}`);
  }

  // Update active-section spy after smooth scroll settles
  window.setTimeout(
    () => window.dispatchEvent(new Event("scroll")),
    behavior === "smooth" ? 500 : 0,
  );

  return true;
}

export function scrollToTop(behavior: ScrollBehavior = "smooth") {
  const html = document.documentElement;
  const previousBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo({ top: 0, behavior });
  requestAnimationFrame(() => {
    html.style.scrollBehavior = previousBehavior;
  });
  if (history.replaceState) {
    history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
  }
}
