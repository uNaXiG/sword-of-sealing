# Development Status

最後確認日期：2026-11-19。

## 狀態語彙

- **已實作**：程式或文件已存在。
- **已驗收**：使用者已完成對應驗收；Agent 不得代為標記。
- **已提交**：Git HEAD 已包含該異動。

## 目前基準

| 項目 | 狀態 |
| --- | --- |
| Current Repository Baseline | `uNaXiG/sword-of-sealing` · `main` @ `69fc9be39351ea2531163a95f9d1561827b42190` — `docs: update changelog and development status for DOC-01 Patch 1` |
| Latest Verified Repository CI Run | [44279206269](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44279206269) — SUCCESS（`main` / `9c8e623`） |
| Latest Verified Gameplay Commit | `main` @ `d201b06e838a6b33dbfbf1fc329c4f7ac97a91d9`（M3-4 與 Patch 1 Revision 2） |
| Gameplay CI Run | [44277295361](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44277295361) — SUCCESS（`main` / `d201b06`） |
| 最近完成里程碑 | M3：基礎戰鬥系統 — COMPLETED |
| 主要里程碑狀態 | M1–M3 均為 **COMPLETED**；安排以 [ROADMAP.md](./ROADMAP.md) 為準 |
| M3-4 與 Patch 1（Revision 2） | **COMPLETED**；已實作、已驗收、已提交並通過 CI |
| M3 進度 | 100% |
| 整體里程碑等權重進度 | 30.0%（不是實際工時比例） |
| 下一階段 | M4：動態回合制與敵方 AI；M4-1：物理競速式行動與個體回合系統，**IMPLEMENTED — Acceptance Pending** |
| M4-1 | PAS、DES、Individual Turn、HUD／Timeline 及 M1–M3 整合已實作；原始 BV 24/24 已由使用者確認。Patch 1 未提交、未建立 CI、未完成使用者驗收 |
| M3 Closure Documentation | 已提交至 `9c8e623` 並通過 Repository CI |

## 驗證結果

| 驗證 | 結果 | 來源與範圍 |
| --- | --- | --- |
| 自動化測試、ESLint、Production Build | 154/154 PASS；ESLint PASS；Build PASS | M4-1 Patch 1 本機實際執行；Build 保留 Battle Chunk > 500 kB 已知警告 |
| Markdown 相對連結與文件一致性 | PASS | DOC-01 Patch 1 本次檢查 |
| 使用者瀏覽器驗收 | M3-3 15/15 PASS；M3-4 BV-01 至 BV-20 PASS；M3-4 Patch 1 Revision 2 8/8 PASS；M4-1 原始 BV 24/24 PASS；M4-1 Patch 1 待驗收 | 使用者正式驗收／目前任務狀態 |
| Acceptance Criteria | M3-3 40/40 PASS；M3-4 52/52 PASS；Patch 1 Revision 2 12/12 PASS | 已確認驗收結果 |

## DOC-01 狀態

- 原 DOC-01 文件任務：**COMPLETED**。
- 已實作、已通過使用者驗收、已通過 ChatGPT GitHub 文件審查、已提交。
- Commit：`1626daf07fd81a47c365614c1d65d7c335d1d3da`。
- GitHub Actions Run `44220401050`：**CI/CD SUCCESS**。
- 狀態不影響 M1–M10 主要里程碑進度。
- [TECHNICAL_DEBT.md](./TECHNICAL_DEBT.md) 中 TD-008 及 TD-013 已處理並關閉。
- README 過時攻擊範圍敘述已由本任務修正。
- 本任務未修改遊戲程式、核心資料、套件或部署設定。
- 原 DOC-01 驗證基準為 79/79 tests、Lint 與 Build PASS；Build 保留既知 Chunk Size warning。
- DOC-01 Patch 1：已納入 `69fc9be39351ea2531163a95f9d1561827b42190`；本環境未確認該 SHA 的獨立 CI Run，不影響里程碑進度。

## M3-3 狀態

- **COMPLETED**。
- AttackMotion、Attack ID、Impact 延遲傷害、Complete、System Abort 及操作鎖定已實作。
- 六種職業攻擊演出、投射物、Hit Feedback、Floating Applied Damage 與平滑 HP Bar 已實作。
- Browser Verification：15/15 PASS。
- Acceptance Criteria：40/40 PASS。
- 已提交至 Commit `5fba4ed88cf8efad946dfd6de9e6d9730f77bd3d`，CI Run `44226768648` SUCCESS。
- TD-004 已依瀏覽器驗收結果關閉；TD-010 更新為 PARTIALLY RESOLVED。

## M3-4 狀態

- M3-4 與 Patch 1 Revision 2 均為 **COMPLETED**，並已納入 `d201b06`。
- Patch 1 Revision 1 的固定左側 Sprite Anchor 未通過使用者視覺驗收，已由 Revision 2 取代。
- TD-015 與 M3-4-BUG-001 均已關閉；證據與待追蹤風險見 [TECHNICAL_DEBT.md](./TECHNICAL_DEBT.md)。

## 已確認完成

- 3D 8×8 戰場與正交相機。
- 多角色、地形、障礙物、佔位與 Dijkstra 移動。
- 移動動畫、取消、預覽、單次撤銷及確認。

### M3 最終交付

- 角色指令選單（COMMAND / MOVE / ATTACK）、移動確認與待命；攻擊距離及目標驗證共用四種 Attack Pattern：`SQUARE`、`CROSS`、`DIAMOND`、`DIAMOND_RING`。
- 職業 Interface + Registry + Factory；單目標普通攻擊、`max(1, ATK - DEF)`、HP 下限與 Overkill 實際扣血量。
- 六種職業攻擊動畫、AttackMotion 與 Impact／Complete／Abort 生命週期；投射物、受擊反饋、Floating Applied Damage 及 Confirmed Impact Event Queue。
- DeathMotion、Unit Life State、1,200 ms 死亡動畫及粒子消散；致命 Impact 後立即不可操作，動畫期間保留佔位，結算時移除單位、釋放棋格並保存 DefeatedUnitRecord。
- 攻擊收招與死亡動畫可並行；Battle Busy Lock 在移動、攻擊或死亡 Motion 尚未清除時維持操作鎖定。
- Unit Label 使用單一 CanvasTexture／Sprite；HP 數字反映已結算 HP，血條平滑過渡。

詳細規則與實作分工見 [COMBAT_SYSTEM.md](./COMBAT_SYSTEM.md) 與 [ARCHITECTURE.md](./ARCHITECTURE.md)。

## 尚未完成／已知限制

- 正式敵方 AI、完整個體 Action Economy、技能、成長、劇情、存檔與 PWA。
- 技術債及 UX 項目詳見 [TECHNICAL_DEBT.md](./TECHNICAL_DEBT.md) 與 [UX_BACKLOG.md](./UX_BACKLOG.md)。

## 已知阻擋問題

目前無已知 M3 功能或驗收阻擋。M3 結案文件與遊戲功能基準均已同步。

## M4-1 狀態

- **IMPLEMENTED — Acceptance Pending**。
- 已加入 Remaining Distance Model、DES、確定性排序、Battle Time／Round／Turn ID、個體行動權、未來 10 次 Preview、HUD／Timeline 及 Active Highlight。
- AGI 已更新為劍士 10、刺客 15、法師 10、牧師 12、遊俠 12、哥布林 10。
- 玩家指令僅允許 Active Unit；待命及攻擊合法完成後自動排程下一位。致死攻擊等待所有阻擋性 Motion 結束。
- 正式敵方 AI、個體 Action Economy、勝敗及 M7 效果尚未實作。
- Development Build 提供「模擬敵方待命」；Production Build 不顯示該控制。
- 原始 M4-1 Browser Verification：24/24 PASS（使用者已確認）。
- M4-1 Patch 1 移除「確認移動」，加入最小 Turn-scoped Movement Commitment；攻擊與待命維持隱式確認，Undo 是唯一解除未確認移動限制的操作。
- Patch 1 Browser Verification：PARTIAL。已實際確認初始／移動後選單、Undo、Attack Cancel、Standby 及同角色下一個 Turn；Move & Attack、Selection Bypass 與 Pre-impact Abort Browser Fixture 尚待完整驗證。
- User Acceptance：原 M4-1 核心 PAS 已確認；Patch 1 尚未驗收。
- Git／CI：M4-1 原始異動與 Patch 1 均仍只在本機工作樹，無新 SHA 或 CI 證據。

## 下一步

完成 M4-1 Browser Verification 與使用者驗收後等待 Git／CI 確認。下一個開發項目為 M4-2 個體行動限制與狀態重置；本次不啟動。
