# 封印之劍

使用 React、TypeScript、Vite 和 React Three Fiber 製作的奇幻 RPG 原型。

## Project Documentation

- [AI Agent Instructions](.github/copilot-instructions.md)
- [Development Status](docs/DEVELOPMENT_STATUS.md)
- [Roadmap](docs/ROADMAP.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Game Design](docs/GAME_DESIGN.md)
- [Combat System](docs/COMBAT_SYSTEM.md)
- [Art Guidelines](docs/ART_GUIDELINES.md)
- [UI / UX Backlog](docs/UX_BACKLOG.md)
- [Technical Debt](docs/TECHNICAL_DEBT.md)
- [Changelog](docs/CHANGELOG.md)

## 本機開發

建議使用 Node.js 24。

```bash
npm ci
npm run dev
```

開啟終端機顯示的網址。主選單的「開始新遊戲」可進入 3D 戰場測試場景，也可在網址後加上 `#battle`。

執行 `npm run lint` 檢查程式碼、`npm test` 執行涵蓋攻擊動畫生命週期、攻擊距離與目標驗證、移動、佔位、障礙物、地形成本、Dijkstra 與移動撤銷的 Node.js 原生測試，或執行 `npm run build` 建置正式版本。建置結果位於 `dist`。

戰場中點擊我方角色選取後，先選擇「移動」、「攻擊」或「待命」；只有選擇「移動」後才會顯示藍色可移動格及最低成本路徑預覽。移動模式可按「取消移動」返回行動選單，並保留目前角色選取；移動完成後可選擇「攻擊」、「取消」或「待命」，其中「取消」會使用復原功能還原最近一次移動。「待命」會確認目前移動並取消角色選取；本階段尚無行動次數限制，之後仍可重新選取角色。攻擊確認、待命或切換至其他我方角色會確認已完成的移動；仍可撤銷時，不能直接再次進入移動模式，需先撤銷或確認該次移動。每個角色的行動力是單次移動預算，起始格不計成本；平地與草地消耗 1 點，森林與淺水消耗 2 點，岩石與石牆不可通行。Dijkstra 以四方向尋找最低成本路徑；同陣營角色可作為路徑經過格，但不可作為目的格，敵方角色、樹木及其他障礙物則會阻擋路徑。

選擇「攻擊」後會依職業攻擊模式顯示紅色範圍及合法敵方目標。確認攻擊後會依職業播放獨立演出並鎖定戰鬥操作；傷害於動畫命中時依 `max(1, ATK - DEF)` 正式結算，HP 不低於 0，Floating Damage 顯示實際扣除值。非致命命中後正常收招；HP 歸零時角色會在原位置完成 1,200 ms 倒地、淡出及粒子演出，演出期間仍保留棋格佔位與操作鎖定，完成後移除並保留死亡紀錄。失能或死亡角色不能被選取、移動、攻擊或成為合法目標。「取消攻擊」只適用於動畫發動前，返回行動選單並保留尚可使用的「取消」復原；確認攻擊會清除該移動的復原紀錄。每個角色的攻擊距離與模式由職業資料設定；劍士及刺客為方形 1 格、法師及牧師為十字形 1–2 格、遊俠為菱形環 3 格、哥布林為菱形 1 格。攻擊範圍暫不受障礙物或視線阻擋。角色標籤會即時顯示 HP 血條與數值。攻擊及死亡演出期間仍可使用左鍵平移、右鍵旋轉及滾輪縮放鏡頭。

## 職業抽象與攻擊模式

職業基礎屬性集中在 `src/game/classes/class.data.ts` 的 `CLASS_DEFINITIONS`。職業型別與攻擊模式定義在 `class.types.ts`，新角色由 `class.factory.ts` 的 `createBattleUnit()` 建立。Factory 會初始化獨立的 HP、SP、座標與戰鬥屬性，因此相同職業的角色不會共享可變戰鬥狀態。

目前六種職業如下：

| 職業 | 識別 | HP / SP | ATK / DEF / AGI | MOV | 攻擊模式 | 範圍 |
| --- | --- | --- | --- | --- | --- | --- |
| 劍士 | `knight` | 100 / 30 | 20 / 10 / 5 | 4 | 方形 | 1 |
| 刺客 | `assassin` | 75 / 35 | 28 / 5 / 10 | 6 | 方形 | 1 |
| 法師 | `mage` | 65 / 60 | 12 / 6 / 4 | 3 | 十字形 | 1–2 |
| 牧師 | `cleric` | 80 / 70 | 24 / 6 / 4 | 3 | 十字形 | 1–2 |
| 遊俠 | `ranger` | 80 / 40 | 18 / 5 / 8 | 5 | 菱形環 | 3 |
| 哥布林 | `goblin` | 60 / 15 | 15 / 5 / 4 | 3 | 菱形 | 1 |

- `SQUARE`：Chebyshev 距離，距離 1 含周圍八格。
- `CROSS`：Manhattan 距離，且必須同行或同列。
- `DIAMOND`：原有 Manhattan 距離，包含 1 到最大距離。
- `DIAMOND_RING`：Manhattan 距離區間；遊俠只攻擊距離 3 的外圈。

所有攻擊模式都共用 `battle.attack.ts` 的範圍與目標判定，UI Highlight 與 Reducer 最終確認使用相同幾何規則。普通攻擊仍只攻擊一名目標，並沿用 `max(1, ATK - DEF)`；AGI 與 SP 目前只儲存、驗證及顯示，尚不影響行動順序，也不會由普通攻擊消耗。

若要調整職業平衡，請修改 `CLASS_DEFINITIONS`；若要新增測試角色，使用 `createBattleUnit()` 並指定 ID、職業、陣營與座標，可選擇覆寫顯示名稱。初始戰場包含五名我方職業與三隻各自擁有獨立 HP／SP 的哥布林。失能單位仍保留模型及棋格佔位，既有移動、撤銷、待命與傷害規則不變。

## 部署至 GitHub Pages

1. 將程式碼推送至 GitHub 儲存庫的 `main` 分支。
2. 在儲存庫的 **Settings → Pages → Build and deployment**，將 **Source** 設為 **GitHub Actions**。
3. 推送到 `main` 後，`Deploy to GitHub Pages` 工作流程會自動檢查、建置及部署。也可在 **Actions** 頁面手動執行。
4. 部署完成後，從工作流程的部署連結開啟網站。以目前的儲存庫名稱為例，網址為 `https://unaxig.github.io/sword-of-sealing/`。

`vite.config.ts` 的 `base` 目前設定為 `/sword-of-sealing/`。若變更儲存庫名稱，請將它改為 `/<儲存庫名稱>/`；若部署至使用者網站根目錄或自訂網域根目錄，請改為 `/`。戰場使用網址片段 `#battle`，可直接在 Pages 上重新整理。
