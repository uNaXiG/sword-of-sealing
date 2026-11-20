# Technical Debt

狀態只反映已確認事實。Proposed 解法不代表已核准實作；未確認目標標為 TBD。

**技術債統計（TD-001 至 TD-022）**：共 22 項；CLOSED 12、OPEN 9、PARTIALLY RESOLVED 1。下列獨立 Bug 不計入。

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
| TD-010 | CanvasTexture 資源生命週期 | UnitLabel 及 Floating Damage Texture 不當清理可能造成資源洩漏 | Low | PARTIALLY RESOLVED | M3-3／M3-4 Texture cleanup 已實作；M4-4C VA1 記錄 14/14 observed Context Loss identity matches、final Route exit 後 0 connected Canvas、Heap 約 93.02–110.18 MB（Final Menu 107,159,387 bytes）。`renderer.info.memory`、GPU Disposal 與長時間資源穩定性 NOT VERIFIED；無已確認可重現的 Resource Leak，但不宣稱不存在 Leak。建議於 M10 效能／穩定性窗口進一步量測 | M10 Candidate |
| TD-011 | 職業平衡數值與測試耦合 | 調整 Registry 必須同步固定 `expectedStats` | Low | OPEN | Proposed：分離平衡值測試與資料結構合法性測試 | TBD |
| TD-012 | 攻擊屬性驗證模組耦合 | `validateAttackProperties()` 位於 `class.data.ts`，未來武器／技能也可能使用 | Low | OPEN | Proposed：規格確認後抽成中性攻擊驗證模組 | M7 Candidate |
| TD-013 | README 舊攻擊範圍敘述殘留 | 文件仍稱曼哈頓範圍，與四種模式不符 | Low | CLOSED | README 已改為依職業攻擊模式描述，並完成使用者驗收 | DOC-01 |
| TD-014 | Attack Animation Controller 的 emitted Attack ID 集合持續增長 | 長時間重複攻擊可能累積記憶體與 ID Set Entries | Low | OPEN | Proposed：在不破壞 StrictMode 防護下設計受限生命週期或清理窗口 | M10-3 Candidate |
| TD-015 | 命中視覺回饋可能早於 Reducer 確認 | 浮動傷害、受擊與死亡可能依預計結果誤顯示 | Medium | CLOSED | 改用 Confirmed Impact Event Queue；依據為無效／重複 Impact、Complete、Abort 等[回歸測試](../tests/battle.impact-feedback.test.mjs)及使用者 M3-4 瀏覽器驗收（BV-01 至 BV-20 全部 PASS） | M3-4 |
| TD-016 | PAS Floating-point Arrival Tolerance | 舊 Scheduler 以 Tie Candidate 的 AV 推進，近似同時抵達可能過度推進 | Medium | CLOSED | M4-2 分離最小事件時間與 Tie Selection；Exact-tie、Near-tie、Round Boundary、10,000 Continuous Events 均通過 | M4-2 |
| TD-017 | Player Standby Turn Context Integrity | 玩家 `standby` 舊缺少 Turn／Unit Context，重複事件可能污染下一 Turn | High | CLOSED | M4-2 玩家指令攜帶 Context；Reducer Guard 與 Direct Context Replay Tests 通過 | M4-2 |
| TD-018 | AGI Validation Consistency | Class Registry 接受 finite positive number，Battle State 要求 non-negative safe integer，PAS 又要求正速度；資料契約不一致 | Low | OPEN | 統一 Base AGI 合法值；未來明確分離 Base AGI 與 Effective Velocity；不為 M7 Buff 提前放寬所有基礎屬性 | M7 |
| TD-019 | Development Enemy Standby Authorization | Development 限制目前主要位於 UI 入口；核心尚未具有正式 AI 指令來源授權模型 | Low | CLOSED — M4-3 FORMAL ACCEPTANCE | M4-3 移除 Development Enemy Standby；AI Gateway／private WeakSet Action Identity、Reducer Authorization Revalidation、Enemy Pre-impact Abort Contract、TEST-M4-3-01、223/223 Tests、GitHub CI、Product Owner Browser Acceptance 與獨立 Architecture／Code Review 均完成 | M4-3 |
| TD-020 | Extended Scheduling Verification Coverage | 舊 10,000 次測試缺少獨立 Oracle 與長期數值誤差證據 | Medium | CLOSED | M4-2 加入固定速度 Oracle、Continuous Near-tie、Round Boundary、Preview 一致性、長期誤差與非負距離驗證 | M4-2 |
| TD-021 | Existing Development Dependency Audit Advisories | Agent 回報 `npm audit` 有 7 個 Moderate advisories，主要涉及既有 dev-only `typescript-eslint`／`minimatch` 相依鏈；`npm audit --omit=dev` 為 0 vulnerabilities，非 Production Runtime Vulnerability | Low | OPEN | 另行評估受影響 transitive dependency 的相容更新，並重跑 audit、lint、tests、build | Dependency Maintenance |
| TD-022 | PAS Per-unit Action-status Presentation Contract | PAS 提供 Active Unit 與正式預測序列，但沒有每單位「本輪尚未行動／已行動」狀態 | Low | OPEN | 先確認正式回合語意與資料契約；未確認前 UI 不依陣營、選取或 timeline index 推斷狀態／gray-out | TBD |

M5-2A Patch 1 只修正 Presentation Policy、Attack Target State 一致性與 UI 投影；未以灰化或其他 UI 變通補足 TD-022，該缺口維持 OPEN。

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
- TD-019 已由 M4-3 Capability AI 入口實作並於 M4-3 Formal Acceptance 後 CLOSED；TEST-M4-3-01 與獨立 Review 結案證據見下方紀錄。

## M4-2 Implementation Evidence — Formal Acceptance Approved

> 歷史驗證紀錄：以下是 M4-2 Formal Acceptance 當時的證據；其後 Git／CI 基準已在相應文件任務中同步。

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

M3-3 已依使用者 BV-15 關閉 TD-004。TD-010 維持 PARTIALLY RESOLVED：M4 Formal Closure 接受 VA1 已記錄的 WebGL 診斷限制，並核准將 `renderer.info.memory`、GPU Disposal 與長時間資源穩定性驗證延至建議的 M10 效能／穩定性窗口。沒有已確認可重現的 Resource Leak；也沒有證據可宣稱不存在 Leak。其餘技術債與 UX Backlog 維持既有狀態。

TD-014 維持 OPEN，本次結案不進行重構。

## M4-3 Formal Closure — TD-019

**Status：CLOSED — M4-3 FORMAL ACCEPTANCE。** TD-019 原始問題、Capability 修正歷史及相關 Patch／Bug 記錄均保留。

- **AI Gateway**：從當前 Battle State 導出 Controller Intent，發行凍結 AI Action，並以 private WeakSet identity capability 驗證 Action 來源。
- **Reducer Authorization Revalidation**：Reducer 重新驗證 AI Context、Faction、Alive、Action State、Busy／Pending、Target、Destination、Reservation 與 Lifecycle。
- **Enemy Pre-impact Abort Contract**：不造成傷害、不自動重試攻擊；清除 Reservation 後安全完成敵方 Turn，並由 Pending Resolver 遵守 Death Barrier。
- **React Controller Lifecycle Integration**：TEST-M4-3-01 的 10 項 ReactDOM／StrictMode 測試實際掛載 Controller；受控 Frame 驅動正式 Lifecycle Runtime，callback dispatch 至正式 Reducer。Lifecycle Runtime 與 Reducer 未 Mock，視覺元件以 Stub 隔離；不宣稱 WebGL 或完整 E2E。
- **Verification**：223/223 Automated Tests、ESLint、Production Build PASS；GitHub Actions Run `44500720991` SUCCESS，對應 Repository Commit `4043459cfa3cb884aa9d9a6653ed646ef59975a9`。
- **Acceptance / Review**：Product Owner Browser Acceptance PASS（2026-11-19）；Architecture Review、Code Review APPROVED；CR-M4-3-01／02／03 及 TEST-M4-3-01 CLOSED — PASS。

## M4-3 Implementation Evidence — Historical Conditional Review Snapshot

> 歷史快照：以下 Review 狀態記錄於正式結案前；目前 TD-019 狀態及結案證據見上方「M4-3 Formal Closure — TD-019」。

TD-019 的 `simulate-enemy-standby` UI／Reducer 入口已移除，並由以下正式設計取代：

- `battle.ai.ts` 僅負責純 AI Decision；`battle.ai.gateway.ts` 以私有 WeakSet identity capability 記錄凍結的 Action，且只根據當前 State 的 Controller Intent 發行，不接受任意呼叫端 Intent。
- `battleReducer` 對 AI Turn／Unit、Faction、Alive、Action State、Busy／Pending、目標、目的地、路徑、Reservation 與 Progress Phase 再驗證。
- `useBattleAI` 不直接修改 Battle State；所有 Move、Attack、Abort Recovery 與 Standby 均經 Reducer。
- AI Progress 由 State 管理；敵方 Pre-impact Abort 釋放 Reservation 並明確排入該 Turn Completion，Pending Completion 仍等待阻擋 Motion；玩家 Abort 行為不變。
- Terminal State 只停止 AI Controller，不建立 M4-4 Victory／Defeat Outcome。

Patch 3 的 213/213 tests、ESLint 與 Production Build 為 Agent 回報；GitHub Actions Run `44496931887` 對應 Commit `6052c6197588b00c8732f34b7dbda0a3dc696a25` 並成功。Product Owner Browser Acceptance 於 2026-11-19 PASS。後續本機 TEST-M4-3-01 將 React Controller 真正掛載於 ReactDOM／StrictMode，由 layout-phase `useFrame` harness 控制 delta 並執行正式 Lifecycle Runtime；Impact／Complete／Abort callbacks 均 dispatch 至正式 `battleReducer`。本機 `npm test` 223/223、ESLint、Production Build PASS。jsdom 測試不是 Browser Verification，亦不改寫既有 Acceptance 或 GitHub CI 基準。

Architecture／Code Review 均為 **CONDITIONAL PASS**。CR-M4-3-01（AI Gateway Capability Boundary）及 CR-M4-3-02（Enemy Pre-impact Abort Contract）PASS；CR-M4-3-03 的 Architecture Review PASS，React-mounted Controller Integration Evidence 已補齊，待獨立審查。

**TEST-M4-3-01 — React Controller Lifecycle Integration Evidence**：已實作並由本機 10 項 ReactDOM 整合測試驗證，涵蓋 StrictMode Effect Replay、passive Effect 前 Frame Clock 初始化、受控 delta、Attack ID 隔離、Player／Enemy Abort、同幀 Impact／Complete、HP 更新與 Death Motion Barrier；所有 Controller callbacks 使用正式 Reducer。AC-01～AC-20 證據矩陣及案例結果記錄於 [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md)。本次 `npm test` 223/223、ESLint、Production Build PASS；新證據尚待獨立 Architecture／Code Review，無正式豁免。

歷史狀態：當時 TD-019 為 APPROVED FOR CLOSURE，TEST-M4-3-01 等待獨立審查；該狀態已由上方 Formal Closure 取代。

## M4-3 Patch 3 — Abort and Capability Hardening

> 歷史實作紀錄：以下列出 Patch 3 的技術內容與該次驗證範圍；最新 M4-3 Review、CI 及 Formal Closure 狀態見本文件上方「M4-3 Formal Closure — TD-019」。

- **Capability Issuance**：移除純決策模組公開的 Action signer；Gateway 只可從當前 Battle State 衍生 Controller Intent，再建立凍結 Action 並以物件 identity 驗證授權。Reducer 對 Action 狀態與戰鬥條件繼續重新驗證。
- **Enemy Pre-impact Abort**：清除未命中結果與 Reservation 後，敵方 AI Abort 將該攻擊者 Turn 排入既有 Pending Turn Completion 流程；Death Motion 等阻擋仍由共用 Resolver 處理。Player Pre-impact Abort 不改變既有保留 Turn 行為。
- **Attack Controller Lifecycle**：React component 與 Node 測試共用 `AttackAnimationControllerLifecycle`；驗證 useFrame 先於 Effect 的 Clock 初始化、StrictMode cleanup replay、錯誤 Attack ID 隔離及一次 Frame 內 Impact／Complete。
- **Verification**：本機 `npm test` 213/213 PASS、ESLint PASS、Production Build PASS；Build 僅有既有 Chunk-size warning。Browser、Product Owner Acceptance、GitHub CI 與正式 Review 未驗證。

## BUG-M4-3-003 — Enemy Animation Impact Regression

> Patch 2 當時的驗證快照；最新 CI、Product Owner Acceptance 與 Review 狀態見上方 M4-3 Patch 3。

- **Status**：FIXED — Patch 2；主要 Product Owner Browser Acceptance 已 PASS。
- **Root Cause**：AttackAnimationController 的 passive Effect 尚未初始化 Clock 時，`useFrame` 將 null Clock 當成可中止異常，造成 Pre-impact Abort。
- **Trigger**：Patch 1 的 Controller 於 MOVE_COMPLETED Effect 提交 AI Attack，使有效 AttackMotion 與 Clock Initialization 的 Render／Frame Ordering 更容易形成競態。
- **Fix**：首個有效 Frame 建立 matching Attack ID 的 0ms Clock；不變更 Impact Guard、Damage Formula、Capability 或 Turn Completion。
- **Evidence at Patch 2**：Before trace 無 Impact Callback 且無 HP Change；After trace 取得 Reducer IMPACT ACCEPTED，Applied Damage 10，Ranger HP 80→70；當時 210/210 automated tests。
- **Remaining at Patch 2**：特殊長時間、Console Abort 與其他未完成特殊 Browser Scenarios 保持個別 NOT VERIFIED；當時 TD-019 為 PENDING REVIEW。

## M4-3 Patch 1 — AI Attack Lifecycle

> Patch 1 當時的狀態快照；TD-019 最新狀態見上方「M4-3 Formal Closure — TD-019」。

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
