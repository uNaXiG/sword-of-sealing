# Changelog

僅記錄可由 Git、測試、CI 或已確認驗收結果支持的歷史。日期為 Commit 的 UTC+8 時間。

## 2026-11-18 — M3-3（ACCEPTED — Git Push Pending）

- **Added**：AttackMotion、唯一 Attack ID、PENDING_IMPACT／IMPACTED、Impact／Complete／Abort 事件及操作鎖定。
- **Added**：六種 Attack Animation Profile、單一動畫時鐘、近戰突進、魔法／聖光／箭矢投射物。
- **Added**：Hit Flash、Hit Shake、Impact Effect、Floating Applied Damage 與平滑 HP Transition。
- **Changed**：HP 由確認攻擊時結算改為合法 Impact Event 結算。
- **Verification**：`npm test` 100/100 PASS；`npm run lint` PASS；`npm run build` PASS；AC 40/40 PASS；BV 01–15 全部 PASS。Chunk Size warning 保留。
- **Profiles**：劍士 150/300/550 ms、突進 0.45；刺客 100/200/400 ms、0.60；法師 450/500/450 ms、0；牧師 450/300/550 ms、0；遊俠 300/400/400 ms、0；哥布林 150/250/500 ms、0.40（依序為 Wind-up/Attack/Recovery 與棋格突進上限）。
- **Lifecycle Verification**：應用由 React StrictMode 啟動；使用者於 BV-15 攻擊期間返回主選單觸發 Canvas Unmount，再重入戰場，確認無永久鎖定、投射物殘留、舊事件影響或 Console Error。
- **Goblin Verification**：未開放玩家操作敵方。自動化測試以集中 Registry Fixture 驗證 `MELEE_BASH` Mapping、時間參數與 0.40 突進值；使用者 BV-07 另於不改正式玩家流程的外部驗收 Fixture 驗證演出，該暫時 Fixture 未納入產品入口。
- **Known Limitation**：沒有長時間大量 Attack ID 的獨立資源壓力測試，emitted Impact／Complete ID 集合仍留待後續生命週期追蹤。
- **Status**：已使用者驗收；Git Push 尚未完成，未納入新 GitHub Actions Run。
- **Commit Reference**：無。

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
