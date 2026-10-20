import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock3 } from "lucide-react";
import { Link } from "wouter";
import { articles, categories, services, categoryForArticle } from "@shared/blog";
import type { BlogArticle } from "@shared/blog";

function ArticleCard({ article, index = 0 }: { article: BlogArticle; index?: number }) {
  const category = categoryForArticle(article);
  return <article className={`article-card reveal-card card-position-${index % 3}`}>
    <Link href={`/blog/${article.slug}`} className="article-card-image"><img src={article.image} alt={article.imageAlt} loading="lazy" /><span className="image-arrow"><ArrowUpRight size={17} /></span></Link>
    <div className="article-card-body"><div className="card-meta"><Link href={`/services/${article.category}`}>{category?.name}</Link><span>{article.date.replaceAll("-", ".")}</span></div><h3><Link href={`/blog/${article.slug}`}>{article.title}</Link></h3><p>{article.excerpt}</p><Link className="text-link" href={`/blog/${article.slug}`}>閱讀專題 <ArrowRight size={14} /></Link></div>
  </article>;
}

export default function Home() {
  const featured = articles.filter(article => article.featured);
  const [active, setActive] = useState(0);
  const current = featured[active];
  const go = (direction: number) => setActive(index => (index + direction + featured.length) % featured.length);
  return <main id="main-content">
    <section className="home-hero" aria-roledescription="carousel" aria-label="編輯精選文章">
      <div className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-rule" /> THE LEGACY JOURNAL</p>
        <p className="hero-overline">傳承與財富　／　家庭長期藍圖</p>
        <h1>讓重要的安排，<br /><em>提早有章可循。</em></h1>
        <p className="hero-description">把傳承、資產、退休與家庭權益，放進一張看得懂的長期藍圖。</p>
        <div className="hero-actions"><Link className="button button-dark" href="/blog">從編輯精選開始 <ArrowUpRight size={16} /></Link><Link className="subtle-link" href="/services/legacy-planning">認識顧問服務 <ArrowRight size={15} /></Link></div>
        <div className="hero-bottom"><div className="slide-count"><span>{String(active + 1).padStart(2, "0")}</span><i />{String(featured.length).padStart(2, "0")}</div><div className="hero-controls"><button onClick={() => go(-1)} aria-label="上一則精選文章"><ArrowLeft size={16} /></button><button onClick={() => go(1)} aria-label="下一則精選文章"><ArrowRight size={16} /></button></div></div>
      </div>
      <article className="hero-feature" key={current.slug}>
        <Link href={`/blog/${current.slug}`} className="hero-feature-image"><img src={current.image} alt={current.imageAlt} fetchPriority="high" /><span className="hero-image-shade" /></Link>
        <div className="hero-feature-caption"><div><span className="eyebrow-light">本期編輯精選　／　{categoryForArticle(current)?.name}</span><h2><Link href={`/blog/${current.slug}`}>{current.title}</Link></h2><p>{current.excerpt}</p></div><Link className="circle-arrow" href={`/blog/${current.slug}`} aria-label={`閱讀文章：${current.title}`}><ArrowUpRight size={20} /></Link></div>
        <div className="hero-image-index">{String(active + 1).padStart(2, "0")} <i /> FEATURED</div>
      </article>
    </section>

    <section className="subject-strip section-shell">
      <div className="section-kicker"><span className="eyebrow">EXPLORE BY SUBJECT</span><p>先找到正在思考的那件事。</p></div>
      <div className="subject-links">{services.map((service, index) => <Link href={`/services/${service.slug}`} className="subject-link" key={service.slug}><small>0{index + 1}　／　{service.eyebrow.split("／")[1]}</small><span>{service.title}</span><ArrowUpRight size={15} /></Link>)}<Link href="/blog?category=insurance" className="subject-link subject-link-more"><small>OTHER TOPICS</small><span>保險・意定監護・遺囑執行</span><ArrowUpRight size={15} /></Link></div>
    </section>

    <section className="section-shell editorial-picks">
      <div className="section-heading"><div><p className="eyebrow">NOTES FOR THE LONG VIEW</p><h2>把複雜的安排，<br /><em>整理成清楚的下一步。</em></h2></div><Link href="/blog" className="text-link">所有文章 <ArrowRight size={15} /></Link></div>
      <div className="article-grid">{articles.slice(0, 3).map((article, index) => <ArticleCard key={article.slug} article={article} index={index} />)}</div>
    </section>

    <section className="manifesto-section"><div className="manifesto-mark">“</div><p className="eyebrow-light">A THOUGHTFUL PLAN, BUILT TOGETHER</p><h2>家人的未來，<br />值得一場更好的對話。</h2><p className="manifesto-copy">不同家庭、不同階段，答案也不會只有一種。從需求盤點開始，依議題與律師、會計師、地政士及記帳士等專業協作，讓下一步更清楚。</p><Link className="button button-outline-light" href="/about">了解協作方式 <ArrowUpRight size={16} /></Link></section>

    <section className="service-index section-shell"><div className="service-index-head"><p className="eyebrow">A MAP FOR YOUR FAMILY</p><h2>從此刻出發，<br /><em>為長遠多想一步。</em></h2></div><div className="service-rows">{services.map((service, i) => <Link href={`/services/${service.slug}`} className="service-row" key={service.slug}><span className="service-number">0{i + 1}</span><span className="service-row-title"><small>{service.eyebrow.split("／")[1]}</small><strong>{service.title}</strong></span><span className="service-row-summary">{service.summary}</span><ArrowUpRight size={18} /></Link>)}</div><Link className="service-full-link" href="/services/legacy-planning">探索服務主題 <ArrowRight size={15} /></Link></section>

    <section className="closing-note"><div className="closing-note-inner"><p className="eyebrow">A CLEARER NEXT STEP</p><h2>每一份從容，<br />都從一次認真整理開始。</h2><p>帶著你的想法，從初步需求討論開始。</p><Link className="button button-dark" href="/contact">預約初步討論 <ArrowUpRight size={16} /></Link><span className="closing-side-note"><Clock3 size={14} />不預設答案，先整理你在意的事。</span></div></section>
  </main>;
}

export { ArticleCard };
