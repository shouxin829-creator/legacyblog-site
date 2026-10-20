import { ArrowLeft, ArrowUpRight, LockKeyhole } from "lucide-react";
import { Link } from "wouter";
import { ConsultationForm } from "@/components/Forms";
import { OFFICIAL_LINE_ID, OFFICIAL_LINE_URL } from "@shared/contact";

export default function ContactPage() {
  return <main id="main-content" className="page-shell contact-page">
    <nav className="breadcrumbs"><Link href="/">首頁</Link><span>/</span><span>聯絡諮詢</span></nav>
    <header className="contact-intro"><p className="eyebrow">START A CONVERSATION　／　聯絡諮詢</p><h1>先說說你正在<br /><em>思考的安排。</em></h1><p>留下聯絡方式與初步主題，我們會依需求回覆，並討論合適的協作方向。每個家庭的情況不同，初次對話先從理解現況開始。</p><div className="contact-assurance"><LockKeyhole size={15} /><span>基本資料僅用於回覆此次需求；請勿傳送帳戶或身分證等敏感資料。</span></div></header>
    <section className="line-contact-card"><div className="line-contact-copy"><p className="eyebrow">OFFICIAL LINE　／　官方帳號</p><h2>想直接傳訊息？<em>歡迎加入官方 LINE。</em></h2><p>LINE ID <strong>{OFFICIAL_LINE_ID}</strong>。加入後告知想討論的主題，雙方確認時間後安排初談；也可以使用下方表單聯絡。</p></div><a className="line-contact-button" href={OFFICIAL_LINE_URL} target="_blank" rel="noopener noreferrer" aria-label={`在新分頁加入官方 LINE ${OFFICIAL_LINE_ID}`}>加入官方 LINE <ArrowUpRight size={16} /></a></section>
    <div className="contact-form-layout"><aside className="contact-context"><p className="eyebrow">WHAT'S ON YOUR MIND?</p><h2>可以從這些事情開始。</h2><ul><li>想了解傳承、贈與或遺囑執行的規劃順序。</li><li>希望整理家庭資產、退休現金流或保險保障。</li><li>正在思考婚姻財產權益、意定監護或稅務申報。</li></ul><div className="contact-note"><span>NOTE</span><p>請先不要透過表單傳送身分證號、帳戶資料、保單影本或其他敏感文件。若需要進一步資料，我們會在聯繫時再說明。</p></div><Link className="text-link" href="/services/legacy-planning"><ArrowLeft size={14} /> 先看看服務主題</Link></aside>
      <section className="contact-form-panel"><div className="form-panel-heading"><p className="eyebrow">A FIRST CONVERSATION</p><h2>初步需求整理</h2><p>填寫約需 2 分鐘　／　可留空不確定的細節</p></div><ConsultationForm /></section>
    </div>
    <section className="contact-categories"><p className="eyebrow">OUR FIELDS OF WORK</p><div>{["傳承規劃", "資產管理", "退休規劃", "婚姻財產權益", "稅務服務", "保險", "意定監護", "遺囑執行人"].map(item => <span key={item}>{item}<ArrowUpRight size={13} /></span>)}</div></section>
  </main>;
}
