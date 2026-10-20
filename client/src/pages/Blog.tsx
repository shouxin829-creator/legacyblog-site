import { useMemo, useState } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { ArrowLeft, ArrowRight, Clock3, Search } from "lucide-react";
import { articles, categories, categoryForArticle, articleBySlug } from "@shared/blog";
import type { BlogArticle } from "@shared/blog";
import { ArticleContent } from "@/components/ArticleContent";
import { ArticleCard } from "@/pages/Home";

export function BlogIndex() {
  const [location] = useLocation();
  const queryString = location.includes("?") ? location.slice(location.indexOf("?") + 1) : "";
  const initialCategory = new URLSearchParams(queryString).get("category") ?? "all";
  const [category, setCategory] = useState(initialCategory);
  const [tag, setTag] = useState(new URLSearchParams(queryString).get("tag") ?? "all");
  const [query, setQuery] = useState("");
  const tags = useMemo(() => [...new Set(articles.flatMap(article => article.tags))].sort((a, b) => a.localeCompare(b, "zh-Hant")), []);
  const filtered = articles.filter(article => (category === "all" || article.category === category) && (tag === "all" || article.tags.includes(tag)) && (!query.trim() || `${article.title} ${article.excerpt} ${article.tags.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase())));
  return <main id="main-content" className="journal-page page-shell">
    <header className="page-intro"><p className="eyebrow">THE JOURNAL　／　專欄文章</p><h1>把複雜的安排，<br /><em>整理成清楚的下一步。</em></h1><p className="page-intro-lead">從家庭傳承、資產與退休，到權益與稅務，找到現在最需要的那一頁。</p><div className="page-intro-foot"><span>編輯部選讀　／　跨專業主題整理</span><Link href="/archive">依月份瀏覽 <ArrowRight size={14} /></Link></div></header>
    <section className="journal-content" aria-label="文章列表與篩選">
      <aside className="filter-panel"><div className="filter-head"><span className="eyebrow">FIND YOUR SUBJECT</span><span>篩選文章</span></div><label className="search-field"><Search size={15} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜尋主題或關鍵字" aria-label="搜尋主題或關鍵字" /></label><div className="filter-group"><h2>主題分類</h2><button className={category === "all" ? "filter-chip is-selected" : "filter-chip"} onClick={() => setCategory("all")}>全部文章 <span>{articles.length}</span></button>{categories.map(item => <button key={item.slug} className={category === item.slug ? "filter-chip is-selected" : "filter-chip"} onClick={() => setCategory(item.slug)}>{item.name}<span>{articles.filter(article => article.category === item.slug).length}</span></button>)}</div><div className="filter-group"><h2>文章標籤</h2><div className="tag-filter"><button className={tag === "all" ? "tag-pill is-selected" : "tag-pill"} onClick={() => setTag("all")}>全部</button>{tags.map(item => <button key={item} className={tag === item ? "tag-pill is-selected" : "tag-pill"} onClick={() => setTag(item)}># {item}</button>)}</div></div><p className="filter-note">每篇文章為一般資訊整理，實際安排請依個人情況諮詢專業人員。</p></aside>
      <div className="journal-results"><div className="result-heading"><span>共 {filtered.length} 篇文章</span><span>近期優先　／　繁體中文</span></div>{filtered.length ? <div className="article-grid journal-grid">{filtered.map((article, index) => <ArticleCard article={article} index={index} key={article.slug} />)}</div> : <div className="empty-state"><p className="eyebrow">NO MATCHING NOTES</p><h2>目前沒有符合這組條件的文章。</h2><p>試試其他主題，或清除篩選重新探索。</p><button className="text-link" onClick={() => { setCategory("all"); setTag("all"); setQuery(""); }}>清除篩選 <ArrowRight size={14} /></button></div>}</div>
    </section>
  </main>;
}

export function ArticlePage() {
  const [match, params] = useRoute("/blog/:slug");
  const article = match ? articleBySlug(params?.slug ?? "") : undefined;
  if (!article) return <main id="main-content" className="page-shell not-found-page"><p className="eyebrow">404　／　ARTICLE NOT FOUND</p><h1>這篇文章暫時找不到。</h1><Link className="text-link" href="/blog"><ArrowLeft size={15} /> 回到文章列表</Link></main>;
  return <ArticleDetail article={article} />;
}

function ArticleDetail({ article }: { article: BlogArticle }) {
  const category = categoryForArticle(article);
  const headings = article.blocks.flatMap((block, index) => block.type === "h2" ? [{ ...block, sectionId: `section-${index}` }] : []);
  const related = articles.filter(item => item.category === article.category && item.slug !== article.slug).slice(0, 2);
  return <main id="main-content" className="article-page page-shell">
    <nav className="breadcrumbs"><Link href="/">首頁</Link><span>/</span><Link href="/blog">專欄文章</Link><span>/</span><Link href={`/services/${article.category}`}>{category?.name}</Link></nav>
    <header className="article-header"><p className="eyebrow">{category?.name}　／　{article.date.replaceAll("-", ".")}　／　閱讀約 {article.readMinutes} 分鐘</p><h1>{article.title}</h1><p className="article-deck">{article.excerpt}</p><div className="article-author-line"><span className="author-initial">承</span><span><b>{article.author}</b><small>內容編輯　／　跨專業主題整理</small></span><div className="article-tags">{article.tags.map(tag => <span key={tag}># {tag}</span>)}</div></div></header>
    <figure className="article-cover"><img src={article.image} alt={article.imageAlt} fetchPriority="high" /><figcaption>{article.imageAlt}　／　顧問誌編輯影像</figcaption></figure>
    <div className="article-reading-layout"><aside className="article-toc"><span className="eyebrow">IN THIS NOTE</span><p>本文索引</p><ol>{headings.map(block => <li key={block.sectionId}><a href={`#${block.sectionId}`}>{block.text}</a></li>)}</ol><Link className="toc-contact" href="/contact">延伸討論 <ArrowRight size={14} /></Link></aside><div className="article-main-column"><ArticleContent blocks={article.blocks} /><div className="article-notice"><span className="eyebrow">EDITORIAL NOTE</span><p>本文僅供一般資訊參考，不構成個別法律、稅務、投資或保險建議。相關法令與條件可能調整，請依自身情況向相應專業人員確認。</p></div></div></div>
    <section className="article-related"><div className="section-heading"><div><p className="eyebrow">MORE ON THIS SUBJECT</p><h2>同一個主題，<em>還有這些角度。</em></h2></div><Link href="/blog" className="text-link">更多文章 <ArrowRight size={14} /></Link></div><div className="article-grid">{(related.length ? related : articles.filter(item => item.slug !== article.slug).slice(0, 2)).map((item, index) => <ArticleCard article={item} index={index} key={item.slug} />)}</div></section>
  </main>;
}
