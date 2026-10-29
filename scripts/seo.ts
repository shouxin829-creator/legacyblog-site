import fs from "node:fs";
import path from "node:path";
import { archiveGroups, articles, articleBySlug, categories, categoryBySlug, categoryForArticle, serviceBySlug, services } from "@shared/blog";
import type { BlogArticle, ContentBlock } from "@shared/blog";
import { OFFICIAL_LINE_ID, OFFICIAL_LINE_URL } from "@shared/contact";

const esc = (value: string) => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
const dateLabel = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" });
import { SITE_URL } from "@shared/site";
const DEFAULT_SHARE_IMAGE = "/images/image-4_4d47d3df.jpg";
const DEFAULT_SHARE_IMAGE_ALT = "柔和晨光中的家庭檔案、家系線稿與筆記本";
const SOCIAL_IMAGE_BY_COVER: Record<string, string> = {
  "/images/async/image-2.webp": "/images/image-2_3a5707a2.jpg",
  "/images/async/image-3.webp": "/images/image-3_85f4f464.jpg",
  "/images/async/image-4.webp": "/images/image-4_4d47d3df.jpg",
};
const origin = () => SITE_URL.replace(/\/+$/, "");

type Page = { title: string; description: string; keywords: string[]; type?: "website" | "article"; body: string; schema?: Record<string, unknown>; image?: string; imageAlt?: string; articlePublishedAt?: string; articleSection?: string; articleTags?: string[]; notFound?: boolean };

const image = (src: string, alt: string) => `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" />`;
const topicLink = (slug: string, label: string) => `<a href="/services/${esc(slug)}">${esc(label)}</a>`;
const articleCard = (article: BlogArticle) => {
  const category = categoryForArticle(article);
  return `<article class="seo-card"><a class="seo-card-image" href="/blog/${esc(article.slug)}">${image(article.image, article.imageAlt)}</a><div class="seo-card-copy"><p class="seo-eyebrow">${esc(category?.name ?? "顧問觀點")}　／　${dateLabel(article.date)}</p><h3><a href="/blog/${esc(article.slug)}">${esc(article.title)}</a></h3><p>${esc(article.excerpt)}</p><a class="seo-more" href="/blog/${esc(article.slug)}">閱讀文章 <span aria-hidden="true">↗</span></a></div></article>`;
};
const articleBody = (article: BlogArticle) => article.blocks.map(block => renderBlock(block)).join("");
function renderBlock(block: ContentBlock): string {
  switch (block.type) {
    case "p": return `<p>${esc(block.text)}</p>`;
    case "h2": return `<h2>${esc(block.text)}</h2>`;
    case "quote": return `<blockquote><p>${esc(block.text)}</p>${block.label ? `<cite>${esc(block.label)}</cite>` : ""}</blockquote>`;
    case "image": return `<figure>${image(block.src, block.alt)}<figcaption>${esc(block.caption)}</figcaption></figure>`;
    case "steps": return `<section class="seo-steps"><h3>${esc(block.title)}</h3><ol>${block.items.map(item => `<li>${esc(item)}</li>`).join("")}</ol></section>`;
    case "list": {
      const tag = block.ordered ? "ol" : "ul";
      return `<${tag}>${block.items.map(item => `<li>${typeof item === "string" ? esc(item) : `<strong>${esc(item.label)}</strong>${esc(item.text)}`}</li>`).join("")}</${tag}>`;
    }
    case "chart": return `<figure class="seo-chart"><h3>${esc(block.title)}</h3><ul>${block.bars.map(bar => `<li><span>${esc(bar.label)}</span><span class="seo-bar"><i style="width:${Math.max(0, Math.min(100, bar.value))}%"></i></span><small>${esc(bar.note)}</small></li>`).join("")}</ul><figcaption>${esc(block.caption)}</figcaption></figure>`;
    case "callout": return `<aside class="seo-callout">${esc(block.text)}</aside>`;
    case "cta": return `<aside class="seo-cta"><p>${esc(block.text)}</p><a href="${esc(block.href ?? "/contact")}">${esc(block.label ?? "進一步了解")}　↗</a></aside>`;
    case "video": {
      const safeUrl = block.href?.startsWith("https://") ? block.href : "";
      return safeUrl ? `<figure class="seo-video"><video controls preload="none"><source src="${esc(safeUrl)}" type="video/mp4" /></video><figcaption>${esc(block.text)}</figcaption></figure>` : `<aside class="seo-callout">${esc(block.text)}</aside>`;
    }
  }
}

function shellHeader(path: string) {
  return `<a class="skip-link" href="#main-content">跳至主要內容</a><header class="site-header"><a class="brand" href="/" aria-label="傳承與財富顧問誌首頁"><span class="brand-emblem" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="M8 33V13L20 5l12 8v20M14 33V18l6-4 6 4v15M18 26h4"/><circle cx="20" cy="10" r="1.5"/></svg></span><span class="brand-copy"><b>傳承與財富</b><small>顧問誌　／　家族長期藍圖</small></span></a><nav class="main-nav" aria-label="主要導覽"><a href="/blog"${path === "/blog" ? " aria-current=page" : ""}>專欄文章</a><a href="/services">顧問服務</a><a href="/archive">文章歸檔</a><a href="/about">關於我們</a></nav><a class="header-cta" href="/contact">預約初談 <span aria-hidden="true">↗</span></a></header>`;
}
function shellFooter() {
  return `<footer class="site-footer"><a class="brand footer-brand" href="/"><span class="brand-emblem" aria-hidden="true">承</span><span class="brand-copy"><b>傳承與財富</b><small>顧問誌</small></span></a><p>把重要的安排，提早有章可循。</p><a class="footer-line-link" href="${esc(OFFICIAL_LINE_URL)}" target="_blank" rel="noopener noreferrer">加入官方 LINE <strong>${esc(OFFICIAL_LINE_ID)}</strong> ↗</a><nav aria-label="頁尾導覽"><a href="/services/legacy-planning">服務主題</a><a href="/blog">文章專欄</a><a href="/about">專業協作</a><a href="/contact">聯絡諮詢</a></nav><small>本文為一般資訊整理，不取代個別法律、稅務、投資或保險專業建議。</small></footer>`;
}
function homePage(): Page {
  const featured = articles.find(article => article.slug === "family-legacy-planning")!;
  const meta = { title: "傳承與財富顧問誌｜家庭傳承、資產管理與退休規劃指南｜家庭規劃專欄", description: "從家族傳承、資產管理、退休與婚姻財產到稅務規劃，以跨專業視角整理家庭長期藍圖與實用指南，並提供文章探索、服務導覽與初步諮詢入口。", keywords: ["傳承規劃", "資產管理", "退休規劃", "婚姻財產", "遺產稅", "家族財務"] };
  const body = `<main id="main-content"><section class="seo-home-hero"><div><p class="seo-eyebrow">THE LEGACY JOURNAL　／　家族長期藍圖</p><h1>讓重要的安排，<br/>提早有章可循。</h1><p class="seo-lead">把傳承、資產、退休與家庭權益，放進一張看得懂的長期藍圖。</p><a class="seo-more" href="/blog">從編輯精選開始　↗</a></div><a href="/blog/${featured.slug}" class="seo-hero-image">${image(featured.image, featured.imageAlt)}<span>${esc(featured.title)}</span></a></section><section class="seo-section"><p class="seo-eyebrow">EXPLORE BY SUBJECT　／　主題索引</p><h2>從每一個家庭正在思考的問題出發。</h2><div class="seo-topics">${services.map(service => `<a href="/services/${service.slug}"><small>${esc(service.eyebrow)}</small><b>${esc(service.title)}</b><span>${esc(service.summary)}</span></a>`).join("")}</div></section><section class="seo-section"><p class="seo-eyebrow">EDITOR'S PICKS　／　編輯精選</p><h2>值得收藏的家庭規劃觀點。</h2><div class="seo-cards">${articles.slice(0, 3).map(articleCard).join("")}</div><a class="seo-more" href="/blog">瀏覽所有文章　↗</a></section></main>`;
  return { ...meta, type: "website", body, image: DEFAULT_SHARE_IMAGE, imageAlt: DEFAULT_SHARE_IMAGE_ALT, schema: { "@context": "https://schema.org", "@type": "Organization", name: "傳承與財富顧問誌", description: meta.description } };
}
function blogIndexPage(): Page {
  const body = `<main id="main-content" class="seo-page"><p class="seo-eyebrow">THE JOURNAL　／　專欄文章</p><h1>把複雜的安排，整理成清楚的下一步。</h1><p class="seo-lead">從家庭傳承、資產、退休到權益與稅務，閱讀跨專業的長期規劃觀點。</p><nav class="seo-topic-links" aria-label="文章分類">${categories.map(category => `<a href="/services/${category.slug}">${esc(category.name)}</a>`).join("")}</nav><div class="seo-cards">${articles.map(articleCard).join("")}</div><p><a href="/archive">依年份與月份瀏覽文章歸檔 →</a></p></main>`;
  return { title: "顧問專欄文章｜家庭傳承、資產管理、退休與稅務規劃指南｜實用專欄", description: "閱讀家庭傳承、資產配置、退休現金流、婚姻財產權益、保險與稅務規劃的實用文章，依主題分類與標籤篩選，或按年份和月份瀏覽專欄歸檔。", keywords: ["家庭財務文章", "傳承規劃", "資產配置", "退休現金流", "婚姻財產", "稅務諮詢"], body };
}
function articlePage(article: BlogArticle): Page {
  const category = categoryForArticle(article);
  const body = `<main id="main-content" class="seo-page"><nav class="seo-breadcrumb"><a href="/">首頁</a>　／　<a href="/blog">專欄文章</a>　／　${esc(category?.name ?? "顧問觀點")}</nav><article class="seo-article"><header class="seo-article-head"><p class="seo-eyebrow">${esc(category?.name ?? "顧問觀點")}　／　${dateLabel(article.date)}　／　閱讀約 ${article.readMinutes} 分鐘</p><h1>${esc(article.title)}</h1><p class="seo-lead">${esc(article.excerpt)}</p><p class="seo-byline">內容編輯｜${esc(article.author)}　・　跨專業主題整理</p>${image(article.image, article.imageAlt)}</header><div class="seo-article-body">${articleBody(article)}</div><nav class="seo-topic-links" aria-label="文章標籤">${article.tags.map(tag => `<a href="/blog?tag=${encodeURIComponent(tag)}">#${esc(tag)}</a>`).join("")}</nav><section><h2>延伸閱讀</h2><div class="seo-cards">${articles.filter(item => item.slug !== article.slug).slice(0, 2).map(articleCard).join("")}</div></section></article></main>`;
  const description = `${article.excerpt}本文整理家庭規劃思考重點，並提示需要依個別情況向相應專業人員確認的事項。`;
  const schema = { "@context": "https://schema.org", "@type": "Article", headline: article.title, description, datePublished: article.date, author: { "@type": "Organization", name: article.author }, image: article.image, articleSection: category?.name, keywords: article.tags.join(", ") };
  return { title: `${article.title}｜傳承與財富顧問誌｜家庭長期規劃實用指南`, description, keywords: [category?.name ?? "家庭規劃", ...article.tags, "家庭財務", "專業規劃"].slice(0, 6), type: "article", body, image: article.image, imageAlt: article.imageAlt, articlePublishedAt: article.date, articleSection: category?.name, articleTags: article.tags, schema };
}
function servicePage(slug: string): Page | undefined {
  const service = serviceBySlug(slug);
  const category = categoryBySlug(service?.category ?? slug);
  if (!service && !category) return;
  const related = articles.filter(article => service ? service.relatedCategories.some(item => item === article.category) : article.category === slug);
  const titleText = service?.title ?? `從${category?.name}開始，找到清楚的下一步。`;
  const summary = service?.summary ?? category?.description ?? "依家庭實際議題整理可以開始的下一步。";
  const offerings = service?.offerings ?? [];
  const body = `<main id="main-content" class="seo-page"><nav class="seo-breadcrumb"><a href="/">首頁</a>　／　<a href="/services">顧問服務</a>　／　${esc(category?.name ?? "服務主題")}</nav><section class="seo-service-hero"><p class="seo-eyebrow">${esc(service?.eyebrow ?? category?.eyebrow ?? "主題指南")}　／　服務主題</p><h1>${esc(titleText)}</h1><p class="seo-lead">${esc(summary)}</p><a class="seo-more" href="/contact">帶著你的問題，預約初步討論　↗</a></section>${offerings.length ? `<section><h2>服務內容</h2><ul class="seo-offerings">${offerings.map(item => `<li>${esc(item)}</li>`).join("")}</ul></section>` : ""}<section><h2>相關專欄</h2>${service && category?.description ? `<p>${esc(category.description)}</p>` : ""}<div class="seo-cards">${related.map(articleCard).join("")}</div></section><section class="seo-collaboration"><h2>依主題邀請合適的專業協作</h2><p>顧問服務可搭配律師、會計師、地政士（代書）與記帳士等合作專業，依個別議題與需要安排；資格與法律、稅務判斷由相應專業人員確認。</p><a href="/contact">說明你的初步需求　↗</a></section></main>`;
  const description = `${summary}${offerings.slice(0, 2).join("、")}。從家庭實際需要出發，整理相關文章、服務方向及需要由相應專業人員核對的事項。`;
  return { title: `${category?.name ?? "服務主題"}｜傳承與財富顧問誌｜家庭長期規劃與跨專業服務實用指南`, description, keywords: [category?.name ?? "顧問服務", ...offerings.slice(0, 4), "家庭長期規劃", "跨專業協作"], body, schema: { "@context": "https://schema.org", "@type": "Service", name: category?.name, description, provider: { "@type": "Organization", name: "傳承與財富顧問誌" } } };
}

function servicesIndexPage(): Page {
  const body = `<main id="main-content" class="seo-page"><p class="seo-eyebrow">A MAP FOR YOUR FAMILY　／　顧問服務</p><h1>讓家庭的不同安排，在同一張藍圖上對話。</h1><p class="seo-lead">依照家庭目前的問題與人生階段，從服務主題開始探索；再由合適的專業人員一起釐清下一步。</p><div class="seo-topics">${services.map(service => `<a href="/services/${service.slug}"><small>${esc(service.eyebrow)}</small><b>${esc(service.title)}</b><span>${esc(service.summary)}</span></a>`).join("")}</div><h2>延伸議題</h2><nav class="seo-topic-links">${categories.filter(category => !services.some(service => service.category === category.slug)).map(category => `<a href="/services/${category.slug}">${esc(category.name)}</a>`).join("")}</nav><p><a href="/contact">預約初步需求討論 →</a></p></main>`;
  return { title: "顧問服務主題總覽｜傳承、資產與退休規劃｜家庭長期顧問指南｜實用", description: "探索傳承規劃、家庭資產管理、退休現金流、婚姻財產權益及稅務服務，並查看保險、意定監護與遺囑執行議題及相關文章，依需求找到初步諮詢入口。", keywords: ["顧問服務", "傳承規劃", "資產管理", "退休規劃", "婚姻財產", "稅務服務"], body };
}
function archivePage(): Page {
  const body = `<main id="main-content" class="seo-page"><p class="seo-eyebrow">ARCHIVE　／　文章歸檔</p><h1>按時間，回到你想找的那篇文章。</h1><p class="seo-lead">以年份與月份瀏覽家庭傳承、財務規劃及權益整理的內容。</p>${archiveGroups().map(([month, entries]) => `<section class="seo-archive-group"><h2>${month.replace("-", " 年 ")} 月</h2><ul>${entries.map(article => `<li><time datetime="${article.date}">${dateLabel(article.date)}</time><a href="/blog/${article.slug}">${esc(article.title)}</a></li>`).join("")}</ul></section>`).join("")}</main>`;
  return { title: "文章歸檔｜家庭傳承、資產與退休規劃｜按年月瀏覽專欄｜完整索引", description: "依年份與月份快速查找傳承規劃、資產管理、退休安排、家庭權益與稅務專欄文章，從日期連結直接閱讀並探索相關服務主題。", keywords: ["文章歸檔", "傳承文章", "家庭財務", "退休規劃", "家庭權益"], body };
}
function aboutPage(): Page {
  const body = `<main id="main-content" class="seo-page"><p class="seo-eyebrow">ABOUT THE JOURNAL　／　關於顧問誌</p><h1>把專業放在讀者真正需要的地方。</h1><p class="seo-lead">傳承與財富顧問誌以家庭長期安排為出發點，整理傳承、資產管理、退休、婚姻財產及稅務議題，讓重要問題有更好的討論起點。</p><section><h2>跨專業，依議題分工</h2><p>家庭安排可能同時牽涉法律、會計、稅務、不動產登記、保險與帳務。涉及遺囑執行時，可依家庭需要安排適當的遺囑執行人，並搭配律師、會計師、地政士（代書）及記帳士等合作專業；文章提供一般資訊整理，不暗示由特定具名人士審閱，也不取代一對一專業意見。</p></section><section><h2>內容原則</h2><p>清楚區分一般資訊與個別建議；不以節稅、報酬或保障效果作保證；涉及法令與申報時提醒讀者核對當年度規定，並邀請適當專業人員確認。</p><a href="/blog">閱讀編輯精選　↗</a></section></main>`;
  return { title: "關於傳承與財富顧問誌｜跨專業家庭長期規劃與內容原則｜服務指南", description: "了解傳承與財富顧問誌的內容方向、跨專業協作原則與家庭長期規劃觀點，並認識文章如何說明一般資訊、合作分工與個別專業意見的界線。", keywords: ["顧問團隊", "跨專業協作", "家庭長期規劃", "傳承顧問", "家庭財務"], body };
}
function contactPage(): Page {
  const body = `<main id="main-content" class="seo-page"><p class="seo-eyebrow">START A CONVERSATION　／　聯絡諮詢</p><h1>先說說你正在思考的安排。</h1><p class="seo-lead">留下聯絡方式與初步主題，顧問團隊可依需求回覆並討論適合的專業協作方向。</p><section class="line-contact-card"><div class="line-contact-copy"><p class="eyebrow">OFFICIAL LINE　／　官方帳號</p><h2>想直接傳訊息？歡迎加入官方 LINE。</h2><p>LINE ID <strong>${esc(OFFICIAL_LINE_ID)}</strong>。加入後告知想討論的主題，雙方確認時間後安排初談；也可以使用下方表單聯絡。</p></div><a class="line-contact-button" href="${esc(OFFICIAL_LINE_URL)}" target="_blank" rel="noopener noreferrer">加入官方 LINE　↗</a></section><section class="seo-contact"><h2>可以從這些問題開始</h2><ul><li>想了解傳承、贈與或遺囑執行的規劃順序。</li><li>希望整理家庭資產、退休現金流或保險保障。</li><li>想討論婚姻財產權益、意定監護或稅務申報。</li></ul><p>請勿在表單中填寫身分證字號、帳戶資訊或其他敏感資料。提交資料僅用於回覆此次需求。</p><a href="/services/legacy-planning">先瀏覽服務主題　↗</a></section></main>`;
  return { title: "聯絡顧問團隊｜預約家庭傳承、資產與退休規劃初步諮詢｜服務入口", description: "提交傳承、資產管理、退休、婚姻財產或稅務規劃的基本需求，預約初步諮詢並選擇討論主題，開始整理家庭現況與下一步問題。", keywords: ["預約諮詢", "傳承顧問", "資產管理", "退休規劃", "稅務服務"], body };
}
function resolvePage(path: string): Page {
  if (path === "/") return homePage();
  if (path === "/blog") return blogIndexPage();
  if (path === "/services") return servicesIndexPage();
  if (path === "/archive") return archivePage();
  if (path === "/about") return aboutPage();
  if (path === "/contact") return contactPage();
  const articleMatch = path.match(/^\/blog\/([^/]+)$/);
  if (articleMatch) {
    const article = articleBySlug(decodeURIComponent(articleMatch[1]));
    if (article) return articlePage(article);
  }
  const serviceMatch = path.match(/^\/services\/([^/]+)$/);
  if (serviceMatch) {
    const page = servicePage(decodeURIComponent(serviceMatch[1]));
    if (page) return page;
  }
  return { title: "找不到這個頁面｜傳承與財富顧問誌", description: "你前往的頁面不存在或已移動。可回到首頁，或瀏覽文章與服務主題。", keywords: ["顧問誌", "文章專欄", "服務主題"], body: `<main id="main-content" class="seo-page"><p class="seo-eyebrow">404　／　PAGE NOT FOUND</p><h1>這個頁面暫時找不到。</h1><p class="seo-lead">內容可能已移動，從首頁或專欄重新開始探索。</p><p><a href="/">回到首頁</a>　<a href="/blog">瀏覽文章</a></p></main>`, notFound: true };
}
function articleSchemaFromPage(page: Page, path: string) {
  const absolute = origin();
  const schema = page.schema ? { ...page.schema } : undefined;
  if (schema && typeof schema.image === "string") {
    if (absolute) schema.image = `${absolute}${schema.image}`;
    else delete schema.image;
  }
  if (schema && absolute) schema.url = `${absolute}${path}`;
  return schema;
}

function breadcrumbJsonLd(path: string) {
  const absolute = origin();
  if (!absolute || path === "/") return "";
  const crumbs: Array<{ name: string; path: string }> = [{ name: "首頁", path: "/" }];
  if (path === "/blog") crumbs.push({ name: "專欄文章", path: "/blog" });
  else if (path.startsWith("/blog/")) {
    crumbs.push({ name: "專欄文章", path: "/blog" });
    const article = articleBySlug(path.split("/").pop() ?? "");
    if (article) crumbs.push({ name: article.title, path });
  } else if (path === "/services") crumbs.push({ name: "顧問服務", path: "/services" });
  else if (path.startsWith("/services/")) {
    crumbs.push({ name: "顧問服務", path: "/services" });
    const slug = path.split("/").pop() ?? "";
    const service = serviceBySlug(slug);
    const category = categoryBySlug(service?.category ?? slug);
    if (category) crumbs.push({ name: category.name, path });
  } else {
    const labels: Record<string, string> = { "/archive": "文章歸檔", "/about": "關於顧問誌", "/contact": "聯絡諮詢" };
    if (labels[path]) crumbs.push({ name: labels[path], path });
  }
  if (crumbs.length < 2) return "";
  const data = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, name: crumb.name, item: `${absolute}${crumb.path}` })) };
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}

let cachedAssetTags: string | undefined;
function clientAssetTags() {
  if (cachedAssetTags !== undefined) return cachedAssetTags;
  const html = fs.readFileSync(path.resolve(process.cwd(), "dist/public/index.html"), "utf8");
  const styles = [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*>/g)].map(match => match[0]).join("");
  const script = html.match(/<script[^>]*type="module"[^>]*src="[^"]+"[^>]*><\/script>/)?.[0] ?? "";
  if (!script) throw new Error("Could not find the built client script in dist/public/index.html");
  cachedAssetTags = `${styles}${script}`;
  return cachedAssetTags;
}
function documentHtml(page: Page, path: string) {
  const absolute = origin();
  const canonical = absolute ? `<link rel="canonical" href="${esc(`${absolute}${path}`)}" />` : "";
  const urlMeta = absolute ? `<meta property="og:url" content="${esc(`${absolute}${path}`)}" />` : "";
  const imagePath = page.image ? (SOCIAL_IMAGE_BY_COVER[page.image] ?? page.image) : DEFAULT_SHARE_IMAGE;
  const imageAlt = page.imageAlt ?? DEFAULT_SHARE_IMAGE_ALT;
  const imageUrl = absolute ? new URL(imagePath, absolute).toString() : "";
  const imageMime = imagePath.toLowerCase().endsWith(".webp") ? "image/webp" : imagePath.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
  const imageMeta = imageUrl ? `<meta property="og:image" content="${esc(imageUrl)}"/><meta property="og:image:secure_url" content="${esc(imageUrl)}"/><meta property="og:image:type" content="${imageMime}"/><meta property="og:image:width" content="1920"/><meta property="og:image:height" content="1280"/><meta property="og:image:alt" content="${esc(imageAlt)}"/><meta name="twitter:image" content="${esc(imageUrl)}"/><meta name="twitter:image:alt" content="${esc(imageAlt)}"/>` : "";
  const articleMeta = page.type === "article" ? `${page.articlePublishedAt ? `<meta property="article:published_time" content="${esc(page.articlePublishedAt)}"/>` : ""}${page.articleSection ? `<meta property="article:section" content="${esc(page.articleSection)}"/>` : ""}${(page.articleTags ?? []).map(tag => `<meta property="article:tag" content="${esc(tag)}"/>`).join("")}` : "";
  const schema = articleSchemaFromPage(page, path);
  const jsonLd = `<link rel="icon" type="image/svg+xml" href="/brand-mark.svg"/>${schema ? `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>` : ""}${breadcrumbJsonLd(path)}`;
  const robots = page.notFound ? `<meta name="robots" content="noindex,follow" />` : `<meta name="robots" content="index,follow,max-image-preview:large" />`;
  const body = `${shellHeader(path)}${page.body}${shellFooter()}`;
  return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><meta name="theme-color" content="#f7f5f0"/><title>${esc(page.title)}</title><meta name="description" content="${esc(page.description)}"/><meta name="keywords" content="${esc(page.keywords.slice(0, 8).join(", "))}"/>${robots}<meta property="og:type" content="${page.type ?? "website"}"/><meta property="og:title" content="${esc(page.title)}"/><meta property="og:description" content="${esc(page.description)}"/><meta property="og:site_name" content="傳承與財富顧問誌"/><meta property="og:locale" content="zh_TW"/>${urlMeta}${imageMeta}${articleMeta}<meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="${esc(page.title)}"/><meta name="twitter:description" content="${esc(page.description)}"/>${canonical}<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>${jsonLd}</head><body><div id="root">${body}</div>${clientAssetTags()}</body></html>`;
}

/** Static routes to prerender at build time, plus the 404 page. */
export function staticRoutes() {
  return ["/", "/blog", "/services", "/archive", "/about", "/contact",
    ...articles.map(article => `/blog/${article.slug}`),
    ...[...new Set([...services.map(service => service.slug), ...categories.map(category => category.slug)])].filter(slug => servicePage(slug)).map(slug => `/services/${slug}`)];
}

export function renderRoute(routePath: string) {
  const page = resolvePage(routePath);
  return { html: documentHtml(page, routePath), notFound: Boolean(page.notFound) };
}
