import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

await page.addInitScript(() => localStorage.setItem("bipul-theme", "dark"));
await page.goto("http://localhost:3000/", {
  waitUntil: "networkidle",
  timeout: 60000,
});
await page.waitForTimeout(1500);

const dark = await page.evaluate(() => ({
  bg: getComputedStyle(document.body).backgroundColor,
  color: getComputedStyle(document.body).color,
  hero: document.querySelector("#hero h1")?.textContent?.slice(0, 80),
  terminal: !!document.body.innerText.includes("full-stack.ts"),
  marquee: document.body.innerText.includes("Tech I ship with daily"),
  classes: document.documentElement.className,
}));

await page.locator('button[aria-label*="mode"]').first().click();
await page.waitForTimeout(900);

const light = await page.evaluate(() => ({
  bg: getComputedStyle(document.body).backgroundColor,
  color: getComputedStyle(document.body).color,
  hero: document.querySelector("#hero h1")?.textContent?.slice(0, 80),
  classes: document.documentElement.className,
  primary: getComputedStyle(document.documentElement)
    .getPropertyValue("--color-primary")
    .trim(),
}));

console.log("DARK", dark);
console.log("LIGHT", light);
console.log("errors", errors.length ? errors : "none");
const ok =
  dark.hero?.includes("full-stack") &&
  light.bg.includes("250, 245, 255") &&
  dark.bg.includes("26, 11, 46") &&
  !errors.length;
console.log("PASS", ok);
await browser.close();
process.exit(ok ? 0 : 1);
