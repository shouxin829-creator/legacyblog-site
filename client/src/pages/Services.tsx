import { useState } from "react";
import { useRoute, Link } from "wouter";
import { ArrowRight, ArrowUpRight, Search } from "lucide-react";
import { articles, categories, categoryBySlug, categoryForArticle, services, serviceBySlug } from "@shared/blog";
import { ConsultationForm } from "@/components/Forms";
import { ArticleCard } from "@/pages/Home";

export function ServicesIndex() {
  const [query, setQuery] = useState("");
  const searchTerm = query.trim().toLowerCase();
  const matchedServices = services.filter(service => `${service.title} ${service.eyebrow} ${service.summary} ${service.offerings.join(" ")}`.toLowerCase().includes(searchTerm));
  const secondaryCategories = categories.filter(category => !services.some(service => service.category === category.slug) && `${category.name} ${category.description}`.toLowerCase().includes(searchTerm));
  return <main id="main-content" className="page-shell services-index">
    <header className="page-intro">
      <p className="eyebrow">A MAP FOR YOUR FAMILY　／　顧問服務</p>
      <h1>讓家庭的不同安排，<br /><em>在同一張藍圖上對話。</em></h1>
      <p className="page-intro-lead">依照家庭目前的問題與人生階段，從服務主題開始探索；再由合適的專業人員一起釐清下一步。</p>
    </header>
    <label className="service-index-search"><Search size={16} /><span className="sr-only">搜尋服務主題</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="搜尋傳承、退休、稅務等主題" /></label>
    <div className="service-directory">
      {matchedServices.map((service, index) => <Link href={`/services/${service.slug}`} className="directory-row" key={service.slug}>
        <span className="service-number">{String(index + 1).padStart(2, "0")}</span>
        <div><p className="eyebrow">{service.eyebrow}</p><h2>{service.title}</h2><p>{service.summary}</p></div>
        <ArrowUpRight size={18} />
      </Link>)}
      {!matchedServices.length && !secondaryCategories.length && <p className="no-related">沒有找到相符主題，請換個關鍵字試試。</p>}
    </div>
    {!!secondaryCategories.length && <section className="topic-secondary">
      <p className="eyebrow">CONNECTED TOPICS</p><h2>還有這些家庭重要議題。</h2>
      <div>{secondaryCategories.map(category => <Link href={`/services/${category.slug}`} key={category.slug}>{category.name}<ArrowUpRight size={14} /></Link>)}</div>
    </section>}
    <section className="services-cta"><div><p className="eyebrow-light">START WITH WHAT MATTERS</p><h2>不確定從哪裡開始？<br />先說說你正在想的事。</h2><p>初步討論先整理需求，再依主題安排合適的協作方向。</p><Link className="button button-outline-light" href="/contact">預約初步討論 <ArrowUpRight size={16} /></Link></div></section>
  </main>;
}

export function ServicePage() {
  const [match, params] = useRoute("/services/:slug");
  const slug = match ? params?.slug ?? "" : "";
  const service = serviceBySlug(slug);
  const category = categoryBySlug(slug);
  const related = articles.filter(article => service ? service.relatedCategories.some(item => item === article.category) : article.category === slug);
  const title = service?.title ?? `從${category?.name ?? "家庭規劃"}開始，找到清楚的下一步。`;
  const summary = service?.summary ?? category?.description ?? "從家庭實際需求出發，整理可以向專業人員確認的事項。";
  const offerings = service?.offerings;
  if (!category && !service) return <main id="main-content" className="page-shell not-found-page"><p className="eyebrow">404　／　SUBJECT NOT FOUND</p><h1>找不到這個服務主題。</h1><Link className="text-link" href="/services">探索服務主題 <ArrowRight size={14} /></Link></main>;
  return <main id="main-content" className="service-page page-shell">
    <nav className="breadcrumbs"><Link href="/">首頁</Link><span>/</span><Link href="/services">顧問服務</Link><span>/</span><span>{category?.name}</span></nav>
    <header className="service-hero"><div><p className="eyebrow">{service?.eyebrow ?? category?.eyebrow}　／　主題指南</p><h1>{title}</h1><p className="page-intro-lead">{summary}</p><Link className="button button-dark" href="/contact">預約初步需求討論 <ArrowUpRight size={16} /></Link></div><aside className="service-hero-aside"><span className="aside-number">{String(Math.max(1, services.findIndex(item => item.slug === slug) + 1)).padStart(2, "0")}</span><p>每一個家庭的現況不同，<br />先理解，再安排。</p><span className="aside-rule" /></aside></header>
    {offerings && <section className="service-offerings"><div><p className="eyebrow">WAYS WE CAN HELP</p><h2>依需求整理<br /><em>可以開始的地方。</em></h2></div><ul>{offerings.map((item, index) => <li key={item}><span>0{index + 1}</span><p>{item}</p><ArrowRight size={15} /></li>)}</ul></section>}
    <section className="service-approach"><p className="eyebrow">A THOUGHTFUL PROCESS</p><h2>先把問題說清楚，<br /><em>再找合適的專業一起回答。</em></h2><div className="approach-grid"><article><span>01</span><h3>現況整理</h3><p>理解家庭結構、關心的議題與已知資料，將待釐清的事分門別類。</p></article><article><span>02</span><h3>專業協作</h3><p>依主題搭配律師、會計師、地政士（代書）或記帳士等合作專業。</p></article><article><span>03</span><h3>安排下一步</h3><p>以家庭適用條件、可執行性與後續檢視為重點，持續整理長期安排。</p></article></div></section>
    <section className="service-related"><div className="section-heading"><div><p className="eyebrow">RELATED JOURNAL NOTES　／　{categoryForArticle(related[0] ?? articles[0])?.name}</p><h2>從這個主題，<em>繼續閱讀。</em></h2>{service && category?.description && <p className="category-intro">{category.description}</p>}</div><Link className="text-link" href="/blog">所有文章 <ArrowRight size={14} /></Link></div>{related.length ? <div className="article-grid">{related.map((article, index) => <ArticleCard article={article} index={index} key={article.slug} />)}</div> : <p className="no-related">這個主題的文章正在整理中，歡迎先透過需求表單聊聊。</p>}</section>
    <section className="consultation-section"><div className="consultation-intro"><p className="eyebrow-light">START A CONVERSATION</p><h2>帶著你的問題，<br /><em>從初步整理開始。</em></h2><p>表單只收集本次聯絡所需的基本資訊；請勿傳送敏感文件。</p></div><div className="consultation-card"><ConsultationForm /></div></section>
  </main>;
}
