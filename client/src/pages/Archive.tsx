import { useState } from "react";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { Link } from "wouter";
import { archiveGroups } from "@shared/blog";

export default function ArchivePage() {
  const groups = archiveGroups();
  const years = [...new Set(groups.map(([month]) => month.slice(0, 4)))];
  const [selectedYear, setSelectedYear] = useState("all");
  const visibleGroups = groups.filter(([month]) => selectedYear === "all" || month.startsWith(selectedYear));
  return <main id="main-content" className="page-shell archive-page">
    <header className="page-intro"><p className="eyebrow">THE ARCHIVE　／　文章歸檔</p><h1>在時間裡，<br /><em>找到那篇值得再讀一次的文章。</em></h1><p className="page-intro-lead">依年份與月份瀏覽家庭傳承、資產與財務安排的編輯觀點。</p></header>
    <div className="archive-controls"><span><CalendarDays size={16} /> 篩選年份</span><div>{years.map(year => <button key={year} className={selectedYear === year ? "tag-pill is-selected" : "tag-pill"} onClick={() => setSelectedYear(selectedYear === year ? "all" : year)}>{year}</button>)}<button className={selectedYear === "all" ? "tag-pill is-selected" : "tag-pill"} onClick={() => setSelectedYear("all")}>全部年份</button></div></div>
    <div className="archive-timeline">{visibleGroups.map(([month, articles]) => <section className="archive-month" key={month}><div className="archive-month-heading"><span className="timeline-dot" /><p className="eyebrow">{month.replace("-", "　／　")}</p><span>{articles.length} 篇文章</span></div><div className="archive-entries">{articles.map(article => <Link href={`/blog/${article.slug}`} key={article.slug} className="archive-entry"><time dateTime={article.date}>{article.date.slice(5).replace("-", ".")}</time><span><strong>{article.title}</strong><small>{article.excerpt}</small></span><ArrowUpRight size={17} /></Link>)}</div></section>)}</div>
    <section className="archive-endnote"><p className="eyebrow">KEEP EXPLORING</p><h2>找到合適的主題，<em>再慢慢往下讀。</em></h2><Link className="text-link" href="/blog">回到文章總覽 <ArrowUpRight size={15} /></Link></section>
  </main>;
}
