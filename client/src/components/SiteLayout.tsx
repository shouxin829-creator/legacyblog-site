import { useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { OFFICIAL_LINE_ID, OFFICIAL_LINE_URL } from "@shared/contact";

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none"><path d="M8 33V13L20 5l12 8v20M14 33V18l6-4 6 4v15M18 26h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="20" cy="10" r="1.5" fill="currentColor"/></svg></span>;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="header-inner">
      <Link href="/" className="brand-lockup" onClick={() => setOpen(false)} aria-label="傳承與財富顧問誌首頁">
        <BrandMark />
        <span className="brand-text"><strong>傳承與財富</strong><small>顧問誌　／　家族長期藍圖</small></span>
      </Link>
      <button className="mobile-menu-toggle" aria-label={open ? "關閉導覽選單" : "開啟導覽選單"} aria-expanded={open} onClick={() => setOpen(value => !value)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
      <nav className={`main-nav${open ? " is-open" : ""}`} aria-label="主要導覽">
        <Link href="/blog" onClick={() => setOpen(false)}>專欄文章</Link>
        <Link href="/services" onClick={() => setOpen(false)}>顧問服務</Link>
        <Link href="/archive" onClick={() => setOpen(false)}>文章歸檔</Link>
        <Link href="/about" onClick={() => setOpen(false)}>關於我們</Link>
      </nav>
      <Link className="header-cta" href="/contact">預約初談 <ArrowUpRight size={15} /></Link>
    </div>
  </header>;
}

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-main">
      <div className="footer-brand-column">
        <Link href="/" className="brand-lockup"><BrandMark /><span className="brand-text"><strong>傳承與財富</strong><small>顧問誌</small></span></Link>
        <p>把重要的安排，<br />提早有章可循。</p>
        <a className="footer-line-link" href={OFFICIAL_LINE_URL} target="_blank" rel="noopener noreferrer">加入官方 LINE <strong>{OFFICIAL_LINE_ID}</strong><ArrowUpRight size={13} /></a>
      </div>
      <div className="footer-links">
        <div><span className="footer-label">閱讀</span><Link href="/blog">專欄文章</Link><Link href="/archive">文章歸檔</Link><Link href="/about">關於顧問誌</Link></div>
        <div><span className="footer-label">服務主題</span><Link href="/services/legacy-planning">傳承規劃</Link><Link href="/services/asset-management">資產管理</Link><Link href="/services/retirement">退休規劃</Link></div>
      </div>
    </div>
    <div className="footer-bottom"><p>內容為一般資訊整理，不取代個別法律、稅務、投資或保險專業建議。</p><span>© 2026 傳承與財富顧問誌</span></div>
  </footer>;
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return <><a className="skip-link" href="#main-content">跳至主要內容</a><SiteHeader /><div className="page-content">{children}</div><SiteFooter /></>;
}
