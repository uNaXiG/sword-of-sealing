# Technical Debt

狀態只反映已確認事實。Proposed 解法不代表已核准實作；未確認目標標為 TBD。

| ID | Description | Impact | Priority | Status | Suggested Resolution | Target |
| --- | --- | --- | --- | --- | --- | --- |
| TD-001 | 待命後仍可撤銷移動 | Standby 未正確確認移動紀錄 | — | CLOSED | Reducer 清除 `lastMove` | M3-1 Patch 2 |
| TD-002 | 再次移動限制過度依賴 UI | 核心 State 可能被外部 Action 繞過 | — | CLOSED | Reducer 驗證未確認移動 | M3-1 Patch 2 |
| TD-003 | HP 歸零角色仍可操作 | 失能角色可被選取或參與行動 | — | CLOSED | 使用 `isUnitAlive()` 共用驗證 | M3-2 |
| TD-004 | React 動畫生命週期與取消風險 | StrictMode、Unmount 或重複事件可能造成過期狀態更新 | Medium | OPEN | Proposed：明確定義 generation、取消、完成及忽略事件；需搭配 M3-3 規格 | M3-3 |
| TD-005 | 攻擊距離大於 1 的視覺驗證 | 初期只驗證近距離顯示 | — | CLOSED | 四種模式與邊界測試 | M3-2 Patch |
| TD-006 | Three.js Deprecated API | 目前會出現 `THREE.Clock`／`PCFSoftShadowMap` 相容性警告 | Low | OPEN | Proposed：依升級窗口逐項確認取代方式 | TBD |
| TD-007 | Battle Chunk Size 過大 | Vite 提示戰場 Bundle 超過 500 kB | Low | OPEN | Proposed：未來確認實際載入成本後再評估 lazy load／拆包 | TBD |
| TD-008 | 缺少正式架構與 Roadmap 文件 | Session／Agent 容易失去持久化上下文 | Low | IMPLEMENTED — Acceptance Pending | DOC-01 已建立 docs 索引、架構與 Roadmap；使用者驗收後才能 CLOSED | DOC-01 |
| TD-009 | `useBattleMovement` 命名與職責不符 | Hook 已管理攻擊、待命與衍生狀態，名稱可能誤導 | Low | OPEN | Proposed：後續正式重構並驗證所有使用點 | TBD |
| TD-010 | CanvasTexture 資源生命週期 | UnitLabel HP 更新會建立新 Texture；不當清理可能造成資源洩漏 | Low | OPEN | Proposed：以 React StrictMode／Unmount 測試確認 dispose 與 generation 策略 | TBD |
| TD-011 | 職業平衡數值與測試耦合 | 調整 Registry 必須同步固定 `expectedStats` | Low | OPEN | Proposed：分離平衡值測試與資料結構合法性測試 | TBD |
| TD-012 | 攻擊屬性驗證模組耦合 | `validateAttackProperties()` 位於 `class.data.ts`，未來武器／技能也可能使用 | Low | OPEN | Proposed：規格確認後抽成中性攻擊驗證模組 | M7 Candidate |
| TD-013 | README 舊攻擊範圍敘述殘留 | 文件仍稱曼哈頓範圍，與四種模式不符 | Low | IMPLEMENTED — Acceptance Pending | README 已改為依職業攻擊模式描述 | DOC-01 |

## 已知非阻擋性警告

- Three.js 的 `Clock` deprecated 與 `PCFSoftShadowMap` compatibility 警告。
- Vite Battle Chunk 超過 500 kB。

本次 DOC-01 未修復 TD-004、TD-006、TD-007、TD-009、TD-010、TD-011 或 TD-012。
