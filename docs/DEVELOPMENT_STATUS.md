# Development Status

最後確認日期：2026-11-18。

## 狀態語彙

- **已實作**：程式或文件已存在。
- **已驗收**：使用者已完成對應驗收；Agent 不得代為標記。
- **已提交**：Git HEAD 已包含該異動。

## 目前基準

| 項目 | 狀態 |
| --- | --- |
| 最新已驗證／已提交遊戲基準 | `main` @ `e307df4bb81025571dd910330d7ffc533898c536` |
| Commit | `Refactor battle unit creation and validation` |
| Commit 時間 | 2026-11-18 04:09:30 UTC+8 |
| 工作樹基準 | 同步前為乾淨；本任務產生未提交 Markdown 異動 |
| 最近完成里程碑 | M3-2 Patch：職業抽象化與攻擊模式系統 |
| Milestone 狀態 | M3-2 Patch = 已實作／已驗收／已提交；M3 = IN PROGRESS |
| 下一階段 | M3-3：攻擊動畫與受擊反饋（UP NEXT） |

## 驗證結果

| 驗證 | 結果 | 來源與範圍 |
| --- | --- | --- |
| 自動化測試 | 79/79 PASS | 2026-11-18 本機重新執行 `npm test`，對應 `e307df4` 遊戲基準 |
| ESLint | PASS | 2026-11-18 DOC-01 後本機執行 `npm run lint`；同一遊戲 HEAD 的 CI Run `44166303828` 亦為 PASS |
| Production Build | PASS | 2026-11-18 DOC-01 後本機執行 `npm run build`；保留 Battle Chunk > 500 kB 已知警告；同一遊戲 HEAD 的 CI Run `44166303828` 亦為 PASS |
| CI/CD | SUCCESS | Deploy to GitHub Pages Run `44166303828`，Build 與 Deploy 皆成功 |
| 使用者瀏覽器驗收 | PASS | M3-2 Patch 既有驗收結果；不是對本次 DOC-01 的驗收 |

## DOC-01 狀態

- 文件任務：**已實作，尚待使用者驗收，尚未提交**。
- 狀態不影響 M1–M10 主要里程碑進度。
- [TECHNICAL_DEBT.md](./TECHNICAL_DEBT.md) 中 TD-008 已由本任務處理，但須等待使用者驗收後才可標為 CLOSED。
- README 過時攻擊範圍敘述已在本任務修正，對應 TD-013。
- 本任務未修改遊戲程式、核心資料、套件或部署設定。
- 本機已重新執行 79/79 tests、Lint 與 Build。Build 只出現既知 Chunk Size warning。

## 已確認完成

- 3D 8×8 戰場與正交相機。
- 多角色、地形、障礙物、佔位與 Dijkstra 移動。
- 移動動畫、取消、預覽、單次撤銷及確認。
- COMMAND / MOVE / ATTACK 操作模式與待命。
- 四種攻擊模式、單目標攻擊、HP 傷害及 Overkill。
- Interface + Registry + Factory 職業抽象。
- HP 歸零單位不可操作；尚未移除。

## 尚未完成／已知限制

- M3-3 攻擊動畫與受擊反饋。
- M3-4 死亡、角色移除及佔位釋放。
- 回合制、敵方 AI、技能、成長、劇情、存檔與 PWA。
- HP 目前於確認攻擊時立即結算；M3-3 尚需確認動畫與結算時序。
- 技術債及 UX 項目詳見 [TECHNICAL_DEBT.md](./TECHNICAL_DEBT.md) 與 [UX_BACKLOG.md](./UX_BACKLOG.md)。

## 已知阻擋問題

目前無阻擋開始 M3-3 設計或實作準備的環境問題。M3-3 本身仍缺少正式 FR / TS / AC / BV / DoD。

## 下一步

等待 DOC-01 使用者審查；其後依正式規格開始 M3-3，不在本任務提前實作。
