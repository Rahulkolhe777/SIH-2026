import { serve, file } from "bun";
import path from "path";
import tailwind from "bun-plugin-tailwind";

const port = Number(process.env.PORT) || 5173;
const distDir = path.join(import.meta.dir, "../dist");
const publicDir = path.join(import.meta.dir, "../public");

// Build frontend bundles
async function buildApp() {
  await Bun.build({
    entrypoints: [path.join(import.meta.dir, "index.html")],
    outdir: distDir,
    plugins: [tailwind],
    minify: false,
    target: "browser",
    sourcemap: "inline",
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
      "window.__API_URL__": JSON.stringify(process.env.VITE_API_URL || "http://localhost:4000"),
      "window.__LANDING_URL__": JSON.stringify(process.env.VITE_LANDING_URL || "http://localhost:3000"),
    },
  });
}

// Initial build
await buildApp();

const server = serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);

    // 1. Serve static media assets from public/
    if (url.pathname.startsWith("/images/") || url.pathname.includes("/images/")) {
      const imgFileName = path.basename(url.pathname);
      const imgFile = file(path.join(publicDir, "images", imgFileName));
      if (await imgFile.exists()) {
        return new Response(imgFile);
      }
    }

    // 2. Serve compiled dist chunks (.js, .css, .map, etc.) by filename
    const filename = path.basename(url.pathname);
    if (filename.includes(".")) {
      const distFile = file(path.join(distDir, filename));
      if (await distFile.exists()) {
        return new Response(distFile);
      }
    }

    // 3. SPA Fallback: Serve dist/index.html with absolute root paths replaced
    const indexHtml = file(path.join(distDir, "index.html"));
    if (await indexHtml.exists()) {
      let htmlText = await indexHtml.text();
      // Ensure scripts and stylesheets use absolute root / paths instead of relative ./
      htmlText = htmlText.replaceAll('href="./', 'href="/').replaceAll('src="./', 'src="/');
      return new Response(htmlText, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`🚀 Agrovia React Frontend running at http://localhost:${server.port}`);
