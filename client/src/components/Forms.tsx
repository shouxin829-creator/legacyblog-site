import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { OFFICIAL_LINE_URL } from "@shared/contact";
import { WEB3FORMS_ACCESS_KEY } from "@shared/site";

const topics = [
  ["legacy-planning", "傳承規劃"], ["asset-management", "資產管理"], ["retirement", "退休規劃"], ["marital-property", "婚姻財產權益"], ["tax", "稅務服務"], ["insurance", "保險規劃"], ["guardianship", "意定監護"], ["executor", "遺囑執行人"], ["other", "其他"],
] as const;

export function ConsultationForm() {
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("");
  const [state, setState] = useState<"idle" | "pending" | "success" | "error">("idle");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");
    if (!consent) { setStatus("請先同意資料用於本次諮詢回覆。 "); return; }
    const form = event.currentTarget;
    const data = new FormData(form);
    const topicValue = String(data.get("topic") ?? "other");
    const topicLabel = topics.find(([value]) => value === topicValue)?.[1] ?? "其他";
    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `【傳承與財富顧問誌】新的諮詢需求：${topicLabel}`,
      from_name: "傳承與財富顧問誌網站",
      replyto: String(data.get("email") ?? ""),
      稱呼: String(data.get("name") ?? ""),
      電子郵件: String(data.get("email") ?? ""),
      想討論的主題: topicLabel,
      需求說明: String(data.get("message") ?? "") || "（未填寫）",
      同意資料使用: "是",
      botcheck: "",
    };
    setState("pending");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({ success: false }));
      if (!response.ok || !result.success) throw new Error(result.message ?? "submit failed");
      setState("success");
      setStatus("你的初步需求已成功送出，並已寄出 Email 通知給顧問。我們會依你提供的聯絡方式回覆。請留意，表單不會取代個別法律、稅務或投資意見。");
      form.reset();
      setConsent(false);
    } catch {
      setState("error");
      setStatus("目前無法送出，你的資料尚未提交成功。請稍後重試，或直接使用");
    }
  };
  return <form id="consultation-form" className="consultation-form" onSubmit={submit}>
    <div className="form-grid"><label className="field-label">稱呼<input name="name" required maxLength={120} autoComplete="name" placeholder="你的稱呼" /></label><label className="field-label">電子郵件<input name="email" type="email" required maxLength={320} autoComplete="email" placeholder="name@example.com" /></label></div>
    <label className="field-label">想先討論的主題<select name="topic" defaultValue="legacy-planning">{topics.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    <label className="field-label">簡單描述你正在思考的安排 <span>選填</span><textarea name="message" rows={5} maxLength={1200} placeholder="請勿填寫身分證字號、帳戶資訊或其他敏感資料。" /></label>
    <label className="consent-line"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} /><span>我同意顧問誌為回覆此次需求保存並使用我提供的稱呼、電子郵件與諮詢內容；我了解資料僅用於本次聯絡及需求判斷。</span></label>
    <button className="button button-dark form-submit" type="submit" disabled={state === "pending"}>{state === "pending" ? "資料送出中…" : <>提交初步需求 <ArrowRight size={16} /></>}</button>
    {status && <p className={`form-status${state === "success" ? " is-success" : ""}`} role="status" aria-live="polite">{state === "success" && <CheckCircle2 size={16} />}<span>{status}{state === "error" && <> <a href={OFFICIAL_LINE_URL} target="_blank" rel="noopener noreferrer">官方 LINE</a>。</>}</span></p>}
    <p className="form-privacy-note">請不要透過表單傳送身分證號、帳戶資料、完整保單或其他敏感文件。</p>
  </form>;
}
