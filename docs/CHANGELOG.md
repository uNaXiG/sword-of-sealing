# Changelog

僅記錄可由 Git、測試、CI 或已確認驗收結果支持的歷史。日期使用 UTC+8；有對應 Commit 時以其日期為準。

## 2026-11-19 — M4-1 & Patch 1 Milestone Closure — Conditional

- **Closure**：M4-1 標記為 **COMPLETED — Conditional Closure**；M4-1 Patch 1 標記為 **COMPLETED**。
- **Acceptance**：M4-1 原始 BV 24/24 PASS；Patch 1 BV 10/10 PASS；兩項 User Acceptance 均 PASS。M4-1 原始 Agent Verification 的 PARTIAL／NOT VERIFIED 歷史保留，使用者後續驗收作為追加證據。
- **Verification**：最終 Automated Baseline 154/154、ESLint、TypeScript／Production Build 及 Git Diff Check PASS。Reference Scenarios 5/5 PASS。本 Closure 文件任務未重跑上述命令。
- **Git / CI**：Gameplay Commit `db30869e528f2aed95787d4cfdd1db3aca988c09`；GitHub Actions Run `44385223281` SUCCESS。
- **Code Review**：使用者核准延後 CR-01 至 CR-05，登錄為 OPEN 的 TD-016 至 TD-020；條件式結案不表示所有風險已修復。
- **Handover**：M4-2 `Individual Action Economy & Turn State Reset` 為 UP NEXT；TD-017 是 Entry Requirement。
- **Progress**：M4 完成度 25%；完整結案主要里程碑 3/10；等權重進度 32.5%，不代表工時比例。
- **Documentation Git / CI**：本 Closure 文件異動未 Commit、未 Push，無新 Closure Commit 或 CI；不得預填。

## 2026-11-19 — M4-1 Patch 1 — IMPLEMENTED — Acceptance Pending

- **Fixed**：移除玩家「確認移動」按鈕與獨立 Commit 入口；移動完成後 COMMAND 選單只提供攻擊、取消、待命。
- **Changed**：加入 `movementUsedTurnId`，由 Reducer 及共用 `canEnterMoveMode` 同步限制同一 Turn 再次移動。
- **Preserved**：合法 Undo 恢復移動權；取消 ATTACK Mode 保留 Move Record；攻擊確認與待命隱式確認移動；下一個 Individual Turn 重置限制。
- **Fixed**：合法攻擊確認後即使發生 Pre-impact Abort，已使用移動仍不可於同一 Turn 再次執行。
- **Verification**：`npm test` 154/154 PASS；`npm run lint` PASS；`npm run build` PASS；Git Diff Check PASS。既有 500 kB Chunk warning 保留。
- **Browser Verification**：PARTIAL；實際確認初始／移動後選單、Undo 後重新移動、Attack Cancel、Standby 及同角色下一 Turn。合法 Move & Attack、Selection Bypass 與 Abort Browser Fixture 尚未完整實測。
- **Acceptance / Git**：Patch 1 尚待使用者驗收；原 M4-1 原始 BV 24/24 已由使用者確認。M4-1 與 Patch 1 均仍在工作樹，無新 Commit 或 CI。

## 2026-11-19 — M4-1 — IMPLEMENTED — Acceptance Pending

- **Added**：PAS Remaining Distance Model、AGI Velocity、DES 排程、確定性排序、Battle Time、Round、Turn ID 與 Individual Turn Lifecycle。
- **Added**：Active Unit Authorization、Pending Turn Completion、唯讀未來 10 次 Preview、Turn HUD、Timeline、Active Highlight 與 Development-only Enemy Standby。
- **Changed**：六種職業 AGI 調整為劍士 10、刺客 15、法師 10、牧師 12、遊俠 12、哥布林 10；其他屬性維持不變。
- **Changed**：Attack Complete／Post-impact Abort 在所有阻擋 Motion 結束後完成 Turn；致命 Impact 立即移除排程資格，但死亡動畫期間保留佔位。
- **Verification**：原 M4-1 實作基準為 `npm test` 150/150 PASS（含 10,000 次排程穩定性與 RS-01／RS-02）；`npm run lint` PASS；`npm run build` PASS。Build 保留既有 Chunk Size warning。
- **Browser Verification / Acceptance**：原 M4-1 BV 24/24 已由使用者確認，PAS 核心功能已通過使用者驗收。
- **Status / Git**：**IMPLEMENTED**；目前只存在工作樹，無新 Commit、Remote CI 或 GitHub Actions 證據。
- **Known Limitation**：尚未實作 M4-2 Action Economy、正式敵方 AI、勝敗或 M7 效果；Production Build 的敵方回合等待 M4-3。

## 2026-11-18 — DOC-01 Patch 1 — Persistent Instructions & Context Synchronization

- **Added**：新 Session 的唯讀初始化流程，依文件索引回復上下文、核對 Git 與測試基準，並區分初始化與實作授權。
- **Changed**：在 [Copilot Instructions](../.github/copilot-instructions.md) 補充戰鬥事件、渲染與資源生命週期，以及分層驗證與版本基準管理規範。
- **Baseline**：M3 結案文件已納入 `main` 的 `9c8e623` 並通過 Repository CI Run `44279206269`；遊戲基準仍為 `d201b06`。完整基準見 [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md)；既有 Roadmap 不變。
- **Verification**：Markdown 相對連結及文件一致性檢查 PASS；137/137 為既有測試基準，本次未重跑遊戲測試、Lint 或 Build。
- **Commit Reference / CI**：已提交為 `69fc9be39351ea2531163a95f9d1561827b42190`；GitHub Actions Run `44280854293` 已確認 SUCCESS。

## 2026-11-18 — M3 正式結案（Closure Documentation — Git Push Pending）

- **Status**：M3、M3-4、M3-4 Patch 1（Revision 2）均為 **COMPLETED**。以下兩筆 M3-4 實作紀錄保留當時的待驗收狀態。
- **Acceptance**：M3-4 的 BV-01 至 BV-20 全部 PASS，AC 52/52 PASS；Patch 1 Revision 2 的 BV 8/8 PASS，AC 12/12 PASS。Revision 1 未通過使用者視覺驗收，已由 Revision 2 取代。
- **Fixed**：TD-015 以 Confirmed Impact Event Queue 結案；M3-4-BUG-001 以 Single CanvasTexture／Single Sprite 結案。
- **Verification**：沿用 Revision 2 實作報告的 137/137 測試、ESLint、Production Build PASS；本次未重跑。本次結案文件 Markdown 相對連結檢查 PASS。
- **遊戲功能 Commit / CI**：`d201b06e838a6b33dbfbf1fc329c4f7ac97a91d9`（`main`）；[GitHub Actions Run 44277295361](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44277295361) — SUCCESS。本次文件異動尚未提交，不在該 Run 內。

## 2026-11-18 — M3-4 Patch 1 Revision 2（IMPLEMENTED — Acceptance Pending）

- **Revision 1 結果**：使用者視覺驗收失敗；未受擊角色的 Fill 位於資訊面板錯誤位置，滿血寬度與背景血槽未對齊。Revision 1 不得標記為 Accepted。
- **Root Cause**：資訊面板背景由一張 CanvasTexture Sprite 繪製，但血槽與 Fill 是另外兩張 Sprite，以世界座標定位且使用不同尺寸；它們並未共用面板畫布座標，造成視覺對齊依賴獨立 Sprite 的 billboard 與尺寸轉換。
- **Changed**：改為每個 Unit Label 一張 Canvas、一張 CanvasTexture 與一張 Sprite；同一 Canvas 繪製背景、外框、名稱、血槽、HP Fill 及數值。HP 動畫只更新 Canvas 內容中的 Fill 寬度，左側及垂直座標固定；每次重繪重置 Context Transform，Texture 在元件生命週期內重用並於 Cleanup dispose。
- **Verification**：保留原 3 項 Unit Label 測試意圖並新增 2 項 Canvas 繪製 regression tests（共 5 項）；`npm test` 137/137 PASS；`npm run lint` PASS；`npm run build` PASS；`git diff --check`（`cr-at-eol`）PASS。Production Build 的既有 Chunk Size warning 保留。
- **Browser Verification**：尚未執行 BV-01 至 BV-08 實際視覺驗收；等待使用者驗收，不以自動化／啟動成功替代。
- **Commit Reference / CI**：無；本次未 Commit、Push 或執行新 CI。

## 2026-11-18 — M3-4（IMPLEMENTED — Acceptance Pending）

- **Added**：DeathMotion、DefeatedUnitRecord、死亡 Life State Selector、Death ID、Death Complete／Abort。
- **Added**：1,200 ms Death Profile、倒地、淡出、24 顆粒子及多 DeathMotion 支援。
- **Added**：Confirmed Impact Event Queue，修正 TD-015 的視覺回饋時序。
- **Changed**：致命 Impact 先建立死亡事件，動畫期間保留佔位，完成後原子移除並保存死亡紀錄。
- **Verification**：`npm test` 132/132 PASS；`npm run lint` PASS；`npm run build` PASS；Chunk Size warning 保留。
- **Status**：未經使用者 M3-4 瀏覽器驗收、未提交、未納入新 GitHub Actions。
- **Technical Debt**：新增 TD-014；TD-015 = IMPLEMENTED — Acceptance Pending。
- **Commit Reference**：無。

## 2026-11-18 — M3-3（COMPLETED）

- **Added**：AttackMotion、唯一 Attack ID、PENDING_IMPACT／IMPACTED、Impact／Complete／Abort 事件及操作鎖定。
- **Added**：六種 Attack Animation Profile、單一動畫時鐘、近戰突進、魔法／聖光／箭矢投射物。
- **Added**：Hit Flash、Hit Shake、Impact Effect、Floating Applied Damage 與平滑 HP Transition。
- **Changed**：HP 由確認攻擊時結算改為合法 Impact Event 結算。
- **Verification**：`npm test` 100/100 PASS；`npm run lint` PASS；`npm run build` PASS；AC 40/40 PASS；BV 01–15 全部 PASS。Chunk Size warning 保留。
- **Profiles**：劍士 150/300/550 ms、突進 0.45；刺客 100/200/400 ms、0.60；法師 450/500/450 ms、0；牧師 450/300/550 ms、0；遊俠 300/400/400 ms、0；哥布林 150/250/500 ms、0.40（依序為 Wind-up/Attack/Recovery 與棋格突進上限）。
- **Lifecycle Verification**：應用由 React StrictMode 啟動；使用者於 BV-15 攻擊期間返回主選單觸發 Canvas Unmount，再重入戰場，確認無永久鎖定、投射物殘留、舊事件影響或 Console Error。
- **Goblin Verification**：未開放玩家操作敵方。自動化測試以集中 Registry Fixture 驗證 `MELEE_BASH` Mapping、時間參數與 0.40 突進值；使用者 BV-07 另於不改正式玩家流程的外部驗收 Fixture 驗證演出，該暫時 Fixture 未納入產品入口。
- **Known Limitation**：沒有長時間大量 Attack ID 的獨立資源壓力測試，emitted Impact／Complete ID 集合仍留待後續生命週期追蹤。
- **Status**：已使用者驗收並完成 Git／CI 同步。
- **CI/CD**：GitHub Actions Run `44226768648` SUCCESS。
- **Commit Reference**：`5fba4ed88cf8efad946dfd6de9e6d9730f77bd3d`

## 2026-11-18 — DOC-01（Completed & Accepted）

- **Milestone**：獨立專案文件管理任務，不影響 M1–M10。
- **Added**：Copilot Instructions、Development Status、Roadmap、Architecture、Game Design、Combat System、Art Guidelines、UX Backlog、Technical Debt 與本 Changelog。
- **Changed**：README 新增 Project Documentation 索引；修正過時攻擊範圍敘述。
- **Verification**：`npm test` 79/79 PASS；`npm run lint` PASS；`npm run build` PASS；使用者驗收及 ChatGPT GitHub 文件審查 PASS；相對連結及 Markdown-only Diff 檢查 PASS。Build 保留既知 Chunk Size warning。
- **CI/CD**：GitHub Actions Run `44220401050` SUCCESS。
- **Commit Reference**：`1626daf07fd81a47c365614c1d65d7c335d1d3da`

## 2026-11-18 — M3-2 Patch

- **Added**：職業型別、`CLASS_DEFINITIONS`、`createBattleUnit()`、職業與攻擊屬性驗證。
- **Added**：SQUARE、CROSS、DIAMOND、DIAMOND_RING。
- **Changed**：初始戰場統一由 Factory 建立，六種職業具有獨立 HP／SP／座標狀態。
- **Verification**：79/79 tests；ESLint、Production Build、GitHub Actions SUCCESS；使用者驗收完成。
- **Commit Reference**：`e307df4bb81025571dd910330d7ffc533898c536`

## 2026-11-17 — M3-2

- **Added**：普通攻擊傷害、Applied Damage、AttackResult、目標 HP 更新與 Overkill。
- **Added**：UnitLabel HP 血條與數值；HP 歸零不可操作。
- **Verification**：已確認為 M3-2 已驗收基準的一部分；測試總數演進至 66。
- **Commit Reference**：`627b748e6c0f55e0920ff3550d1e4f92c788fd9f`

## 2026-11-17 — M3-1 Patch 2

- **Added**：Standby Action，確認移動、清除暫時攻擊與選取。
- **Fixed**：待命後仍可 Undo、移動確認語意與操作限制。
- **Verification**：測試總數 55。
- **Commit Reference**：`2b1dc304696abc4558f260d05d722ca49db61b5c`

## 2026-11-17 — M3-1 / Patch 1

- **Added**：ATTACK Mode、合法目標選取、攻擊確認資料。
- **Added**：COMMAND 行動選單與移動／攻擊操作流程。
- **Changed**：UI 攻擊與核心目標驗證整合。
- **Verification**：測試總數 48；Patch 1 後達 50。
- **Commit Reference**：`0e8c80e4eaab0f3a48c20c70f1e21b3d4ca81a94`

## 2026-11-17 — M2-5

- **Added**：單次移動 Undo、`BattleMoveRecord`、撤銷合法性驗證。
- **Fixed**：確認與取消移動狀態、過期事件。
- **Verification**：測試總數 36。
- **Commit Reference**：`f247114082f0e671776dbaf9a6677685dce75cfa`

## 2026-11-17 — M2-4 / M2-4 Patch

- **Added**：Dijkstra 最低成本、地形移動成本、路徑預覽與移動動畫。
- **Changed**：處理拖曳與點擊的事件識別，避免誤觸棋格操作。
- **Verification**：測試總數 29；Patch 後達 30。
- **Commit Reference**：`d4dd27eca3eff07a682bc26f92f5a22b008c93b3`

## 2026-11-16–17 — M2 Core

- **Added**：多角色配置、棋格佔位、障礙物與基礎單位移動。
- **Changed**：Battle 邏輯重整並加入可測試的移動模組。
- **Commit References**：
  - `d577ffeedb64b2d5cb33be19c1c11903b99409ab`
  - `976bf1b4fcb5b8c02fd663f68238507483befe18`
  - `804f5d486698df9cf1aec3da00e391c293709ddb`
  - `31ffac616adeb2329939bc235bb3c32827063426`

## 2026-11-16 — M1 / Project Bootstrap

- **Added**：React、TypeScript、Vite、React Three Fiber 原型與主選單。
- **Added**：8×8 3D 戰場、Orthographic Camera、基礎角色與鏡頭操作。
- **Added**：README 與 GitHub Pages Workflow。
- **Commit References**：
  - `29941a18bb35a3c11f9ac210c3f5cd714e140c14`
  - `495114389a2621f9b08e2fcea4b95997e19f6a33`
