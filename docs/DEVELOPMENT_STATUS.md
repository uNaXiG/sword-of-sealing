# Development Status

最後確認日期：2026-11-18。

## 狀態語彙

- **已實作**：程式或文件已存在。
- **已驗收**：使用者已完成對應驗收；Agent 不得代為標記。
- **已提交**：Git HEAD 已包含該異動。

## 目前基準

| 項目 | 狀態 |
| --- | --- |
| 最新已驗證 Repository Commit | `main` @ `f93752a5a2b571abbd0e5950142c114955e8ee15` |
| 最新已驗證 Commit | `docs: finalize DOC-01 acceptance and documentation closure` |
| Commit 時間 | 2026-11-18 10:11:26 UTC+8 |
| 最近一次遊戲功能異動 | `e307df4bb81025571dd910330d7ffc533898c536` — `Refactor battle unit creation and validation` |
| 最近完成里程碑 | M3-3：攻擊動畫與受擊反饋 |
| Milestone 狀態 | M3-2 Patch = 已實作／已驗收／已提交；M3 = IN PROGRESS |
| M3-3 狀態 | **ACCEPTED — Git Push Pending**；未提交、未納入 CI |
| M3 進度 | 75%（M3-1 至 M3-3 已驗收；M3-4 尚未開始） |
| 整體里程碑等權重進度 | 27.5% |
| 下一階段 | M3-4：單位死亡及移除（UP NEXT） |

## 驗證結果

| 驗證 | 結果 | 來源與範圍 |
| --- | --- | --- |
| 自動化測試 | 100/100 PASS | 2026-11-18 本機重新執行 M3-3 工作樹 |
| ESLint | PASS | 2026-11-18 本機重新執行 `npm run lint` |
| Production Build | PASS | 2026-11-18 本機重新執行；保留 Battle Chunk > 500 kB 已知警告 |
| CI/CD | 未執行 M3-3 工作樹 | 最新已驗證 Repository 的既有 CI 為 Run `44220401050` SUCCESS；本次未提交異動不在該 Run |
| 使用者瀏覽器驗收 | 15/15 PASS | M3-3 BV-01 至 BV-15 全部通過；無使用者問題或建議 |
| Acceptance Criteria | 40/40 PASS | M3-3 實作、測試及使用者驗收綜合結果 |

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
- 尚未提交、Push，也沒有對應的新 CI Run。
- TD-004 已依瀏覽器驗收結果關閉；TD-010 更新為 PARTIALLY RESOLVED。

## 已確認完成

- 3D 8×8 戰場與正交相機。
- 多角色、地形、障礙物、佔位與 Dijkstra 移動。
- 移動動畫、取消、預覽、單次撤銷及確認。
- COMMAND / MOVE / ATTACK 操作模式與待命。
- 四種攻擊模式、單目標攻擊、HP 傷害及 Overkill。
- Interface + Registry + Factory 職業抽象。
- HP 歸零單位不可操作；尚未移除。

## 尚未完成／已知限制

- M3-4 死亡、角色移除及佔位釋放；目前為 UP NEXT。
- 回合制、敵方 AI、技能、成長、劇情、存檔與 PWA。
- HP 只在合法 Attack Impact 正式結算。
- Attack Controller 的 emitted Impact／Complete ID 集合未在長時間大量攻擊下做獨立資源壓力測試；目前不影響已驗收流程。
- 技術債及 UX 項目詳見 [TECHNICAL_DEBT.md](./TECHNICAL_DEBT.md) 與 [UX_BACKLOG.md](./UX_BACKLOG.md)。

## 已知阻擋問題

M3-3 已通過本機自動化驗證及 15/15 使用者瀏覽器驗收；目前無功能或驗收阻擋，僅等待 Git Push。

## 下一步

等待使用者後續 Git 同步；M3-4 為 UP NEXT，但不得在本次文件結案中實作。
