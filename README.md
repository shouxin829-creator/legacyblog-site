# 傳承與財富顧問誌（純前端版）

從 Manus 專案 legacyblog 搬出來的純靜態網站，部署在 Vercel，沒有後端和資料庫。

- `npm run dev`：本機開發（http://localhost:5190）
- `npm run build`：`vite build` 之後執行 `scripts/prerender.ts`，把每一頁輸出成含內容與 SEO meta 的 HTML，並產生 `sitemap.xml`、`robots.txt`、`404.html`
- `npm run preview`：預覽 build 結果（http://localhost:5191）

## 要改內容時

- 文章、分類、服務主題：`shared/blog.ts`
- 正式網址、Web3Forms 金鑰：`shared/site.ts`（換網域只要改 `SITE_URL`）
- 官方 LINE：`shared/contact.ts`
- 圖片：`client/public/images/`
- 諮詢表單：`client/src/components/Forms.tsx`（Web3Forms，信件寄到 shouxin829@gmail.com）
