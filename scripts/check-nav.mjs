import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

await page.addInitScript(() => localStorage.setItem("bipul-theme", "dark"));
await page.goto("http://localhost:3000/", {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});
// Intentionally short wait — simulate first click soon after load
await page.waitForTimeout(400);

const y0 = await page.evaluate(() => window.scrollY);
await page.locator('nav a[href="#about"]').first().click({ force: false });
await page.waitForTimeout(900);
const first = await page.evaluate(() => ({
  y: window.scrollY,
  hash: location.hash,
  aboutTop: document.getElementById("about")?.getBoundingClientRect().top,
}));

await page.locator('nav a[href="#projects"]').first().click();
await page.waitForTimeout(900);
const second = await page.evaluate(() => ({
  y: window.scrollY,
  hash: location.hash,
  top: document.getElementById("projects")?.getBoundingClientRect().top,
}));

console.log({ y0, first, second, errors });
const pass =
  first.y > 200 &&
  first.hash === "#about" &&
  first.aboutTop != null &&
  first.aboutTop < 220 &&
  second.hash === "#projects" &&
  !errors.length;
console.log("PASS", pass);
await browser.close();
process.exit(pass ? 0 : 1);
