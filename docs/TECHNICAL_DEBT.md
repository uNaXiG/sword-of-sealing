# Technical Debt

狀態只反映已確認事實。Proposed 解法不代表已核准實作；未確認目標標為 TBD。

**技術債統計（TD-001 至 TD-020）**：共 20 項；CLOSED 11、OPEN 7、PENDING REVIEW 1、PARTIALLY RESOLVED 1。下列獨立 Bug 不計入。

| ID | Description | Impact | Priority | Status | Suggested Resolution | Target |
| --- | --- | --- | --- | --- | --- | --- |
| TD-001 | 待命後仍可撤銷移動 | Standby 未正確確認移動紀錄 | — | CLOSED | Reducer 清除 `lastMove` | M3-1 Patch 2 |
| TD-002 | 再次移動限制過度依賴 UI | 核心 State 可能被外部 Action 繞過 | — | CLOSED | Reducer 驗證未確認移動 | M3-1 Patch 2 |
| TD-003 | HP 歸零角色仍可操作 | 失能角色可被選取或參與行動 | — | CLOSED | 使用 `isUnitAlive()` 共用驗證 | M3-2 |
| TD-004 | React 動畫生命週期與取消風險 | StrictMode、Unmount 或重複事件可能造成過期狀態更新 | Medium | CLOSED | M3-3 已加入 Attack ID、Generation Guard、單一時鐘、事件去重與 System Abort；使用者 BV-15 在 StrictMode 下驗證攻擊期間 Canvas Unmount、重新進入、操作解鎖及無舊事件殘留 | M3-3 |
| TD-005 | 攻擊距離大於 1 的視覺驗證 | 初期只驗證近距離顯示 | — | CLOSED | 四種模式與邊界測試 | M3-2 Patch |
| TD-006 | Three.js Deprecated API | 目前會出現 `THREE.Clock`／`PCFSoftShadowMap` 相容性警告 | Low | OPEN | Proposed：依升級窗口逐項確認取代方式 | TBD |
| TD-007 | Battle Chunk Size 過大 | Vite 提示戰場 Bundle 超過 500 kB | Low | OPEN | Proposed：未來確認實際載入成本後再評估 lazy load／拆包 | TBD |
| TD-008 | 缺少正式架構與 Roadmap 文件 | Session／Agent 容易失去持久化上下文 | Low | CLOSED | DOC-01 已建立 docs 索引、架構與 Roadmap，並完成使用者驗收 | DOC-01 |
| TD-009 | `useBattleMovement` 命名與職責不符 | Hook 已管理攻擊、待命與衍生狀態，名稱可能誤導 | Low | OPEN | Proposed：後續正式重構並驗證所有使用點 | TBD |
| TD-010 | CanvasTexture 資源生命週期 | UnitLabel 及 Floating Damage Texture 不當清理可能造成資源洩漏 | Low | PARTIALLY RESOLVED | M3-3 已處理新增 Texture 的 Unmount 清理並通過 BV-15；M3-4 Patch 1 Revision 2 改為每個 UnitLabel 重用單一 CanvasTexture，於 Effect Cleanup dispose；Floating Damage 長時間資源壓力仍待觀察 | TBD |
| TD-011 | 職業平衡數值與測試耦合 | 調整 Registry 必須同步固定 `expectedStats` | Low | OPEN | Proposed：分離平衡值測試與資料結構合法性測試 | TBD |
| TD-012 | 攻擊屬性驗證模組耦合 | `validateAttackProperties()` 位於 `class.data.ts`，未來武器／技能也可能使用 | Low | OPEN | Proposed：規格確認後抽成中性攻擊驗證模組 | M7 Candidate |
| TD-013 | README 舊攻擊範圍敘述殘留 | 文件仍稱曼哈頓範圍，與四種模式不符 | Low | CLOSED | README 已改為依職業攻擊模式描述，並完成使用者驗收 | DOC-01 |
| TD-014 | Attack Animation Controller 的 emitted Attack ID 集合持續增長 | 長時間重複攻擊可能累積記憶體與 ID Set Entries | Low | OPEN | Proposed：在不破壞 StrictMode 防護下設計受限生命週期或清理窗口 | M10-3 Candidate |
| TD-015 | 命中視覺回饋可能早於 Reducer 確認 | 浮動傷害、受擊與死亡可能依預計結果誤顯示 | Medium | CLOSED | 改用 Confirmed Impact Event Queue；依據為無效／重複 Impact、Complete、Abort 等[回歸測試](../tests/battle.impact-feedback.test.mjs)及使用者 M3-4 瀏覽器驗收（BV-01 至 BV-20 全部 PASS） | M3-4 |
| TD-016 | PAS Floating-point Arrival Tolerance | 舊 Scheduler 以 Tie Candidate 的 AV 推進，近似同時抵達可能過度推進 | Medium | CLOSED | M4-2 分離最小事件時間與 Tie Selection；Exact-tie、Near-tie、Round Boundary、10,000 Continuous Events 均通過 | M4-2 |
| TD-017 | Player Standby Turn Context Integrity | 玩家 `standby` 舊缺少 Turn／Unit Context，重複事件可能污染下一 Turn | High | CLOSED | M4-2 玩家指令攜帶 Context；Reducer Guard 與 Direct Context Replay Tests 通過 | M4-2 |
| TD-018 | AGI Validation Consistency | Class Registry 接受 finite positive number，Battle State 要求 non-negative safe integer，PAS 又要求正速度；資料契約不一致 | Low | OPEN | 統一 Base AGI 合法值；未來明確分離 Base AGI 與 Effective Velocity；不為 M7 Buff 提前放寬所有基礎屬性 | M7 |
| TD-019 | Development Enemy Standby Authorization | Development 限制目前主要位於 UI 入口；核心尚未具有正式 AI 指令來源授權模型 | Low | PENDING REVIEW | M4-3 已移除 Development Enemy Standby；Patch 3 改由 AI Gateway 依 Controller Intent 發行凍結且以私有 identity set 驗證的 Action，Reducer 保留重驗證。Patch 3 本機 213/213、Lint、Build PASS；尚未提交／進 CI／完成 Browser Acceptance；待 Architecture／Code Review 後才可 CLOSED。既有 Patch 1／2 CI Run `44489947675` 與主要 Product Owner Acceptance 不代表 Patch 3 已驗收 | M4-3 |
| TD-020 | Extended Scheduling Verification Coverage | 舊 10,000 次測試缺少獨立 Oracle 與長期數值誤差證據 | Medium | CLOSED | M4-2 加入固定速度 Oracle、Continuous Near-tie、Round Boundary、Preview 一致性、長期誤差與非負距離驗證 | M4-2 |

## 已結案 Bug

- **M3-4-BUG-001 — CLOSED**：Revision 1 的固定 Sprite Anchor 未通過使用者視覺驗收。Revision 2 改用 Single CanvasTexture／Single Sprite，血槽與填充共用畫布座標。結案依據：[Revision 2 自動化回歸測試](../tests/unitLabel.test.mjs)及使用者瀏覽器驗收 8/8 PASS。

## Code Review 待追蹤風險

- **TD-010 · Unit Label Draw Cache**：[UnitLabel](../src/features/battle/components/UnitLabel.tsx) 的 Effect 建立新 CanvasTexture 時未明確重置 `lastDrawn`；若特殊 Effect 重建情境保留上一張 Texture 的快取，且內容與比例未變，可能跳過首次繪製。尚無使用者回報，未確認為實際缺陷。
- **Confirmed Impact Queue**：正常流程已通過使用者驗收（TD-015 CLOSED）。異常卸載／重新掛載時的事件清理、重播以及長時間資源累積，留待後續生命週期壓力測試；未確認為實際缺陷。

## M4-1 Code Review Findings

TD-016 至 TD-020 分別對應 ChatGPT Code Review CR-01 至 CR-05。使用者已核准 M4-1 條件式結案並延後修正；這些項目是確認的風險或防護缺口，不代表正常 Browser 操作已發生 Bug。

- TD-017 是 M4-2 必要前置修正，不得延至 M4-3。
- TD-016 與 TD-020 納入 M4-2 開發與驗證範圍。
- TD-018 留待 M7。
- TD-019 已由 M4-3 Capability AI 入口實作，目標狀態為 PENDING REVIEW。

## M4-2 Implementation Evidence — Formal Acceptance Approved

TD-016、TD-017、TD-020 的程式修復已實作並由本次 181/181 測試、ESLint 及 Production Build 驗證：

- TD-016：`deltaTime = min(AV_i)`；Tie Candidate 另以 Time Epsilon 選取，Time／Distance Epsilon 分離，非 Tie 的正剩餘距離不被正規化。
- TD-017：玩家 Set Mode、Move Request、Undo、Target Selection、Confirm、Cancel 及 Standby 在 Hook 建立時捕捉 Context；Reducer 先驗證 `turnId/unitId` 及 Action State。Animation Events 仍由不可變 Lifecycle ID 驗證。
- TD-020：新增 10,000 次 `k × ACTION_DISTANCE / velocity` 獨立 Oracle，覆蓋行動次數比例、最大時間／距離誤差、Round Boundary、Near-tie、同時抵達及 Preview／正式排程一致性。
- Patch 1 HARDENING：新增 10,000 次 Near-tie × Round Boundary Deterministic Stress、Time Epsilon 內／外邊界、1,000 次 Preview／正式排程一致性；未放大既有 Epsilon。
- Final Verification Addendum：新增同一 Scheduler 連續 10,000-event Near-tie 測試與 Direct Reducer Context Replay 測試；仍未修改 Epsilon 或 Gameplay 規則。

Architecture Review、Code Review、Final Verification 與 Product Owner Browser Acceptance 均已完成。TD-016、TD-017、TD-020 更新為 **CLOSED**；Git／CI Baseline 將由本次 Formal Closure Commit 後正式同步。

## 已知非阻擋性警告

- Three.js 的 `Clock` deprecated 與 `PCFSoftShadowMap` compatibility 警告。
- Vite Battle Chunk 超過 500 kB。

M3-3 已依使用者 BV-15 關閉 TD-004。TD-010 的直接相關 Texture Cleanup 已實作及通過場景重入驗收，但缺少長時間資源壓力與記憶體測量，因此保持 PARTIALLY RESOLVED。其餘技術債維持既有狀態。

TD-014 維持 OPEN，本次結案不進行重構。

## M4-3 Implementation Evidence — Pending Formal Review

TD-019 的 `simulate-enemy-standby` UI／Reducer 入口已移除，並由以下正式設計取代：

- `battle.ai.ts` 僅負責純 AI Decision；`battle.ai.gateway.ts` 以私有 WeakSet identity capability 記錄凍結的 Action，且只根據當前 State 的 Controller Intent 發行，不接受任意呼叫端 Intent。
- `battleReducer` 對 AI Turn／Unit、Faction、Alive、Action State、Busy／Pending、目標、目的地、路徑、Reservation 與 Progress Phase 再驗證。
- `useBattleAI` 不直接修改 Battle State；所有 Move、Attack、Abort Recovery 與 Standby 均經 Reducer。
- AI Progress 由 State 管理；敵方 Pre-impact Abort 釋放 Reservation 並明確排入該 Turn Completion，Pending Completion 仍等待阻擋 Motion；玩家 Abort 行為不變。
- Terminal State 只停止 AI Controller，不建立 M4-4 Victory／Defeat Outcome。

Patch 3 本機回歸以 [213/213 tests](../DEVELOPMENT_STATUS.md#驗證結果)、ESLint 與 Production Build 通過；受控 Frame Harness 驗證首幀 Clock 初始化、Effect Replay cleanup、Attack ID mismatch，以及同一 Frame 跨越 Impact／Complete 時只結算一次傷害。Patch 3 未執行 Browser Verification，未取得新 CI 或 Product Owner Acceptance，且未提交／推送。

TD-019 目前為 **PENDING REVIEW**；Architecture／Code Review 未完成前不得改為 CLOSED。

## M4-3 Patch 3 — Abort and Capability Hardening

- **Capability Issuance**：移除純決策模組公開的 Action signer；Gateway 只可從當前 Battle State 衍生 Controller Intent，再建立凍結 Action 並以物件 identity 驗證授權。Reducer 對 Action 狀態與戰鬥條件繼續重新驗證。
- **Enemy Pre-impact Abort**：清除未命中結果與 Reservation 後，敵方 AI Abort 將該攻擊者 Turn 排入既有 Pending Turn Completion 流程；Death Motion 等阻擋仍由共用 Resolver 處理。Player Pre-impact Abort 不改變既有保留 Turn 行為。
- **Attack Controller Lifecycle**：React component 與 Node 測試共用 `AttackAnimationControllerLifecycle`；驗證 useFrame 先於 Effect 的 Clock 初始化、StrictMode cleanup replay、錯誤 Attack ID 隔離及一次 Frame 內 Impact／Complete。
- **Verification**：本機 `npm test` 213/213 PASS、ESLint PASS、Production Build PASS；Build 僅有既有 Chunk-size warning。Browser、Product Owner Acceptance、GitHub CI 與正式 Review 未驗證。

## BUG-M4-3-003 — Enemy Animation Impact Regression

- **Status**：FIXED — Patch 2；主要 Product Owner Browser Acceptance 已 PASS。
- **Root Cause**：AttackAnimationController 的 passive Effect 尚未初始化 Clock 時，`useFrame` 將 null Clock 當成可中止異常，造成 Pre-impact Abort。
- **Trigger**：Patch 1 的 Controller 於 MOVE_COMPLETED Effect 提交 AI Attack，使有效 AttackMotion 與 Clock Initialization 的 Render／Frame Ordering 更容易形成競態。
- **Fix**：首個有效 Frame 建立 matching Attack ID 的 0ms Clock；不變更 Impact Guard、Damage Formula、Capability 或 Turn Completion。
- **Evidence**：Before trace 無 Impact Callback 且無 HP Change；After trace 取得 Reducer IMPACT ACCEPTED，Applied Damage 10，Ranger HP 80→70；210/210 automated tests。
- **Remaining**：特殊長時間、Console Abort 與其他未完成特殊 Browser Scenarios 保持個別 NOT VERIFIED；TD-019 維持 PENDING REVIEW。

## M4-3 Patch 1 — AI Attack Lifecycle

- **BUG-M4-3-001 — FIXED — Patch 1**：Direct Attack 決策可被 Controller 純 Intent 函式獨立驗證，不會因 Controller 分支落入 Standby。
- **BUG-M4-3-002 — FIXED — Patch 1**：Move-to-Attack 不再用 `MOVING + movementUsed` 隱含推斷完成；Reducer 的 Finish Transition 明確建立 `MOVE_COMPLETED`。
- **Root Cause**：Phase 語意重疊使 Controller 第二階段缺乏 Durable Contract；此外原目標失效時沒有以最新 State 重新尋找合法目標。
- **Fix Evidence**：同一 Turn Move→Attack、Movement Initiation Lock、失效目標 retarget、Direct Intent、Impact／Complete Turn、Abort／Replay Regression 均為 PASS。
- **Status**：FIXED — Patch 1；Automated Verification、功能瀏覽器驗證與主要 Product Owner Browser Acceptance 已完成。特殊未完成 Browser Scenarios 不得補寫為 PASS；TD-019 維持 PENDING REVIEW。

## M4-1 階段性限制

以下項目是 Roadmap 明確排定的後續範圍，不視為新增技術債：

- M4-2：完整個體行動限制、Action Economy 與狀態重置。
- M4-3：正式敵方移動／攻擊 AI，並移除 Development-only Enemy Standby。
- M4-4：勝利、失敗與戰鬥結束。
- M7：Action Advance、Action Delay、Speed Up／Down 等未來效果。

Production Build 遇到 Enemy Turn 時會等待 M4-3，不提供玩家可用的敵方控制後門。
