# 封印之劍

使用 React、TypeScript、Vite 和 React Three Fiber 製作的奇幻 RPG 原型。

## 本機開發

建議使用 Node.js 24。

```bash
npm ci
npm run dev
```

開啟終端機顯示的網址。主選單的「開始新遊戲」可進入 3D 戰場測試場景，也可在網址後加上 `#battle`。

執行 `npm run lint` 檢查程式碼、`npm test` 執行涵蓋移動、佔位、障礙物、地形成本、Dijkstra 與移動撤銷的 Node.js 原生測試，或執行 `npm run build` 建置正式版本。建置結果位於 `dist`。

戰場中點擊我方角色選取，再將游標移至藍色格子預覽最低成本路徑及 MP 消耗，點擊格子即可移動；敵方角色無法由玩家操作。移動完成後可按「撤銷移動」還原最近一次移動；切換至其他我方角色或開始下一次有效移動時，前一次移動會自動確認而不能再撤銷。每個角色的 MP 是單次移動預算，起始格不計成本；平地與草地消耗 1 MP，森林與淺水消耗 2 MP，岩石與石牆不可通行。Dijkstra 以四方向尋找最低成本路徑；同陣營角色可作為路徑經過格，但不可作為目的格，敵方角色、樹木及其他障礙物則會阻擋路徑。點擊空白區域或「取消選取」可取消。左鍵拖曳平移、右鍵拖曳旋轉、滾輪縮放鏡頭。

## 部署至 GitHub Pages

1. 將程式碼推送至 GitHub 儲存庫的 `main` 分支。
2. 在儲存庫的 **Settings → Pages → Build and deployment**，將 **Source** 設為 **GitHub Actions**。
3. 推送到 `main` 後，`Deploy to GitHub Pages` 工作流程會自動檢查、建置及部署。也可在 **Actions** 頁面手動執行。
4. 部署完成後，從工作流程的部署連結開啟網站。以目前的儲存庫名稱為例，網址為 `https://unaxig.github.io/sword-of-sealing/`。

`vite.config.ts` 的 `base` 目前設定為 `/sword-of-sealing/`。若變更儲存庫名稱，請將它改為 `/<儲存庫名稱>/`；若部署至使用者網站根目錄或自訂網域根目錄，請改為 `/`。戰場使用網址片段 `#battle`，可直接在 Pages 上重新整理。
