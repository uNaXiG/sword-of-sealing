# 封印之劍

使用 React、TypeScript、Vite 和 React Three Fiber 製作的奇幻 RPG 原型。

M1–M3 已完成。M4 已於 2026-11-20 **COMPLETED — FORMALLY ACCEPTED**；M4-4A 正式通過，M4-4B 與 M4-4C 為 **COMPLETED — FORMALLY ACCEPTED WITH LIMITATIONS**，VA1 **COMPLETED — ACCEPTED**。Architecture Review APPROVED、Independent Code Review APPROVED WITH LIMITATIONS、Product Owner Acceptance APPROVED。Repository Commit `b21b36c8b8343865b8abd457cdd70c8b332dfc7b` 的 GitHub Actions Run [44617918846](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44617918846) SUCCESS，GitHub Pages Deployment SUCCESS；該基準為 271/271 Automated Tests、6/6 Production Route Integration、Lint 與 Build PASS。Product Owner BV-C01～C14 14/14 PASS 是 VA1 前取得並由正式結案採認的功能驗收，不是 VA1 後重測。GPU 資源限制保留為 TD-010：AC-C25～C28 延後驗證，未宣稱 GPU Disposal 已完整驗證。M4 進度 100%、Overall 40%（4/10 milestones）；M5 戰鬥 UI／UX 為 **NEXT — PENDING DEVELOPMENT**。

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

執行 `npm run lint` 檢查程式碼、`npm test` 執行涵蓋戰鬥生命週期、勝敗條件 ANY／ALL 組合、AllDead、Outcome 結算與終局安全、Enemy AI、移動、攻擊、死亡及 PAS 的 Node.js 原生測試，或執行 `npm run build` 建置正式版本。建置結果位於 `dist`。

戰場使用 PAS 個體回合：進入戰場會自動排程刺客，只有 Active Unit 能取得玩家指令。每個 Turn 具有獨立的 Movement Action、Combat Action 與 Turn Context。選擇「移動」才會顯示藍色可移動格及最低成本路徑預覽；合法移動完成後只提供攻擊、取消及待命，同一 Turn 不可再次移動。「取消」只在尚有可撤銷移動時出現，會返回原位並恢復移動權。確認攻擊會清除 Undo、保留已使用的移動、保留 Combat Reservation，並鎖定後續移動；只有攻擊完成或待命後才自動排程下一位。敵方 Turn 由確定性 Tactical AI 自動決策：直接攻擊優先，其次移動後攻擊，再以合法路徑成本接近或待命；玩家戰鬥指令在敵方 Turn 仍鎖定。每個角色的行動力是單次移動預算，起始格不計成本；平地與草地消耗 1 點，森林與淺水消耗 2 點，岩石與石牆不可通行。Dijkstra 以四方向尋找最低成本路徑；同陣營角色可作為路徑經過格，但不可作為目的格，敵方角色、樹木及其他障礙物則會阻擋路徑。

選擇「攻擊」後會依職業攻擊模式顯示紅色範圍及合法敵方目標。確認攻擊後會依職業播放獨立演出並鎖定戰鬥操作；傷害於動畫命中時依 `max(1, ATK - DEF)` 正式結算，HP 不低於 0，Floating Damage 顯示實際扣除值。非致命命中後正常收招；HP 歸零時角色會在原位置完成 1,200 ms 倒地、淡出及粒子演出，演出期間仍保留棋格佔位與操作鎖定，完成後移除並保留死亡紀錄。失能或死亡角色不能被選取、移動、攻擊或成為合法目標。「取消攻擊」只適用於動畫發動前，返回行動選單並保留尚可使用的「取消」復原；確認攻擊會清除該移動的復原紀錄。每個角色的攻擊距離與模式由職業資料設定；劍士及刺客為方形 1 格、法師及牧師為十字形 1–2 格、遊俠為菱形環 3 格、哥布林為菱形 1 格。攻擊範圍暫不受障礙物或視線阻擋。角色標籤會即時顯示 HP 血條與數值。攻擊及死亡演出期間仍可使用左鍵平移、右鍵旋轉及滾輪縮放鏡頭。

## 職業抽象與攻擊模式

職業基礎屬性集中在 `src/game/classes/class.data.ts` 的 `CLASS_DEFINITIONS`。職業型別與攻擊模式定義在 `class.types.ts`，新角色由 `class.factory.ts` 的 `createBattleUnit()` 建立。Factory 會初始化獨立的 HP、SP、座標與戰鬥屬性，因此相同職業的角色不會共享可變戰鬥狀態。

目前六種職業如下：

| 職業 | 識別 | HP / SP | ATK / DEF / AGI | MOV | 攻擊模式 | 範圍 |
| --- | --- | --- | --- | --- | --- | --- |
| 劍士 | `knight` | 100 / 30 | 20 / 10 / 10 | 4 | 方形 | 1 |
| 刺客 | `assassin` | 75 / 35 | 28 / 5 / 15 | 6 | 方形 | 1 |
| 法師 | `mage` | 65 / 60 | 12 / 6 / 10 | 3 | 十字形 | 1–2 |
| 牧師 | `cleric` | 80 / 70 | 24 / 6 / 12 | 3 | 十字形 | 1–2 |
| 遊俠 | `ranger` | 80 / 40 | 18 / 5 / 12 | 5 | 菱形環 | 3 |
| 哥布林 | `goblin` | 60 / 15 | 15 / 5 / 10 | 3 | 菱形 | 1 |

- `SQUARE`：Chebyshev 距離，距離 1 含周圍八格。
- `CROSS`：Manhattan 距離，且必須同行或同列。
- `DIAMOND`：原有 Manhattan 距離，包含 1 到最大距離。
- `DIAMOND_RING`：Manhattan 距離區間；遊俠只攻擊距離 3 的外圈。

所有攻擊模式都共用 `battle.attack.ts` 的範圍與目標判定，UI Highlight 與 Reducer 最終確認使用相同幾何規則。普通攻擊仍只攻擊一名目標，並沿用 `max(1, ATK - DEF)`；AGI 是 PAS 行動速度，SP 仍只儲存、驗證及顯示，普通攻擊不消耗 SP。

## PAS 個體回合

PAS 使用 1000 BU 競速距離與 AGI 等速前進。Battle Time 是虛擬 BTU，不受等待、鏡頭或動畫播放時間影響；每 200 BTU 推進一個 Round。HUD 與 Timeline 顯示目前 Active Unit、Round、Battle Time、Turn ID 及未來 10 次行動。Scheduler 先選取真正最小 Action Value，再依 Time Epsilon 建立 Tie Candidate；Preview 共用相同規則。M4-3 已以受控 Capability Action 連接正式 Enemy AI Controller，並通過 Product Owner Browser Acceptance、Architecture Review 與 Code Review。M4 的 Reducer、PAS、AI、End Condition、Outcome、Result Dialog、Restart 與 Session Isolation 均已正式結案；M4-4C 的 GPU Resource Verification 保留核准延後限制，詳見 [Development Status](docs/DEVELOPMENT_STATUS.md) 與 [Technical Debt](docs/TECHNICAL_DEBT.md)。

戰鬥的正式 `BattleState.outcome` 提交為 VICTORY 或 DEFEAT 後，會顯示對應的模態結果 Overlay；Restart 會在相同 Battle Route 以新 Session 重建正式 Scenario，不重新載入頁面。結果介面不新增戰利品、經驗值或成長結算。M4-4B／M4-4C 與 M4 均已正式結案；Product Owner BV-C01～C14 14/14 PASS 由正式結案採認，但不是 VA1 後重測。WebGL 的 `renderer.info.memory`、GPU Disposal 及長時間資源穩定性仍未驗證，AC-C25～C28 依核准決議延後至 TD-010；不因此宣稱無資源洩漏。M5 尚未開始，逐項基準見 [Development Status](docs/DEVELOPMENT_STATUS.md)。

若要調整職業平衡，請修改 `CLASS_DEFINITIONS`；若要新增測試角色，使用 `createBattleUnit()` 並指定 ID、職業、陣營與座標，可選擇覆寫顯示名稱。初始戰場包含五名我方職業與三隻各自擁有獨立 HP／SP 的哥布林。死亡佔位與移除規則見 [Combat System](docs/COMBAT_SYSTEM.md)。

## 部署至 GitHub Pages

1. 將程式碼推送至 GitHub 儲存庫的 `main` 分支。
2. 在儲存庫的 **Settings → Pages → Build and deployment**，將 **Source** 設為 **GitHub Actions**。
3. 推送到 `main` 後，`Deploy to GitHub Pages` 工作流程會自動檢查、建置及部署。也可在 **Actions** 頁面手動執行。
4. 部署完成後，從工作流程的部署連結開啟網站。以目前的儲存庫名稱為例，網址為 `https://unaxig.github.io/sword-of-sealing/`。

`vite.config.ts` 的 `base` 目前設定為 `/sword-of-sealing/`。若變更儲存庫名稱，請將它改為 `/<儲存庫名稱>/`；若部署至使用者網站根目錄或自訂網域根目錄，請改為 `/`。戰場使用網址片段 `#battle`，可直接在 Pages 上重新整理。
