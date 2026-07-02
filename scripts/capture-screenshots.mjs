import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "docs", "screenshots");
const baseUrl = "http://127.0.0.1:4173";

async function waitForServer(timeout = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(baseUrl);
      if (res.ok) return;
    } catch {
      // preview still starting
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error("Preview server did not become ready in time");
}

async function main() {
  await mkdir(outDir, { recursive: true });

  const preview = spawn("npx", ["vite", "preview", "--port", "4173", "--host", "127.0.0.1"], {
    cwd: root,
    shell: true,
    stdio: "ignore",
  });

  try {
    await waitForServer();
    const browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 1366, height: 900 },
      colorScheme: "dark",
    });

    await context.addInitScript(() => {
      localStorage.setItem(
        "wobb-theme",
        JSON.stringify({ state: { mode: "dark" }, version: 0 })
      );
      document.documentElement.classList.add("dark");
    });

    const page = await context.newPage();

    await page.goto(`${baseUrl}/?platform=instagram`);
    await page.waitForSelector('[role="listitem"]', { timeout: 20000 });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(outDir, "search.png") });

    await page.goto(`${baseUrl}/profile/cristiano?platform=instagram`);
    await page.waitForSelector("article h1", { timeout: 20000 });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(outDir, "profile-detail.png") });

    await page.goto(`${baseUrl}/?platform=youtube`);
    await page.waitForSelector('[role="listitem"]', { timeout: 20000 });
    const addBtn = page.getByRole("button", { name: /add to shortlist/i }).first();
    await addBtn.click();
    await page.waitForTimeout(600);
    await page.goto(`${baseUrl}/shortlist`);
    await page.waitForSelector("h1", { timeout: 20000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, "shortlist.png") });

    await browser.close();
    console.log("Screenshots saved to docs/screenshots/");
  } finally {
    preview.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
