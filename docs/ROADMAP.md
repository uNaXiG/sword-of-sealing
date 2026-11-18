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

## M3：基礎戰鬥系統 — IN PROGRESS

| ID | 項目 | 狀態 |
| --- | --- | --- |
| M3-1 | 攻擊距離與目標判斷 | COMPLETED |
| M3-1 Patch 1 | 角色行動選單與操作流程 | COMPLETED |
| M3-1 Patch 2 | 待命與移動確認機制修正 | COMPLETED |
| M3-2 | 基礎傷害公式與 HP | COMPLETED |
| M3-2 Patch | 職業抽象化與攻擊模式系統 | COMPLETED |
| M3-3 | 攻擊動畫與受擊反饋 | COMPLETED |
| M3-4 | 單位死亡及移除 | IMPLEMENTED — Acceptance Pending |

M3-3 已納入 `5fba4ed`，通過 100/100 自動化測試、40/40 AC、15/15 Browser Verification 及 CI Run `44226768648`。M3-4 已實作並等待使用者驗收；M3 完成度維持 75%，整體主要里程碑等權重估算為 27.5%。

## M4：回合制與敵方 AI — PENDING

| ID | 項目 | 狀態 |
| --- | --- | --- |
| M4-1 | 玩家／敵方回合切換 | PENDING |
| M4-2 | 行動狀態與回合重置 | PENDING |
| M4-3 | 敵方移動與攻擊決策 | PENDING |
| M4-4 | 勝利、失敗與戰鬥結束 | PENDING |

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

M5 完成後預計形成第一個可遊玩的戰鬥 Demo。主要里程碑等權重進度約 27.5%，不是實際工時比例。
