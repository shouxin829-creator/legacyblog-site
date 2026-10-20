import { ArrowUpRight, BookOpenCheck, Handshake, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

const principles = [
  { icon: BookOpenCheck, title: "先整理，再建議", text: "把已知現況、家庭期待與待確認問題分開，讓每一次討論更有方向。" },
  { icon: Handshake, title: "依議題協作", text: "視需要搭配律師、會計師、地政士（代書）與記帳士等合作專業。" },
  { icon: ShieldCheck, title: "不承諾單一答案", text: "不以節稅、報酬或保障效果作保證，尊重每個家庭的條件與選擇。" },
];

export default function AboutPage() {
  return <main id="main-content" className="page-shell about-page">
    <header className="page-intro about-intro"><p className="eyebrow">ABOUT THE JOURNAL　／　關於顧問誌</p><h1>讓專業，<br /><em>回到讀者真正需要的地方。</em></h1><p className="page-intro-lead">家庭裡有些安排不容易開始。顧問誌希望先把問題說清楚，讓不同專業可以在合適的時間一起加入。</p></header>
    <section className="about-statement"><span className="oversized-quote">“</span><div><p className="eyebrow">OUR PERSPECTIVE</p><h2>財富規劃不只是資產數字，<br />也是關於照顧、選擇與交接。</h2><p>我們以家庭的長期需要為出發點，整理傳承、資產管理、退休現金流、婚姻財產權益、稅務與相關保障議題。文章把一般資訊化成可以帶進家庭對話的問題，而不是替每個人給出相同答案。</p></div></section>
    <section className="about-principles"><p className="eyebrow">HOW WE WORK　／　內容與協作原則</p><h2>清楚、有脈絡、<em>可以再確認。</em></h2><div className="principle-grid">{principles.map(({ icon: Icon, title, text }, index) => <article key={title}><span>0{index + 1}</span><Icon size={19} strokeWidth={1.4} /><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="about-collaboration"><div><p className="eyebrow-light">THE RIGHT PEOPLE, FOR THE RIGHT QUESTION</p><h2>不同的問題，<br /><em>邀請不同的專業一起看。</em></h2><p>顧問服務可依主題搭配律師、會計師、地政士（代書）、記帳士與保險專業；涉及遺囑執行時，也可依家庭需要安排適當的遺囑執行人。資格、法律與稅務判斷由相應專業人員依個案確認；文章不暗示由特定具名人士審閱。</p><div className="collaborator-tags"><span>律師</span><span>會計師</span><span>地政士（代書）</span><span>記帳士</span><span>保險專業</span><span>遺囑執行人</span></div></div><div className="collab-emblem" aria-hidden="true"><span className="collab-ring ring-one" /><span className="collab-ring ring-two" /><span className="collab-center">承</span></div></section>
    <section className="about-disclaimer"><p className="eyebrow">EDITORIAL STANDARD</p><h2>專業資訊，<em>也要說清楚邊界。</em></h2><p>本站內容提供一般資訊與規劃思考，不構成法律、稅務、投資或保險個別建議。法令、申報與契約條件可能變動，實際安排請依家庭具體資料，向相應專業人員確認。</p><Link className="text-link" href="/blog">閱讀編輯精選 <ArrowUpRight size={15} /></Link></section>
    <section className="closing-note about-closing"><div className="closing-note-inner"><p className="eyebrow">BEGIN WITH A CONVERSATION</p><h2>從你最在意的事，<br />開始整理下一步。</h2><Link className="button button-dark" href="/contact">預約初步討論 <ArrowUpRight size={16} /></Link></div></section>
  </main>;
}
