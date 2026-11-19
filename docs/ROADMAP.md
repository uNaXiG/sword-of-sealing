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

## M4：動態回合制與敵方 AI — IN PROGRESS（75%）

| ID | 項目 | 狀態 |
| --- | --- | --- |
| M4-1 | 物理競速式行動與個體回合系統 | COMPLETED — Conditional Closure |
| M4-1 Patch 1 | 移動確認與指令流程修正 | COMPLETED |
| M4-2 | Individual Action Economy & Turn State Reset | COMPLETED — Formal Acceptance Approved |
| M4-2 Patch 1 | Code Review Hardening & Verification | COMPLETED |
| M4-3 | 敵方移動與攻擊決策 | COMPLETED — FORMALLY ACCEPTED |
| M4-4 | 勝利、失敗與戰鬥結束 | IN PROGRESS |
| M4-4A | Extensible End Condition Architecture & Battle Resolution | COMPLETED — FORMALLY ACCEPTED |
| M4-4B | Overlay、Restart 與 Session Isolation | COMPLETED — CONDITIONALLY ACCEPTED |
| M4-4C | Final Regression、Browser Verification、Independent Review 與 Formal Acceptance | IN PROGRESS — PARTIAL VERIFICATION; REVIEW PENDING |

M4-1 與 M4-2 均已完成。M4-3 Enemy AI、Patch 1／2／3 與 TEST-M4-3-01 已正式驗收結案。M4-4A End Condition Framework & Battle Outcome 已於 2026-11-20 完成正式結案：Patch 1 **COMPLETED — ACCEPTED**，Final Review Correction **COMPLETED — VERIFIED**；Architecture Review、Independent Code Review、Product Owner Acceptance 與 Formal Closure 均 APPROVED。M4-4B **COMPLETED — CONDITIONALLY ACCEPTED**：Architecture Review APPROVED、Independent Code Review APPROVED WITH LIMITATIONS、Product Owner Browser Acceptance BV-B01～B10 10/10 PASS、Conditional Closure APPROVED。M4-4B Feature Commit `e299fa48e28d16e24aadba9cc7925bedf4d53895` 對應 GitHub Actions Run [44605672030](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44605672030) SUCCESS。M4-4C 開始基準 `3705dfe0737fe0df1798f280c5e1c5c8056f8ad9` 對應 Run [44607801214](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44607801214) SUCCESS；本次本機驗證為 270/270 Tests、Lint 與 Build PASS，Build 保留既有 >500 kB Battle Chunk warning。Production Route Integration 與部分 Browser Regression 已有證據，但 GPU Renderer Stats、終局 Browser 情境及其他未完成項目仍待驗證；M4-4C 維持 IN PROGRESS、等待 Independent Review 與 Product Owner Acceptance。M4-4B 原 Agent WebGL fallback 紀錄不回溯改寫。M4-4B 原始自動化 Test Traceability 為 28 PASS／2 PARTIAL，綜合 AC 為 36 PASS／1 PARTIAL；B-T06、B-T30 與 AC-B30 的原狀保留。RC-M4-4B-07 及 RV-M4-4B-01～03 的證據與限制見 [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md)，未宣告正式關閉。M4-4B Patch 1 未啟動，M4-4 Formal Acceptance 仍 PENDING。M4 維持 75%；Overall 維持 37.5%。

M4-4C Verification Addendum 1 已補足 Production Victory／Defeat Route unmount 測試、十次 Restart 的逐次 lifecycle assertion，以及 Timer／Listener／Deferred Work 證據；`npm test` 為 271/271，Production Route Integration 為 6/6。VA1 WebGL 量測完成 2 次 warm-up 與 10 次往返，14 個已觀察 Context 均有對應 Loss Event，惟 `renderer.info.memory` 仍不可用，因此 GPU Resource Lifecycle 維持 PARTIAL。M4-4C 仍 IN PROGRESS，Independent Review 與 Product Owner Acceptance PENDING；M4 維持 75%、Overall 37.5%，不開始 M5。

## M5：戰鬥 UI／UX — PENDING

| ID | 項目 | 狀態 |
| --- | --- | --- |
| M5-1 | 角色資訊、HP、SP 顯示 | PENDING |
| M5-2 | 行動選單及戰鬥交互體驗優化 | PENDING |
| M5-3 | 攻擊範圍與傷害預覽 | PENDING |
| M5-4 | 戰鬥提示與結果介面 | PENDING |

M5-2 包含 [UX-001 至 UX-005](./UX_BACKLOG.md)。SP 是 Skill Points，與 MOV（Movement Points）分開。

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

M5 完成後預計形成第一個可遊玩的戰鬥 Demo。主要里程碑完成度為 M1 100%、M2 100%、M3 100%、M4 75%、M5–M10 0%；完整結案主要里程碑仍為 3/10，M4 目前進行至 75%，等權重進度為 37.5%。此為 Roadmap Completion Percentage，不是實際工時比例。
