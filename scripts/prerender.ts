// Runs after `vite build`: writes a full HTML page (content + SEO meta) for every
// route, so search engines and link previews see real content without a server.
import fs from "node:fs";
import path from "node:path";
import { SITE_URL } from "@shared/site";
import { renderRoute, staticRoutes } from "./seo";

const outDir = path.resolve(process.cwd(), "dist/public");
const routes = staticRoutes();

const write = (file: string, content: string) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
};

// Render everything first: renderRoute reads the built index.html once for asset tags.
const pages = routes.map(route => ({ route, ...renderRoute(route) }));
const notFound = renderRoute("/__not-found__");

for (const { route, html } of pages) {
  write(path.join(outDir, route === "/" ? "index.html" : `${route.slice(1)}.html`), html);
}
write(path.join(outDir, "404.html"), notFound.html);

const today = new Date().toISOString().slice(0, 10);
write(path.join(outDir, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(route => `  <url><loc>${SITE_URL}${route === "/" ? "/" : route}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`);
write(path.join(outDir, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

console.log(`Prerendered ${pages.length} pages + 404.html, sitemap.xml, robots.txt`);
