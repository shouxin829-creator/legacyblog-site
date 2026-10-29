import { Link } from "wouter";
import type { ContentBlock } from "@shared/blog";

export function ArticleContent({ blocks }: { blocks: ContentBlock[] }) {
  return <div className="article-content">
    {blocks.map((block, index) => {
      switch (block.type) {
        case "p": return <p key={index}>{block.text}</p>;
        case "h2": return <h2 id={`section-${index}`} key={index}>{block.text}</h2>;
        case "quote": return <blockquote key={index}><p>{block.text}</p>{block.label && <cite>{block.label}</cite>}</blockquote>;
        case "image": return <figure className="article-figure" key={index}><img src={block.src} alt={block.alt} loading="lazy" /><figcaption>{block.caption}</figcaption></figure>;
        case "steps": return <section className="steps-block" key={index}><h3>{block.title}</h3><ol>{block.items.map((item, i) => <li key={i}><span className="step-index">{String(i + 1).padStart(2, "0")}</span><span>{item}</span></li>)}</ol></section>;
        case "list": {
          const items = block.items.map((item, i) => <li key={i}>{typeof item === "string" ? item : <><strong>{item.label}</strong>{item.text}</>}</li>);
          return block.ordered ? <ol className="article-list" key={index}>{items}</ol> : <ul className="article-list" key={index}>{items}</ul>;
        }
        case "chart": return <figure className="chart-block" key={index}><div className="chart-heading"><span className="eyebrow">編輯示意</span><h3>{block.title}</h3></div><div className="chart-bars">{block.bars.map(bar => <div className="chart-row" key={bar.label}><div className="chart-label"><span>{bar.label}</span><small>{bar.note}</small></div><div className="chart-track"><span style={{ width: `${Math.max(0, Math.min(100, bar.value))}%` }} /></div></div>)}</div><figcaption>{block.caption}</figcaption></figure>;
        case "callout": return <aside className="article-callout" key={index}><span className="callout-rule" /><p>{block.text}</p></aside>;
        case "cta": return <aside className="article-inline-cta" key={index}><p>{block.text}</p><Link href={block.href ?? "/contact"}>{block.label ?? "進一步了解"} <span aria-hidden="true">↗</span></Link></aside>;
        case "video": return block.href?.startsWith("https://") ? <figure className="video-block" key={index}><video controls preload="none"><source src={block.href} type="video/mp4" /></video><figcaption>{block.text}</figcaption></figure> : <aside className="article-callout" key={index}><p>{block.text}</p></aside>;
        default: return null;
      }
    })}
  </div>;
}
