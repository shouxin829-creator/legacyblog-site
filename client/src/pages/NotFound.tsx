import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return <main id="main-content" className="page-shell not-found-page">
    <p className="eyebrow">404　／　PAGE NOT FOUND</p>
    <h1>這個頁面暫時找不到。</h1>
    <p>內容可能已移動，從首頁或專欄重新開始探索。</p>
    <div className="not-found-actions"><Link className="button button-dark" href="/"><ArrowLeft size={15} /> 回到首頁</Link><Link className="text-link" href="/blog">瀏覽文章 <ArrowUpRight size={14} /></Link></div>
  </main>;
}
