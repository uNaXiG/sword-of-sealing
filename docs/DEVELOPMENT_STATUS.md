# Development Status

最後確認日期：2026-11-18。

## 狀態語彙

- **已實作**：程式或文件已存在。
- **已驗收**：使用者已完成對應驗收；Agent 不得代為標記。
- **已提交**：Git HEAD 已包含該異動。

## 目前基準

| 項目 | 狀態 |
| --- | --- |
| 最新已驗證 Repository Commit | `main` @ `5fba4ed88cf8efad946dfd6de9e6d9730f77bd3d` |
| 最新已驗證 Commit | `feat: implement attack animations and hit feedback system` |
| 最新已驗證遊戲功能異動 | `5fba4ed88cf8efad946dfd6de9e6d9730f77bd3d` — `feat: implement attack animations and hit feedback system` |
| 最新遊戲 CI Run | `44226768648` — SUCCESS |
| 最近完成里程碑 | M3-3：攻擊動畫與受擊反饋 — COMPLETED |
| Milestone 狀態 | M3 = IN PROGRESS；M3-4 = IMPLEMENTED — Acceptance Pending |
| M3-4 狀態 | **IMPLEMENTED — Acceptance Pending**；未提交、未納入新 CI |
| M3 進度 | 75%（M3-1 至 M3-3 已驗收；M3-4 已實作、待驗收） |
| 整體里程碑等權重進度 | 27.5% |
| 下一階段 | M3-4 使用者驗收；M4 尚未開始 |

## 驗證結果

| 驗證 | 結果 | 來源與範圍 |
| --- | --- | --- |
| 自動化測試 | 137/137 PASS | 2026-11-18 本機重新執行 M3-4 Patch 1 Revision 2 工作樹 |
| ESLint | PASS | 2026-11-18 本機重新執行 `npm run lint` |
| Production Build | PASS | 2026-11-18 本機重新執行；保留 Battle Chunk > 500 kB 已知警告 |
| CI/CD | 未執行 M3-4 工作樹 | 最新已驗證 M3-3 Repository CI 為 Run `44226768648` SUCCESS；本次未提交異動不在該 Run |
| 使用者瀏覽器驗收 | M3-3 15/15 PASS；M3-4 NOT VERIFIED | M3-4 等待正式 BV-01 至 BV-20 |
| Acceptance Criteria | M3-3 40/40 PASS | M3-4 為 AUTOMATED / IMPLEMENTATION verification，使用者驗收前不得標為 PASS |

## DOC-01 狀態

- 文件任務：**COMPLETED**。
- 已實作、已通過使用者驗收、已通過 ChatGPT GitHub 文件審查、已提交。
- Commit：`1626daf07fd81a47c365614c1d65d7c335d1d3da`。
- GitHub Actions Run `44220401050`：**CI/CD SUCCESS**。
- 狀態不影響 M1–M10 主要里程碑進度。
- [TECHNICAL_DEBT.md](./TECHNICAL_DEBT.md) 中 TD-008 及 TD-013 已處理並關閉。
- README 過時攻擊範圍敘述已由本任務修正。
- 本任務未修改遊戲程式、核心資料、套件或部署設定。
- 本機已重新執行 79/79 tests、Lint 與 Build。Build 只出現既知 Chunk Size warning。

## M3-3 狀態

- **ACCEPTED — Git Push Pending**。
- AttackMotion、Attack ID、Impact 延遲傷害、Complete、System Abort 及操作鎖定已實作。
- 六種職業攻擊演出、投射物、Hit Feedback、Floating Applied Damage 與平滑 HP Bar 已實作。
- Browser Verification：15/15 PASS。
- Acceptance Criteria：40/40 PASS。
- 已提交至 Commit `5fba4ed88cf8efad946dfd6de9e6d9730f77bd3d`，CI Run `44226768648` SUCCESS。
- TD-004 已依瀏覽器驗收結果關閉；TD-010 更新為 PARTIALLY RESOLVED。

## M3-4 狀態

- **IMPLEMENTED — Acceptance Pending**。
- DeathMotion、DefeatedUnitRecord、Life State Selector、1,200 ms 死亡動畫、佔位延後釋放及多死亡資料結構已實作。
- TD-015 已以 Confirmed Impact Event Queue 修正回饋早於 Reducer 的問題。
- 132/132 自動化測試、ESLint、Build 通過。
- M3-4 Patch 1 Revision 1 的固定左側 Sprite Anchor 未通過使用者視覺驗收，不得視為修正完成或 Accepted。
- Revision 2 改為單一 CanvasTexture／Sprite；面板、背景血槽、Fill 與文字均由同一 Canvas 座標系繪製，HP Transition 重用 Canvas 與 Texture。
- Revision 2 保留既有 3 項 Unit Label 測試意圖並補 2 項 Canvas 繪製回歸測試；共 5 項 Unit Label 測試，總計 137/137 自動化測試通過。
- 尚未提交、Push、執行新 CI 或完成使用者 BV-01 至 BV-20 及 BV-P1-01 至 BV-P1-08。
- Patch 1 Revision 2 維持 IMPLEMENTED — Acceptance Pending，等待使用者正式瀏覽器驗收。

## 已確認完成

- 3D 8×8 戰場與正交相機。
- 多角色、地形、障礙物、佔位與 Dijkstra 移動。
- 移動動畫、取消、預覽、單次撤銷及確認。
- COMMAND / MOVE / ATTACK 操作模式與待命。
- 四種攻擊模式、單目標攻擊、HP 傷害及 Overkill。
- Interface + Registry + Factory 職業抽象。
- HP 歸零單位不可操作；尚未移除。

## 尚未完成／已知限制

- M3-4 使用者瀏覽器驗收。
- 回合制、敵方 AI、技能、成長、劇情、存檔與 PWA。
- HP 只在合法 Attack Impact 正式結算。
- Attack Controller 的 emitted Impact／Complete ID 集合未在長時間大量攻擊下做獨立資源壓力測試；目前不影響已驗收流程。
- 技術債及 UX 項目詳見 [TECHNICAL_DEBT.md](./TECHNICAL_DEBT.md) 與 [UX_BACKLOG.md](./UX_BACKLOG.md)。

## 已知阻擋問題

M3-3 已通過本機自動化驗證及 15/15 使用者瀏覽器驗收；目前無功能或驗收阻擋，僅等待 Git Push。

## 下一步

等待 M3-4 使用者驗收及後續 Git 同步；不得進入 M4。
