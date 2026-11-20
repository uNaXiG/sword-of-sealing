# Development Roadmap

本文件是 M1–M10 的唯一里程碑規劃來源。DOC-01 是獨立文件管理任務，不改變以下里程碑安排。

## 狀態定義

| 狀態 | 意義 |
| --- | --- |
| PENDING | 尚未開始 |
| UP NEXT | 下一個預定階段 |
| IN PROGRESS | 已開始但尚未整體完成 |
| IMPLEMENTED | 已實作，尚待使用者驗收 |
| ACCEPTED | 使用者已驗收，但可能尚未提交或結案 |
| COMPLETED | 已實作、已驗收且已納入確認基準 |
| COMPLETED — Conditional Closure | 功能、驗收、Git／CI 已確認；核准延後的風險已登錄且尚未修復 |
| COMPLETED — CONDITIONALLY ACCEPTED | 已完成實作與 Product Owner 驗收；審查限制及延後驗證項目已記錄並移交後續階段 |
| COMPLETED — FORMALLY ACCEPTED WITH LIMITATIONS | 正式結案核准；已驗證的限制與延後項目明確記錄，不代表相關延後驗證通過 |

## M1：基礎 3D 戰場 — COMPLETED

- 3D 戰場建立。
- 8 × 8 格子地圖。
- Orthographic Camera。
- 基礎角色棋子。
- 棋格選取。
- 角色移動。
- 鏡頭控制。

## M2：戰場移動系統 — COMPLETED

| ID | 項目 | 狀態 |
| --- | --- | --- |
| M2-1 | 多角色資料結構 | COMPLETED |
| M2-2 | 角色佔位系統 | COMPLETED |
| M2-3 | 障礙物系統 | COMPLETED |
| M2-4 | 地形移動成本與尋路 | COMPLETED |
| M2-4 Patch | 移動動畫與取消機制修正 | COMPLETED |
| M2-5 | 移動撤銷系統 | COMPLETED |
| M2-5 Patch | 路徑預覽、左鍵拖曳與移動確認事件識別 | COMPLETED |

## M3：基礎戰鬥系統 — COMPLETED

| ID | 項目 | 狀態 |
| --- | --- | --- |
| M3-1 | 攻擊距離與目標判斷 | COMPLETED |
| M3-1 Patch 1 | 角色行動選單與操作流程 | COMPLETED |
| M3-1 Patch 2 | 待命與移動確認機制修正 | COMPLETED |
| M3-2 | 基礎傷害公式與 HP | COMPLETED |
| M3-2 Patch | 職業抽象化與攻擊模式系統 | COMPLETED |
| M3-3 | 攻擊動畫與受擊反饋 | COMPLETED |
| M3-4 | 單位死亡及移除 | COMPLETED |
| M3-4 Patch 1 | HP Bar 位置修正（Revision 2） | COMPLETED |

M3 完成度為 100%。正式驗收與 Git 基準見 [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md)。

## M4：動態回合制與敵方 AI — COMPLETED（100%）

| ID | 項目 | 狀態 |
| --- | --- | --- |
| M4-1 | 物理競速式行動與個體回合系統 | COMPLETED — Conditional Closure |
| M4-1 Patch 1 | 移動確認與指令流程修正 | COMPLETED |
| M4-2 | Individual Action Economy & Turn State Reset | COMPLETED — Formal Acceptance Approved |
| M4-2 Patch 1 | Code Review Hardening & Verification | COMPLETED |
| M4-3 | 敵方移動與攻擊決策 | COMPLETED — FORMALLY ACCEPTED |
| M4-4 | 勝利、失敗與戰鬥結束 | COMPLETED — FORMALLY ACCEPTED WITH LIMITATIONS |
| M4-4A | Extensible End Condition Architecture & Battle Resolution | COMPLETED — FORMALLY ACCEPTED |
| M4-4B | Overlay、Restart 與 Session Isolation | COMPLETED — FORMALLY ACCEPTED WITH LIMITATIONS |
| M4-4C | Final Regression、Browser Verification、Independent Review 與 Formal Acceptance | COMPLETED — FORMALLY ACCEPTED WITH LIMITATIONS |

**M4 Formal Closure 快照（歷史）**：M4-1～M4-3 與 M4-4A 均已完成。M4-4 正式結案日期為 2026-11-20，Verified Repository Commit `b21b36c8b8343865b8abd457cdd70c8b332dfc7b` 對應 GitHub Actions Run [44617918846](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44617918846) SUCCESS；271/271 Automated Tests、6/6 Production Route Integration、ESLint、Production Build 與 GitHub Pages Deployment PASS。Architecture Review APPROVED、Independent Code Review APPROVED WITH LIMITATIONS、Product Owner Acceptance APPROVED。PO BV-C01～C14 為 14/14 PASS，於 VA1 前取得並由正式結案採認，並非 VA1 後重測。保留 Agent 原始 PARTIAL／NOT VERIFIED 紀錄。C-T01～C36 36/36 PASS（依各項範圍及限制）；AC-C01～C45 統計為 40 PASS、1 PASS WITH APPROVED LIMITATIONS、4 PARTIAL — APPROVED DEFERRAL。RV-M4-4B-01／03 CLOSED — VERIFIED；RV-M4-4B-02 PARTIAL — DEFERRED TO TD-010。`renderer.info.memory`、GPU Disposal 與長時間資源穩定性未驗證。當時 M4 Progress 100%；M1–M4 100%，M5–M10 0%，Completed Milestones 4/10，Overall 40%。完整結案證據見 [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md)。

M4-4C Verification Addendum 1 補足 Production Victory／Defeat Route unmount 測試、十次 Restart 的逐次 lifecycle assertion，以及 Timer／Listener／Deferred Work 證據；正式基準為 271/271 Automated Tests、6/6 Production Route Integration。VA1 WebGL 量測觀察 14/14 Context Loss identity matches，最後 Route exit 後 0 connected Canvas；`renderer.info.memory`、GPU Disposal 與長時間資源穩定性仍 NOT VERIFIED，已核准延後至 TD-010。此為正式結案限制，不代表 GPU Resource Lifecycle 完整通過。

## M5：戰鬥 UI／UX — IN PROGRESS（25%）

| ID | 項目 | 狀態 |
| --- | --- | --- |
| M5-1 | Battle HUD Redesign：角色資訊、響應式立繪、圖示化屬性、Active Unit 指標與靜態攻擊範圍縮圖 | COMPLETED — FORMALLY ACCEPTED |
| M5-2 | 行動選單及戰鬥交互體驗優化 | IN PROGRESS |
| M5-2A | Battle Interaction UI：角色指令輪盤、單位檢視、水平行動順序軸與 CG 切換 | IMPLEMENTED — PENDING REVIEW |
| M5-2B | Battle Camera System | PENDING |
| M5-3 | 攻擊範圍與傷害預覽 | PENDING |
| M5-4 | 戰鬥提示與結果介面 | PENDING |

M5-1（含 UI Refinement Patch 1／2）已 **COMPLETED — FORMALLY ACCEPTED**；Independent Code Review **APPROVED — MINOR DOCUMENTATION CORRECTIONS**，Product Owner Visual Acceptance **APPROVED**。Closure baseline 為 `main` HEAD `ac074cda29ac7dad977d56e9fc720bb17e417205`，GitHub Actions Run [44647602225](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44647602225) SUCCESS；完整 Git／CI 證據與歷史驗證限制見 [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md)。保留 Agent 原始 Browser PARTIAL／NOT VERIFIED，不回溯改寫。M5-1 的靜態攻擊幾何縮圖只呈現正式攻擊模式，不包含目標選擇或傷害預覽；動態攻擊範圍／傷害預覽維持 M5-3 PENDING。

M5-2 拆分為 M5-2A Battle Interaction UI 與 M5-2B Battle Camera System，各占 M5-2 權重一半。M5-2A 已實作但尚待獨立審查與 Product Owner 驗收，狀態為 **IMPLEMENTED — PENDING REVIEW**；M5-2B 尚未開始。未完成正式結案前，M5 維持 25%、Overall 維持 42.5%，不調整完成里程碑數。M5-2A 不修改 Camera Controller；其 PAS 行動順序僅投影正式目前／預測資料。PAS 尚無每單位「本輪尚未／已行動」契約，因此不以猜測狀態套用灰化效果，詳見 [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md) 與 [TECHNICAL_DEBT.md](./TECHNICAL_DEBT.md)。UX-001～UX-005 維持 PENDING、Target Milestone 為 M5-3；UX-006 Active Unit Camera Framing 維持 PENDING、Target Milestone 為 M5-2B，詳見 [UX Backlog](./UX_BACKLOG.md)。SP 是 Skill Points，與 MOV（Movement Points）分開。

執行指引提及 M5-5，但目前 Roadmap 的 M5 分解只定義到 M5-4；M5-5 的名稱與驗收範圍尚未定義，本次不推測補寫。M1–M4 維持 100%；M5 為 25%；M6–M10 為 0%。Completed Milestones 維持 4/10，Overall 為 42.5%（4 個完成的主要里程碑 + M5 的 25% 等權重貢獻）。

## M6：正式美術與動畫 — PENDING

| ID | 項目 | 狀態 |
| --- | --- | --- |
| M6-1 | 正式 3D 角色與武器 | PENDING |
| M6-2 | 待機、移動、攻擊、受傷動畫 | PENDING |
| M6-3 | 技能特效與場景美術 | PENDING |
| M6-4 | 音效、背景音樂與演出 | PENDING |

## M7：技能與角色成長 — PENDING

| ID | 項目 | 狀態 |
| --- | --- | --- |
| M7-1 | 技能資料結構與施放系統 | PENDING |
| M7-2 | 初始技能「天風斬」 | PENDING |
| M7-3 | 經驗值、等級與屬性成長 | PENDING |
| M7-4 | 武器「信念」及技能演化架構 | PENDING |

## M8：劇情與對話系統 — PENDING

| ID | 項目 | 狀態 |
| --- | --- | --- |
| M8-1 | 劇情對話框與角色立繪 | PENDING |
| M8-2 | 男女主角選擇及自訂姓名 | PENDING |
| M8-3 | 劇情事件與選項 | PENDING |
| M8-4 | 分支旗標、羈絆與結局條件 | PENDING |

## M9：關卡與完整遊戲流程 — PENDING

| ID | 項目 | 狀態 |
| --- | --- | --- |
| M9-1 | 關卡資料與場景切換 | PENDING |
| M9-2 | 戰鬥前後劇情串接 | PENDING |
| M9-3 | 第一章可遊玩內容 | PENDING |
| M9-4 | 魔族／皇室路線分歧 | PENDING |

## M10：存檔、PWA 與發布 — PENDING

| ID | 項目 | 狀態 |
| --- | --- | --- |
| M10-1 | 本機存檔與讀檔 | PENDING |
| M10-2 | PWA 安裝與離線資源快取 | PENDING |
| M10-3 | 效能、手機及桌面適配 | PENDING |
| M10-4 | GitHub Pages 正式發布 | PENDING |

主要里程碑狀態為 M1–M4 100%、M5 IN PROGRESS（25%；M5-1 COMPLETED — FORMALLY ACCEPTED，M5-2 NEXT）、M6–M10 0%；完整結案主要里程碑仍為 4/10，等權重 Overall 為 42.5%。M5 尚未整體結案；完成後預計形成第一個可遊玩的戰鬥 Demo。此為 Roadmap Completion Percentage，不是實際工時比例。
