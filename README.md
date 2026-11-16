# 封印之劍

使用 React、TypeScript、Vite 和 React Three Fiber 製作的奇幻 RPG 原型。

## 本機開發

建議使用 Node.js 24。

```bash
npm ci
npm run dev
```

開啟終端機顯示的網址。主選單的「開始新遊戲」可進入 3D 戰場測試場景，也可在網址後加上 `#battle`。

執行 `npm run lint` 檢查程式碼、`npm test` 測試移動邏輯，或執行 `npm run build` 建置正式版本。建置結果位於 `dist`。

戰場中點擊騎士選取，再點擊藍色格子移動。座標從 `(0, 0)` 開始；移動範圍以四方向路徑計算。點擊空白區域或「取消選取」可取消。左鍵拖曳平移、右鍵拖曳旋轉、滾輪縮放鏡頭。

## 部署至 GitHub Pages

1. 將程式碼推送至 GitHub 儲存庫的 `main` 分支。
2. 在儲存庫的 **Settings → Pages → Build and deployment**，將 **Source** 設為 **GitHub Actions**。
3. 推送到 `main` 後，`Deploy to GitHub Pages` 工作流程會自動檢查、建置及部署。也可在 **Actions** 頁面手動執行。
4. 部署完成後，從工作流程的部署連結開啟網站。以目前的儲存庫名稱為例，網址為 `https://unaxig.github.io/sword-of-sealing/`。

`vite.config.ts` 的 `base` 目前設定為 `/sword-of-sealing/`。若變更儲存庫名稱，請將它改為 `/<儲存庫名稱>/`；若部署至使用者網站根目錄或自訂網域根目錄，請改為 `/`。戰場使用網址片段 `#battle`，可直接在 Pages 上重新整理。
