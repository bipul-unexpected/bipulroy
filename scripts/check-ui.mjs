import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message.slice(0, 200)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text().slice(0, 200));
});

await page.addInitScript(() => localStorage.setItem("bipul-theme", "light"));
await page.goto("http://localhost:3000/", {
  waitUntil: "networkidle",
  timeout: 90000,
});
await page.waitForTimeout(2000);

const state = await page.evaluate(() => {
  const r = getComputedStyle(document.documentElement);
  const body = getComputedStyle(document.body);
  const h1 = document.querySelector("h1");
  return {
    htmlClass: document.documentElement.className,
    theme: document.documentElement.getAttribute("data-theme"),
    bg: r.getPropertyValue("--color-bg").trim(),
    text: r.getPropertyValue("--color-text").trim(),
    primary: r.getPropertyValue("--color-primary").trim(),
    heading: r.getPropertyValue("--font-heading").trim(),
    bodyFont: r.getPropertyValue("--font-body").trim(),
    bodyBg: body.backgroundColor,
    bodyColor: body.color,
    h1Font: h1 ? getComputedStyle(h1).fontFamily : null,
    hero: document.querySelector("#hero h1")?.textContent?.slice(0, 70),
    fluid: !!document.getElementById("fluid"),
    glass: document.querySelectorAll(".liquid-glass, .glass-panel, .liquid-glass-nav").length,
    avatar: !!document.querySelector('img[src*="github-avatar"]'),
  };
});

console.log(JSON.stringify(state, null, 2));
console.log("errors", errors.slice(0, 10));

const ok =
  state.theme === "light" &&
  state.bg.toLowerCase() === "#faf5ff" &&
  state.primary.toLowerCase() === "#7c3aed" &&
  state.heading.toLowerCase().includes("space grotesk") &&
  state.bodyFont.toLowerCase().includes("dm sans") &&
  state.hero &&
  state.fluid &&
  state.glass > 0 &&
  state.avatar &&
  errors.length === 0;

console.log("PASS", ok);
await browser.close();
process.exit(ok ? 0 : 1);
