# Development Status

最後確認日期：2026-11-20。

## 狀態語彙

- **已實作**：程式或文件已存在。
- **已驗收**：使用者已完成對應驗收；Agent 不得代為標記。
- **已提交**：Git HEAD 已包含該異動。

## 目前基準

| 項目 | 狀態 |
| --- | --- |
| Current Verified Repository Baseline | `uNaXiG/sword-of-sealing` · `main` @ `41b43c77e849276847c8c643deedd3a7ca0b0747` — M4-4A Formal Closure documentation |
| Latest Verified Repository CI Run | [44596893220](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44596893220) — SUCCESS（`main` / `41b43c7`） |
| Latest Verified M4-4A Feature Commit | `main` @ `1cce94613791548cc1717942b72d1513487db857`；End Condition Framework & Battle Outcome |
| Latest Verified Repository Commit | `main` @ `41b43c77e849276847c8c643deedd3a7ca0b0747`；本機 HEAD 及 `origin/main` tracking ref 相符 |
| M4-3 Gameplay Commit / CI | Commit `6052c6197588b00c8732f34b7dbda0a3dc696a25`；[Run 44496931887](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44496931887) — SUCCESS |
| M4-4A Patch 1 Session Start Baseline | 歷史基準：`main` HEAD `11b1652d1702376d703da8eed4cb83586e23401e`；當時工作樹乾淨，之後 Patch 1 與原 M4-4A 異動已納入 `1cce946` |
| Current Working Tree | M4-4B Runtime、Test 與文件異動尚未提交；`41b43c7`／Run `44596893220` 為開始基準，不涵蓋本次異動；未 Commit／Push |
| 最近完成項目 | M4-1：COMPLETED — Conditional Closure；M4-2：COMPLETED — Formal Acceptance Approved；M4-3：COMPLETED — FORMALLY ACCEPTED |
| 主要里程碑狀態 | M1–M3 **COMPLETED**；M4 **IN PROGRESS（75%）**，M4-4A **COMPLETED — FORMALLY ACCEPTED**；M4-4B **IMPLEMENTED — PENDING REVIEW**；M4-4C **PENDING DEVELOPMENT**；安排以 [ROADMAP.md](./ROADMAP.md) 為準 |
| M3-4 與 Patch 1（Revision 2） | **COMPLETED**；已實作、已驗收、已提交並通過 CI |
| M3 進度 | 100% |
| M4 進度 | 75%（3/4） |
| 完整結案主要里程碑 | 3/10 |
| 整體里程碑等權重進度 | 37.5%（Roadmap Completion Percentage，不代表實際工時比例） |
| M4 結案狀態 | M4-1：**COMPLETED — Conditional Closure**；M4-1 Patch 1：**COMPLETED**；M4-2：**COMPLETED — Formal Acceptance Approved**；M4-2 Patch 1：**COMPLETED**；M4-3：**COMPLETED — FORMALLY ACCEPTED** |
| M4-2 狀態 | **COMPLETED — Formal Acceptance Approved**；Feature Commit 與對應 CI 已驗證 |
| M4-3 狀態 | **COMPLETED — FORMALLY ACCEPTED**；Patch 1／2／3 與 TEST-M4-3-01 已完成；223/223 Automated Tests；Product Owner Browser Acceptance、Architecture Review、Code Review 均 APPROVED |
| Code Review Findings | CR-M4-3-01／02／03 CLOSED；TEST-M4-3-01 CLOSED — PASS；TD-019 CLOSED |
| M4-4 狀態 | **IN PROGRESS**；M4-4A **COMPLETED — FORMALLY ACCEPTED**；M4-4B **IMPLEMENTED — PENDING REVIEW**；M4-4C **PENDING DEVELOPMENT** |
| M3 Closure Documentation | 已提交至 `9c8e623` 並通過 Repository CI |

## 驗證結果

| 驗證 | 結果 | 來源與範圍 |
| --- | --- | --- |
| M4-2 Automated Tests | 181/181 PASS（新增 27 項） | Final Verification Addendum；含 10,000-event Continuous Near-tie Scheduler、Direct Reducer Context Tests、Lock／Guard hardening 與 PAS Oracle |
| M4-2 ESLint、Production Build | ESLint PASS；Build PASS | 本次 M4-2 實作；Build 保留 Battle Chunk > 500 kB 既知警告 |
| M4-2 Browser Verification | PASS — Product Owner Acceptance Approved | 已驗證普通攻擊、Impact／實際扣血、動作後自動 Turn、致命攻擊與死亡阻擋、死亡後 Timeline 移除、攻擊中離場重入、非 Active Unit 拒絕、移動路徑預覽及多次場景重入 |
| M4-2 Acceptance Criteria | PASS — Formal Acceptance Approved | Architecture Review、Code Review、Final Verification 及 Product Owner Browser Acceptance 均完成 |
| M4-1 Automated Baseline | 154/154 PASS；ESLint PASS；Build PASS | 原 M4-1 Patch 1 驗證基準；已由本次 M4-2／Final Addendum Regression 延伸至 181/181 |
| Markdown 相對連結與文件一致性 | PASS | DOC-01 Patch 1 本次檢查 |
| 使用者瀏覽器驗收 | M4-1 24/24 PASS；M4-1 Patch 1 10/10 PASS | 使用者後續正式驗收；不回溯改寫 Agent 原始 PARTIAL Browser Report |
| Acceptance Criteria | M3-3 40/40 PASS；M3-4 52/52 PASS；M3-4 Patch 1 Revision 2 12/12 PASS；M4-1 Patch 1 24/24 PASS | Agent Implementation Report 與既有驗收證據。M4-1 原始 AC 不因此無條件標記為 70/70 PASS |
| M4-3 Implementation | COMPLETED — FORMALLY ACCEPTED | Pure Decision、AI Gateway、Reducer Authorization、AI Controller 與 Attack Lifecycle 均完成；Patch 1／2／3 及 TEST-M4-3-01 結案 |
| M4-3 Automated Verification | 223/223 PASS；ESLint PASS；Production Build PASS | 本機 TEST-M4-3-01 證據；Repository CI Run `44500720991` 對應 `4043459cfa3cb884aa9d9a6653ed646ef59975a9`，Gameplay CI Run `44496931887` 對應 `6052c6197588b00c8732f34b7dbda0a3dc696a25` |
| M4-3 Product Owner Browser Acceptance | PASS（2026-11-19） | 已確認 M4-3 gameplay acceptance；既有特殊戰術、Console Abort Fixture、長時間／特殊 Death Scenario 的個別 NOT VERIFIED 狀態不因此改寫 |
| M4-3 Patch 1 | IMPLEMENTED — INCLUDED IN FORMAL CLOSURE | 修正 BUG-M4-3-001／002 的 Controller Phase Ambiguity；新增 MOVE_COMPLETED、Controller Intent 與失效目標重新驗證 |
| M4-3 Patch 2 | IMPLEMENTED — INCLUDED IN FORMAL CLOSURE | 修正 BUG-M4-3-003 Animation Clock Race；有效 Attack 的首個 Frame 初始化 matching Clock |
| M4-3 Patch 3 | IMPLEMENTED — INCLUDED IN FORMAL CLOSURE | AI Gateway Capability、Enemy Pre-impact Abort Contract、Animation Lifecycle Hardening；Review findings 已 CLOSED |
| M4-3 Gameplay Commit / CI | Git Push SUCCESS；GitHub CI SUCCESS | Gameplay Commit `6052c6197588b00c8732f34b7dbda0a3dc696a25`；Run `44496931887` SUCCESS；最新 Repository Commit／CI 見目前基準表 |
| M4-3 Formal Review | Architecture Review APPROVED；Code Review APPROVED；Formal Closure APPROVED | M4-3 已正式結案；TEST-M4-3-01 與 CR-M4-3-01／02／03 均 CLOSED |
| M4-4A Patch 1 Starting Baseline | 239/239 PASS；ESLint PASS；Build PASS | Patch 開始前重跑；當時 HEAD `11b1652d1702376d703da8eed4cb83586e23401e`；當時保留未提交 M4-4A 異動，後續已納入 `1cce94613791548cc1717942b72d1513487db857` |
| M4-4A Patch 1 Automated Tests | 246/246 PASS | `npm test`；保留原 239 項測試意圖並新增 7 個測試；涵蓋 nested config、Outcome Trigger Boundary、Attack Reservation、configured session progression 與 Victory／Defeat React lifecycle |
| M4-4A Patch 1 ESLint / Production Build | PASS / PASS | `npm run lint`、`npm run build`；Build 保留既有 >500 kB Battle Chunk warning |
| M4-4A Final Review Correction | PASS | `npm test` 246/246、Lint PASS、Build PASS、Diff Check PASS；補足 Win／Loss ALL 全 false assertions，不新增 Test Case、不修改 Runtime Source Code |
| M4-4A React Integration Tests | 12/12 PASS | `tests/battle.animation.react.integration.test.mjs`；Formal Closure baseline |
| M4-4A Acceptance / Traceability | PASS | AC 32/32；Revision 2 Test Traceability 28/28；Patch Test Traceability 9/9；Formal Closure baseline |
| Verified GitHub Commit / Actions | PASS | Formal Closure 當時 Repository Commit `5048fea90ae7f81e2367e23ab42485d176fe8483`／Run `44595045755`；Formal Closure 文件後續納入 `41b43c77e849276847c8c643deedd3a7ca0b0747`／Run `44596893220` SUCCESS；Feature Commit `1cce94613791548cc1717942b72d1513487db857` |
| M4-4A Agent Browser Verification (pre-P1) | PARTIAL | 真實 Browser 載入 Battle Scene，操作模式／待命及多輪 AI 回合流程；未能確認一次成功移動或攻擊。原 BV-A02～A05 未驗證 |
| M4-4A Product Owner Browser Acceptance (pre-P1) | PASS（2026-11-19；BV-A01～A05 5/5） | 依 Product Owner 提供的驗收結果記錄；屬 Patch 1 前證據，不代表本次 Runtime 變更已重驗 |
| M4-4A Agent Browser Regression (post-P1) | PARTIAL | BV-A01 部分重驗：確認移動、攻擊模式、待命與 PAS；未完成有效攻擊。BV-A02～A05 尚未重驗；Product Owner Post-Patch Acceptance 見下列正式驗收紀錄 |
| M4-4A Patch 1 Product Owner Acceptance | PASS — 5/5（2026-11-20） | BV-A01～A05 Post-Patch Browser Regression；Product Owner Acceptance Approved |
| M4-4A Review / Acceptance | COMPLETED — FORMALLY ACCEPTED | Architecture Review、Independent Code Review、Product Owner Acceptance 與 Formal Closure 均 APPROVED |
| M4-4B Starting Baseline | `main` @ `41b43c77e849276847c8c643deedd3a7ca0b0747`；Actions Run `44596893220` SUCCESS | M4-4B 開始基準；CI 不涵蓋其後本機未提交異動 |
| M4-4B Automated Tests | 265/265 PASS | 本機 `npm test`；原有 246 項意圖保留，新增 19 項測試 |
| M4-4B React / Session Integration | 31/31 PASS（29 React + 2 Session） | `tests/battle.animation.react.integration.test.mjs` 與 `tests/battle.session.test.mjs` |
| M4-4B ESLint / Production Build | PASS / PASS | `npm run lint`、`npm run build`；保留既有 >500 kB Battle Chunk warning |
| M4-4B Browser Verification | PARTIAL | Battle Route 可載入，但頁面顯示 WebGL fallback；無法操作 3D 戰鬥及完成 Overlay／Restart Browser Regression |
| M4-4B Product Owner Acceptance / Independent Review | PENDING | 未宣告 Browser Acceptance、Independent Review 或 Formal Acceptance |

## M4-4A Acceptance Criteria Evidence Matrix

| AC | 結果 | 實作／查證證據 | 限制 |
|---|---|---|---|
| AC-A01 獨立 end-conditions 目錄 | PASS | `src/game/end-conditions/`；Source tree | — |
| AC-A02 win／loss 子目錄 | PASS | `src/game/end-conditions/win/`、`loss/` | — |
| AC-A03 EndCondition Interface | PASS | `end-condition.interface.ts`；Strategy tests | — |
| AC-A04 Abstract Condition Manager | PASS | `abstract-end-condition.ts`；ANY／ALL 與設定測試 | — |
| AC-A05 WinCondition | PASS | `win-condition.ts`；manager tests | — |
| AC-A06 LossCondition | PASS | `loss-condition.ts`；manager tests | — |
| AC-A07 ANY 判定 | PASS | `tests/end-conditions.test.mjs`；single true／false、ANY all-true／all-false／mixed truth table | — |
| AC-A08 ALL 判定 | PASS | `tests/end-conditions.test.mjs`；ALL all-true／all-false／mixed truth table | — |
| AC-A09 配置驗證及不可變集合 | PASS | empty／invalid mode／contract tests；test-only nested Strategy schema snapshot 與巢狀 freeze assertions | Runtime 不提供任意物件通用深層 Freeze；Concrete Strategy 作者負責設定快照契約 |
| AC-A10 Win AllDead | PASS | `win/all-dead.ts`；faction elimination tests | — |
| AC-A11 Loss AllDead | PASS | `loss/all-dead.ts`；faction elimination tests | — |
| AC-A12 正常死亡語意 | PASS | context tests；DYING、正式 DefeatedUnitRecord、空陣營與缺失紀錄 cases | — |
| AC-A13 Production Scene 明確初始化 | PASS | `useBattleMovement.ts`；明確建立 Win／Loss Condition | — |
| AC-A14 Dependency Injection | PASS | `battle.session.ts`；test-only parameterized Strategy 注入 Reducer 測試 | — |
| AC-A15 Reducer 無 Concrete Condition 分支 | PASS | `battle.state.ts` 僅使用 Manager／Resolver；source inspection | — |
| AC-A16 Test-only Condition 可擴充 | PASS | 不同 Constructor 參數的 `MinimumRosterWin` 與 Nested Configuration Strategy 透過注入 Reducer 評估；不改 Reducer | — |
| AC-A17 Victory Resolution | PASS | `tests/end-conditions.test.mjs`；Death Barrier 後 Outcome VICTORY | — |
| AC-A18 Defeat Resolution | PASS | `tests/end-conditions.test.mjs`；最後玩家死亡後 Outcome DEFEAT | — |
| AC-A19 DEFEAT_PRIORITY | PASS | same-context simultaneous Win／Loss test | — |
| AC-A20 Attack／Death／Move Barriers | PASS | 單獨 Attack Motion／Combat Reservation、Move Motion、Death Motion 與 multi-Death barrier assertions | — |
| AC-A21 Pending Turn Completion | PASS | test verifies Outcome before PAS; Pending cleared without extra Turn | — |
| AC-A22 Terminal Action Guard | PASS | terminal action test covers selection、move、mode、standby、undo、attack、impact queue | — |
| AC-A23 AI Terminal Guard | PASS | 直接驗證 `getAIControllerIntent(terminalState) === null`，並驗證 Reducer 拒絕已授權但晚到的 AI Action | — |
| AC-A24 Late Callback 不影響終局 | PASS | VICTORY 與 DEFEAT 均重播 Attack／Death／Move callbacks，Reducer 回傳相同 terminal State | — |
| AC-A25 既有 223 項測試無退化 | PASS | `npm test` 246/246；相較 239 項 Patch 基線新增 7 項，保留先前測試意圖 | Patch 觸及部分既有 Outcome assertions，已改為合法 Trigger 並加強拒絕邊界 |
| AC-A26 新增測試全部 PASS | PASS | End Condition 與 React Outcome Integration 測試均通過；完整 suite 246/246 | — |
| AC-A27 ESLint | PASS | `npm run lint` | — |
| AC-A28 Production Build | PASS | `npm run build` | Existing >500 kB Battle Chunk warning remains |
| AC-A29 Git Diff Check | PASS | `git -c core.whitespace=cr-at-eol diff --check` 與未追蹤檔案 whitespace inspection；尊重 Repository 的 CRLF 行尾 | Final Review Correction 工作樹未提交／推送 |
| AC-A30 持久化文件同步 | PASS | README、Development Status、Roadmap、Architecture、Combat System、Game Design、Changelog 已同步 Formal Closure；TD-018／019／021 與 UX Backlog 狀態未變更 | Formal Closure 文件後續納入 `41b43c7` |
| AC-A31 無未授權 Scope Expansion | PASS | 本次僅修改文件；無 Runtime Source Code 或 Test Source Code 異動，未實作 Overlay／Restart／Session Isolation／Save-Load／Round Limit | Agent Browser 舊結果保留為歷史；新的 5/5 PASS 為 Product Owner Acceptance |
| AC-A32 無 Circular Runtime Dependency | PASS | TypeScript Production Build；Battle Core imports Condition Contracts／Resolver, not concrete AllDead modules | — |

## M4-4A Browser Evidence

| BV | Agent Browser Verification (pre-P1) | Product Owner Acceptance (2026-11-19, pre-P1) | Agent Browser Regression (post-P1) | Product Owner Acceptance (2026-11-20, post-P1) |
|---|---|---|---|---|
| BV-A01 Normal Battle Regression | PARTIAL | PASS | PARTIAL — moved Assassin successfully; Attack Mode showed 0 legal targets; Standby advanced to Player Turn 2 | PASS |
| BV-A02 Victory Terminal State | NOT VERIFIED | PASS | NOT VERIFIED | PASS |
| BV-A03 Defeat Terminal State | NOT VERIFIED | PASS | NOT VERIFIED | PASS |
| BV-A04 Death Barrier Visual Regression | NOT VERIFIED | PASS | NOT VERIFIED | PASS |
| BV-A05 Terminal Interaction | NOT VERIFIED | PASS | NOT VERIFIED | PASS |

Product Owner 於 2026-11-20 完成 M4-4A Patch 1 Post-Patch Browser Regression，BV-A01～A05 為 5/5 PASS — ACCEPTED。2026-11-19 Patch 前 Product Owner Acceptance 及 Agent 原有 PARTIAL／NOT VERIFIED 結果均保留為獨立歷史證據；未將 Agent 未完成的 Browser Verification 改寫為 PASS。Node／React Integration 測試不替代上述 Product Owner Browser Acceptance。

## M4-4A Review Finding Resolution

| Finding | Patch 1 Resolution | Evidence | Status / Closure |
|---|---|---|---|
| CR-M4-4A-01 Configuration Immutability | Runtime shallow freeze 與 Concrete Strategy Author Contract 責任分界；Test-only nested config 使用 schema-specific copy/freeze | `test-only nested configuration strategy snapshots and protects its schema explicitly`；Architecture／Combat System Contract | CLOSED — independent Review APPROVED |
| CR-M4-4A-02 Outcome Evaluation Boundary | 初始化不評估；合法安全觸發才結算；無效／未授權 Action 與 stale callback 不觸發 | `session initialization is ACTIVE and only valid outcome triggers evaluate initial conditions`；stale／unauthorized、Attack Reservation、PAS tests | CLOSED — independent Review APPROVED |
| CR-M4-4A-03 Test Coverage Completion | 補 Win／Loss ALL 全 false assertions；以原 Revision 2 IDs 建立 T-01～T-28 Traceability；Patch 專屬情境另列 P-Txx | Truth table test、下方 traceability matrix；246/246 Automated Tests | CLOSED — Final Correction VERIFIED |
| CR-M4-4A-04 React Outcome Integration | 真實 `AttackAnimationController`、`DeathAnimationController`／`useDeathAnimation`、Session、Configured Reducer、Win／Loss AllDead 覆蓋 Victory／Defeat 與 late callback | `configured Victory waits for React attack and death lifecycle completion without advancing PAS`；`configured Defeat waits for React enemy attack and player death lifecycle completion`；12/12 React Integration Tests | CLOSED — independent Review APPROVED |
| CR-M4-4A-05 Documentation Synchronization | 修正最新 Git／CI、Review 與驗收狀態；保留 Patch 前與 Agent Browser 歷史；記錄 Patch 後 PO Acceptance 及 T／P-T traceability | README、Development Status、Architecture、Combat System、Game Design、Roadmap、Changelog | CLOSED — Formal Closure Documentation VERIFIED |

歷史狀態：Final Review 時 CR-01／02／04 為 APPROVED，CR-03／05 要求修正；Final Correction 後兩項修正均 VERIFIED，Code Review 當時為 APPROVED WITH MINOR CORRECTIONS。依 2026-11-20 Formal Closure Decision，CR-01～05 現已全部 CLOSED，獨立 Code Review 最終狀態 APPROVED。

## M4-4A Formal Closure Record

- **Formal Acceptance Date**：2026-11-20。M4-4A End Condition Framework & Battle Outcome 為 **COMPLETED — FORMALLY ACCEPTED**；Patch 1 為 **COMPLETED — ACCEPTED**；Final Review Correction 為 **COMPLETED — VERIFIED**。
- **Reviews**：Architecture Review APPROVED；Independent Code Review APPROVED；Product Owner Acceptance APPROVED；Formal Closure APPROVED。CR-M4-4A-01～05 全數 CLOSED。
- **Product Owner Browser Acceptance**：M4-4A Patch 1 Post-Patch Browser Regression，BV-A01～A05 5/5 PASS — ACCEPTED（2026-11-20）。Patch 前 Product Owner 5/5 PASS 與 Agent 原始 Browser PARTIAL／NOT VERIFIED 紀錄仍分列保留。
- **Verified Repository / CI**：Branch `main`；M4-4A Formal Closure 文件後續納入 Repository Commit `41b43c77e849276847c8c643deedd3a7ca0b0747`；GitHub Actions Run `44596893220` SUCCESS。M4-4A Feature Commit 為 `1cce94613791548cc1717942b72d1513487db857`；Commit `5048fea...`／Run `44595045755` 保留為 Formal Closure 當時的歷史基準。CI 只涵蓋已提交內容，不取代本機測試。
- **Verification Baseline**：246/246 Automated Tests、12/12 React Integration Tests、AC 32/32、原始 Test Traceability 28/28、Patch Test Traceability 9/9 PASS；Lint、Build、Diff Check PASS。Build 的既有 >500 kB Battle Chunk warning 保留。
- **Architecture Constraints**：Strategy／DI、Configuration Immutability、明確 Battle Session、Initial ACTIVE、Outcome Trigger Boundary、Motion／Reservation Barriers、DEFEAT Priority、Pre-PAS Resolution、Terminal Guards 均維持原契約。Restart Session Isolation、Save／Load Serialization 與 Round Limit Semantics 未實作。
- **Technical Debt / UX Backlog**：本次不調整相關狀態；TD-018、TD-021 維持 OPEN，TD-019 維持 CLOSED — M4-3 FORMAL ACCEPTANCE；UX Backlog 未變更。
- **Roadmap / Scope**：M4-4A 已完成；此 Formal Closure 的文件異動後續已納入 `41b43c7`。目前 M4-4B 為 IMPLEMENTED — PENDING REVIEW，M4-4C PENDING DEVELOPMENT；M4-4 整體仍 IN PROGRESS。M4 維持 75%、Overall 37.5%。

## M4-4B Implementation & Verification — IMPLEMENTED — PENDING REVIEW

### Environment / Baseline

- **Branch / HEAD**：`main`／`41b43c77e849276847c8c643deedd3a7ca0b0747`；`origin/main` tracking ref 相同，工作樹包含本次 M4-4B 未提交異動。
- **Verified baseline CI**：GitHub Actions Run `44596893220` SUCCESS；僅代表開始基準 Commit，不包含本機 M4-4B 修改。
- **Local verification**：`npm test` 265/265 PASS；`npm run lint` PASS；`npm run build` PASS；本次 build 保留既有 >500 kB Battle Chunk warning。`tests/battle.animation.react.integration.test.mjs` 與 `tests/battle.session.test.mjs` 合計 31/31 PASS（29 React Integration + 2 Session tests）。
- **Browser**：Battle Route 載入並顯示初始 HUD／資訊及 WebGL fallback。無法使用 3D 場景完成戰鬥與終局流程；BV-B01、BV-B10 PARTIAL，BV-B02～B09 NOT VERIFIED。測試瀏覽器操作不等於 Product Owner Acceptance；Acceptance PENDING。
- **Final status**：M4-4B 已實作但尚未獨立審查、尚未 Product Owner 驗收，也未 Commit／Push；M4-4C 尚未開始。

### Implementation / Ownership Map

| Requirement | Implementation / Evidence |
|---|---|
| FR-B01～B04、TS-B05～B07 | `src/features/battle/components/BattleResultOverlay.tsx` 與 `.css`；由 `BattleSessionRuntime` 只依 `BattleState.outcome` 顯示共用原生 Modal Dialog，集中勝敗文案、焦點、Escape／背景點擊防護與 reduced-motion 樣式 |
| FR-B05～B10、TS-B02～B04 | `BattleScene.tsx`、`BattleSessionHost.tsx`、`BattleSessionRuntime.tsx`；來源 Generation 驗證、純 State Updater、React `key` Remount、場景 Runtime 所有權 |
| FR-B06、TS-B04 | `battleScenario.ts` 與 `useBattleMovement.ts`；每次 Runtime 以同一 Factory 明確注入 Win／Loss AllDead，重建初始 Session／Reducer |
| FR-B08～B09、TS-B08～B11 | Hook／Controller Callback 閉包保留建立時 Dispatch；Session Probe 對相同 IDs 的跨 Session callback、StrictMode 與 Frame cleanup 測試 |
| FR-B11、TS-B12 | 未更動 Battle Route／Navigation；Session Host 只替換同路由內的 Runtime |

### Runtime Reset Matrix

| 狀態 | Restart 後來源 | Verification |
|---|---|---|
| Unit roster、HP／SP、position、obstacles、initial roster | `createBattleScenarioSession()` → `createBattleSession()` 複製 Scenario 輸入 | Production Scenario sessions equivalent／snapshot isolation tests |
| PAS、Turn Context、Action Economy、Reservation、Outcome、Death Records、Pending Turn、各 ID counter | 新 Session 的正式 `initialState`，不從舊終局 state 回推 | Restart integration deep-equality 與初始 ID assertions |
| Selection、interaction mode、Hover、Last Move／Attack Result、preview、clock refs、controllers | 舊 `BattleSessionRuntime` 卸載，新 Keyed Runtime 掛載 | 同 ID callback isolation 與 Frame cleanup tests |
| AI State／Dispatch | 舊 Hook 綁定舊 Dispatch，新 Runtime 重新掛載並依新 State 計算 | AI／Player stale callback tests、StrictMode test；`useBattleAI` 無 Timer |
| Canvas、Camera、OrbitControls | 隨 Runtime Remount 卸載／重建 | Browser WebGL fallback 阻止實際畫面／GPU lifecycle 驗證；不以 DOM 數量推論 GPU 資源釋放 |

### B-T01～B-T30 Test Traceability

Test files：[`battle.animation.react.integration.test.mjs`](../tests/battle.animation.react.integration.test.mjs)、[`battle.session.test.mjs`](../tests/battle.session.test.mjs)。Assertion 欄描述測試實際檢查；PARTIAL 項目限制明列，不以來源閱讀替代缺少的整合驗證。

| ID | Test Name | Assertion Evidence | Coverage |
|---|---|---|---|
| B-T01 | `ACTIVE BattleState does not render a result dialog` | `outcome === null` 且沒有 `dialog` | PASS |
| B-T02 | `Victory presentation waits for death completion and exposes the configured result copy` | VICTORY、標題／描述／Restart 文案、aria 關聯及初始 Focus | PASS |
| B-T03 | `Defeat presentation follows the configured enemy attack and death lifecycle` | DEFEAT 標題／描述、暗紅樣式與正式 Attack／Death lifecycle | PASS |
| B-T04 | `reachVictory`／`reachDefeat`（由 Victory／Defeat presentation tests 呼叫） | Impact 後仍無 Outcome／dialog；Death Motion 完成後才提交終局並顯示 dialog | PASS |
| B-T05 | `Victory restart remounts a fresh Session without changing the route or mutating the old outcome` | 點擊正式 Restart Button 後 Generation 遞增、新 Session 建立、舊 Outcome 不變 | PASS |
| B-T06 | `Result dialog prevents Escape and backdrop dismissal while retaining keyboard focus` | jsdom shim 驗證初始 Focus、cancel preventDefault、dialog click 不關閉；未驗真實 Tab Trap／背景 Pointer | PARTIAL |
| B-T07 | `Victory restart remounts a fresh Session without changing the route or mutating the old outcome` | Victory 後 Session、Reducer、Dispatch 不同且 State 等於正式 Initial State | PASS |
| B-T08 | `Defeat restart restores the same initial roster and clears terminal presentation` | Defeat 後 Outcome／dialog 清除，初始 roster 與 ID 恢復 | PASS |
| B-T09 | `production scenario sessions initialize equivalent ACTIVE states with independent reducers and snapshots` | 新舊 Factory Session initial state 深度相等但 State、Reducer、Unit／Obstacle／Turn snapshots 不共用 | PASS |
| B-T10 | 同 B-T09；Victory restart test | Session Reducer、Dispatch 和新舊 State reference 獨立 | PASS |
| B-T11 | `changing one runtime snapshot cannot alter the Scenario source or a restarted session` | 修改舊 Runtime 的 Unit／Obstacle／PAS snapshot，不影響 Scenario constants 或新 Session | PASS |
| B-T12 | Victory restart test | 舊 `previousSessionState.outcome` 保持 VICTORY，新 Session 為 ACTIVE | PASS |
| B-T13 | `a same-generation Restart request succeeds once and stale handlers cannot restart the new Session` | 同 Generation 重複呼叫只遞增一次 | PASS |
| B-T14 | 同 B-T13 | 新 Generation 建立後重播舊 Handler 不再變更 Host／Session | PASS |
| B-T15 | `three completed victories and restarts create fresh, equivalent battle sessions` | 連續三次完成 Attack／Death／VICTORY，再由正式 Restart 重建新 Session；每次檢查 Generation、Initial State 及前一 Outcome | PASS |
| B-T16 | `same-ID old Move finish and cancel callbacks cannot complete a new Session motion` | 新舊 Motion／Unit／Turn IDs 相同，舊 Finish／Cancel 不改新 Motion | PASS |
| B-T17 | `same-ID old Attack impact, completion, and abort callbacks cannot alter a new attack` | Attack／Turn／Attacker IDs 相同；舊 Impact 不扣新目標 HP、不清除新 Attack | PASS |
| B-T18 | 同 B-T17 | 舊 Complete／Abort 不改新 Attack Motion | PASS |
| B-T19 | `same-ID old Death complete and abort callbacks cannot remove a new Session death motion` | Death／Unit／Attack IDs 相同；舊 Complete／Abort 不移除新 Death Motion | PASS |
| B-T20 | `same-ID old Impact consumption cannot clear a new Session confirmed impact` | Impact／Attack IDs 相同；舊 Consume 不清除新 Confirmed Impact | PASS |
| B-T21 | `same-turn old AI Gateway callback and signed action stay bound to the old Session dispatch` | 舊 AI Gateway callback／signed Action 不建立或修改新 Session Attack | PASS |
| B-T22 | `same-turn old Player action callback cannot advance the new Session PAS` | 舊 Player Standby callback 不改新 Session 的 Turn／Active Unit | PASS |
| B-T23 | B-T16～B-T20 | 每類舊／新 Session 的 Unit／Turn／Lifecycle IDs 明確相同後才重播舊 Callback | PASS |
| B-T24 | `Production BattleScene remounts its keyed runtime when the Session Host accepts restart` | 真實 Production `BattleScene`／`BattleSessionHost`；僅替換 Runtime leaf probe；有效 Restart 後 generation 0 Runtime cleanup、generation 1 Runtime mount | PASS |
| B-T25 | `Session remount and unmount clean old controller Frame subscriptions` | Remount 後舊 cleanup 增加且活躍 callback 數為 1；Unmount 後為 0 | PASS |
| B-T26 | `StrictMode remount keeps a single effective AI attack and one active Frame subscription` | StrictMode Remount 後 AI Attack 只有效一次；舊 AI callback 不改新 Session；`useBattleAI` 為同步 Effect，沒有 Timer | PASS |
| B-T27 | 同 B-T26 | StrictMode 下 Attack ID／counter 與 Frame Subscription 均單一有效 | PASS |
| B-T28 | Victory presentation test + Victory restart test | 正式 Reducer／AllDead Session 經 Attack／Death Barrier 進入 VICTORY、顯示 Overlay、Restart 到新 ACTIVE Session | PASS |
| B-T29 | Defeat presentation test + Defeat restart test | AI 敵方 Attack／Death Barrier 進入 DEFEAT、顯示 Overlay、Restart 還原 roster | PASS |
| B-T30 | `Session remount and unmount clean old controller Frame subscriptions`；既有 `unmount aborts pending attack once, removes its frame callback, and remount is clean` | 測試 harness cleanup callback、Frame subscription 與 pending attack；未掛載整個 Production Route／Canvas Runtime | PARTIAL |

### AC-B01～AC-B37 Verification Matrix

| AC | Result | Evidence / Limitation |
|---|---|---|
| AC-B01 ACTIVE 不顯示 Overlay | PASS | B-T01 |
| AC-B02 VICTORY UI 正確 | PASS | B-T02 |
| AC-B03 DEFEAT UI 正確 | PASS | B-T03 |
| AC-B04 共用 Result Overlay Component | PASS | Production Runtime 同一 `BattleResultOverlay` 接收兩種正式 Outcome |
| AC-B05 僅依據正式 Outcome 顯示 | PASS | Runtime 以 `outcome !== null` 條件 render；B-T01～04 |
| AC-B06 背景戰場保留 | PASS | Runtime 中 Canvas 與 Overlay 同屬場景；Overlay 不替換 Battle Runtime |
| AC-B07 終局背景操作隔離 | PARTIAL | 原生 `showModal()` 與 Reducer Terminal Guard；未能在 Browser 實際操作終局背景 |
| AC-B08 Modal Keyboard／Focus | PARTIAL | jsdom 驗 Focus／Cancel；真實 Tab／Escape／背景焦點需 Browser Regression |
| AC-B09 Desktop／Mobile 版面 | PARTIAL | 有響應式 CSS／reduced-motion；Overlay 未能於 Browser 顯示以驗證視覺 |
| AC-B10 Victory Restart | PASS | B-T07 |
| AC-B11 Defeat Restart | PASS | B-T08 |
| AC-B12 不 Reload Page | PASS | Restart 只更新 Host Generation，未呼叫 location reload；integration Remount |
| AC-B13 Battle Route 不變 | PASS | Host 只重建同頁 Runtime，無 route/navigation 變更 |
| AC-B14 Keyed Session Remount | PASS | `BattleScene` 將 generation 作 Runtime key；Host Remount integration |
| AC-B15 初始 State 等價 | PASS | Production Scenario initial state deep equality |
| AC-B16 Win／Loss Configuration 恢復 | PASS | Scenario Factory 每次建立 Win／Loss AllDead 並建立新 Session |
| AC-B17 PAS／Action Economy 恢復 | PASS | Restart 新 State 等於 Initial State，含 Turn／Action fields |
| AC-B18 Death／Combat State 清除 | PASS | Restart State 等於 Initial State，死亡與 Reservation 初始清空 |
| AC-B19 Animation／Transient UI Reset | PASS | Keyed Runtime Remount；同 ID callbacks 與 Frame cleanup tests |
| AC-B20 舊 Move Callback 隔離 | PASS | B-T16 |
| AC-B21 舊 Attack Callback 隔離 | PASS | B-T17～18 |
| AC-B22 舊 Death Callback 隔離 | PASS | B-T19 |
| AC-B23 舊 Impact Callback 隔離 | PASS | B-T20 |
| AC-B24 舊 AI Action 隔離 | PASS | B-T21、B-T26 |
| AC-B25 舊 Player Action 隔離 | PASS | B-T22 |
| AC-B26 ID Collision | PASS | B-T16～20／23 使用實際相同 IDs |
| AC-B27 Restart Idempotency | PASS | B-T13 |
| AC-B28 Stale Restart Handler 拒絕 | PASS | B-T14 |
| AC-B29 React StrictMode | PASS | B-T26～27 |
| AC-B30 Controller／Effect Cleanup | PARTIAL | Frame cleanup PASS；整個 Production Route／WebGL／GPU lifecycle 未實際驗證 |
| AC-B31 原有 246 測試無退化 | PASS | Full suite 265/265；原有 integration assertions 保留 |
| AC-B32 新增測試全部 PASS | PASS | Full suite 265/265；Session／React focused 31/31 |
| AC-B33 ESLint | PASS | `npm run lint` |
| AC-B34 Production Build | PASS | `npm run build` |
| AC-B35 Git Diff Check | PASS | `git -c core.whitespace=cr-at-eol diff --check` 與 untracked whitespace inspection |
| AC-B36 持久化文件同步 | PASS | README、Status、Architecture、Combat、Game Design、Roadmap、Changelog |
| AC-B37 Scope Compliance | PASS | 無 M4-4C／M5、EXP／Gold／Loot／Save-Load、新依賴或未授權 Core 設計變更；無 Commit／Push |

### BV-B01～BV-B10 Browser Verification

| BV | Result | Browser Evidence / Remaining Work |
|---|---|---|
| BV-B01 Normal Battle | PARTIAL | 實際 `#battle` Route 載入，顯示初始 Turn／Timeline／戰場資訊與操作按鈕；Canvas fallback 顯示「無法啟用 WebGL」，未完成合法移動、攻擊或 AI 交戰 |
| BV-B02 Victory Overlay | NOT VERIFIED | 無法透過 3D 戰鬥擊敗敵方並驗證動畫 Barrier 後的 Overlay |
| BV-B03 Defeat Overlay | NOT VERIFIED | 未能執行完整敵方擊敗我方流程 |
| BV-B04 Victory Restart | NOT VERIFIED | Browser 未到達 VICTORY，無法點擊後重驗初始配置 |
| BV-B05 Defeat Restart | NOT VERIFIED | Browser 未到達 DEFEAT |
| BV-B06 Terminal Input Protection | NOT VERIFIED | 未能於 Browser 顯示終局 Modal；jsdom assertions 不替代此項 |
| BV-B07 Repeated Restart | NOT VERIFIED | Browser 未能進入結果畫面；三次 Remount 僅由 Node／jsdom integration 驗證 |
| BV-B08 Rapid Restart Input | NOT VERIFIED | Browser 未能進入結果畫面；同來源重複 Handler 由 integration test 驗證 |
| BV-B09 Responsive Layout | NOT VERIFIED | Overlay 未能於 Desktop／Mobile 實際顯示；CSS 不代表視覺驗收 |
| BV-B10 Runtime Regression | PARTIAL | Browser reload 僅觀察 Vite／React DevTools 訊息，未見 pageerror；WebGL fallback 持續存在，無法驗證終局／Restart lifecycle 或底層 GPU cleanup |

實際 Browser Screenshot 顯示 Battle Route 背景與 HUD，但沒有 3D 棋盤／單位；DOM 另顯示 Canvas WebGL fallback。未據 Node／jsdom 證據宣稱視覺 PASS。Product Owner Acceptance 尚待正式結果。

## M4-4 Revision 2 Test Traceability

以下保留 Revision 2 的原始 T-01～T-28 定義與編號；Patch 1 額外補強項目另以 P-Txx 編號，不重定義原始 Test ID。除 T-28 與明確列出其他檔案者外，所列測試均位於 `tests/end-conditions.test.mjs`；Test Name 為實際名稱，Assertion 摘述該測試直接檢查的結果。

| ID | Revision 2 Scenario | Test file / name | Assertion Evidence | Result |
|---|---|---|---|---|
| T-01 | Single Condition | `tests/end-conditions.test.mjs` — `Win and loss managers cover single, ANY, ALL, and default ANY truth tables` | Win／Loss 單一 true 與 false 均回傳對應 Boolean | PASS |
| T-02 | ANY Composition | 同上 | Win／Loss ANY 的 all-false、mixed、all-true 結果均驗證 | PASS |
| T-03 | ALL Composition | 同上 | Win／Loss ALL 的 all-false、mixed、all-true 結果均驗證；本次補足兩個 all-false assertions | PASS — 本次修正 |
| T-04 | Default Mode | 同上 | 未指定 Mode 的 mixed 條件回傳 true，證明預設 ANY | PASS |
| T-05 | Configuration Validation | `condition configuration rejects empty arrays, invalid modes, and invalid strategies` | Win／Loss 空集合、錯誤 Mode、錯誤契約與非 Boolean 結果均拒絕 | PASS |
| T-06 | Collection Immutability | `manager snapshots its input collection and freezes injected strategies` | 初始化後修改來源 Array，不改變 Manager 結果；Strategy instance 為 frozen | PASS |
| T-07 | Parameterized Strategy | `test-only parameterized strategies preserve constructor-specific behavior in the injected reducer` | Constructor 參數 2 與 3 導致同一測試條件分別得到 VICTORY 與 ACTIVE | PASS |
| T-08 | Strategy Dependency Injection | 同上；`condition strategy category prevents configuring loss rules as victory rules` | 兩種自訂 Strategy 經 Battle Session 注入正式 Reducer；無須修改 Reducer；錯誤勝敗類別拒絕 | PASS |
| T-09 | Win AllDead | `faction elimination requires an initial roster and formal defeated records`；`production session starts ACTIVE and resolves victory only after all death barriers finish` | 活著／DYING 敵方未全滅；正式 Defeated Record 後成立並解析 VICTORY | PASS |
| T-10 | Loss AllDead | `defeat resolves after the final player death without advancing PAS` | 最後玩家正式死亡後結果為 DEFEAT；存活玩家情境不成立 | PASS |
| T-11 | Dying Unit | `faction elimination requires an initial roster and formal defeated records` | HP=0 且仍有 Death Motion 的單位為 DYING，`isFactionEliminated` 為 false | PASS |
| T-12 | Empty Faction | `empty factions and initially incapacitated units do not satisfy AllDead` | 缺少指定陣營初始單位時，Win／Loss AllDead 均為 false | PASS |
| T-13 | Defeated Record Integrity | `faction elimination requires an initial roster and formal defeated records` | Active Unit 消失但無正式死亡紀錄時不視為死亡；正式記錄後才為 DEAD | PASS |
| T-14 | Victory Resolution | `production session starts ACTIVE and resolves victory only after all death barriers finish` | Death Complete 後 Outcome=VICTORY；Pending 清除且 Turn ID 不變 | PASS |
| T-15 | Defeat Resolution | `defeat resolves after the final player death without advancing PAS` | 最後玩家 Death Complete 後 Outcome=DEFEAT；Pending 清除且 Turn ID 不變 | PASS |
| T-16 | Simultaneous Conditions | `simultaneous victory and defeat evaluate the same snapshot with defeat priority` | Win／Loss 共用同一 Context；同時 true 時結果 DEFEAT | PASS |
| T-17 | Attack Completion Barrier | `a lone Attack Motion and Combat Reservation block outcome until valid completion` | 單獨 Attack Motion 存續期間（含 Impact 後）Outcome 仍 null、無評估；合法 Attack Complete 後才結算 | PASS |
| T-18 | Death Completion Barrier | `tests/end-conditions.test.mjs` — `production session starts ACTIVE and resolves victory only after all death barriers finish`; `tests/battle.animation.react.integration.test.mjs` — `configured Victory waits for React attack and death lifecycle completion without advancing PAS`; `configured Defeat waits for React enemy attack and player death lifecycle completion` | Impact／Attack Complete 後死亡流程未完成時仍 ACTIVE；Death Complete 後才提交終局 | PASS |
| T-19 | Death Abort Resolution | `Death Abort completes the death barrier and can resolve victory` | 合法 Death Abort 清除 barrier、建立 Defeated Record 並解析 VICTORY | PASS |
| T-20 | Multiple Death Motions | `multiple death motions must all finish before terminal resolution` | 第一個 Death Complete 後仍 ACTIVE；最後一個完成後才 VICTORY | PASS |
| T-21 | Pending Turn Completion | `outcome is checked before turn completion schedules the next PAS unit`；Victory／Defeat resolution tests | 終局先於 PAS；Pending 清除、Turn ID 不前進、無額外排程 | PASS |
| T-22 | Terminal Player Actions | `terminal outcome blocks player actions, AI intents, and all late lifecycle callbacks` | 終局後 Select、Cell、Clear、Mode、Standby、Undo、Attack 等均回傳原 Terminal State | PASS |
| T-23 | Terminal AI Actions | `terminal outcome blocks player actions, AI intents, and all late lifecycle callbacks` | Terminal State 的 `getAIControllerIntent()` 為 null；晚到／未授權 AI Action 不改變 State | PASS |
| T-24 | Late Lifecycle Callbacks | `terminal outcome blocks player actions, AI intents, and all late lifecycle callbacks`; `VICTORY and DEFEAT both reject late events without changing their terminal result` | Move／Attack／Death／Impact callbacks 在終局後回傳原 State | PASS |
| T-25 | Terminal Outcome Immutability | `VICTORY and DEFEAT both reject late events without changing their terminal result` | 對 VICTORY 與 DEFEAT 分別重播晚到事件，結果保持原終局值 | PASS |
| T-26 | Non-terminal Regression | `configured AllDead session supports movement, attack, standby, and PAS advancement while active` | 非終局時移動、攻擊、Standby 與 PAS 皆正常推進，Outcome 保持 null | PASS |
| T-27 | Initial State Policy | `session initialization is ACTIVE and only valid outcome triggers evaluate initial conditions`；`configured AllDead session supports movement, attack, standby, and PAS advancement while active` | 正常 Production Session 初始 ACTIVE；不由任意無效操作觸發初始條件 | PASS |
| T-28 | React Integration Regression | `tests/battle.animation.react.integration.test.mjs` — 10 項既有 TEST-M4-3-01 tests（名稱見下）；新增 `configured Victory waits for React attack and death lifecycle completion without advancing PAS` 與 `configured Defeat waits for React enemy attack and player death lifecycle completion` | 原 10 項真實 Controller Integration 覆蓋保留；正式 Session／Reducer 下 React Callback 驗證 Impact、Attack Complete、Death Complete 與 Outcome | PASS |

T-28 保留的 10 個 TEST-M4-3-01 Test Names（對照 `tests/battle.animation.react.integration.test.mjs` 的上一個 commit 與目前檔案）：

1. `React StrictMode mounts the controller, replays effects, and registers one frame callback`
2. `controlled frame deltas keep HP unchanged before impact and dispatch reducer events at their boundaries`
3. `a single large frame dispatches impact before completion exactly once`
4. `a React prop transition resets the clock and isolates consecutive player and enemy attack IDs`
5. `a mismatched clock Attack ID aborts only the current reservation without impact`
6. `pre-impact frame abort dispatches once without HP damage or ending the player turn`
7. `enemy pre-impact abort callback preserves the death-motion barrier until it resolves`
8. `post-impact abort preserves reducer-confirmed damage and advances the player turn`
9. `lethal same-frame impact and completion preserve the death-motion turn barrier`
10. `unmount aborts pending attack once, removes its frame callback, and remount is clean`

### Patch 1 Additional Scenarios

| ID | Additional Scenario | Test file / name | Assertion Evidence | Result |
|---|---|---|---|---|
| P-T01 | Nested Configuration Immutability | `test-only nested configuration strategy snapshots and protects its schema explicitly` | 修改外部設定不改變判定；巢狀設定快照、巢狀 Freeze 與寫入拒絕均有 Assertion | PASS |
| P-T02 | Invalid／Unauthorized Action Outcome Boundary | `session initialization is ACTIVE and only valid outcome triggers evaluate initial conditions` | 過期玩家 Action、無效 Confirm 與未授權 AI Action 回傳同一 State，且 Win／Loss evaluation count 不增加 | PASS |
| P-T03 | Stale Callback Outcome Boundary | `session initialization is ACTIVE and only valid outcome triggers evaluate initial conditions` | 過期 Move Finish 回傳同一 State，且不觸發 Win／Loss evaluation | PASS |
| P-T04 | Initial Condition Evaluation | `session initialization is ACTIVE and only valid outcome triggers evaluate initial conditions` | Session 初始化不評估；首個有效 Standby 安全觸發後才解析初始成立條件 | PASS |
| P-T05 | Combat Reservation Barrier | `a lone Attack Motion and Combat Reservation block outcome until valid completion` | Confirm 時 Reservation 與 Attack Motion 存續期間阻擋 Outcome；Impact 後 Attack Motion 未完成前仍不評估 | PASS |
| P-T06 | Direct AI Gateway Terminal Guard | `terminal outcome blocks player actions, AI intents, and all late lifecycle callbacks` | 直接呼叫 `getAIControllerIntent(terminal)` 得到 null；Reducer 同時拒絕晚到 AI Action | PASS |
| P-T07 | Configured Session Non-terminal Progression | `configured AllDead session supports movement, attack, standby, and PAS advancement while active` | 正式 AllDead 配置下移動／攻擊／待命／PAS 運作，無錯誤終局 | PASS |
| P-T08 | React Victory Outcome Lifecycle | `configured Victory waits for React attack and death lifecycle completion without advancing PAS` | 真實 Attack／Death Controller callback 經 Session Reducer：Impact 與 Attack Complete 後仍 ACTIVE；Death Complete 才 VICTORY；不推進 PAS，晚到 callback 無效 | PASS |
| P-T09 | React Defeat Outcome Lifecycle | `configured Defeat waits for React enemy attack and player death lifecycle completion` | 正式 AI Attack／Death lifecycle 後才 DEFEAT；不額外推進 PAS；晚到 Abort 不改結果 | PASS |

## M4-3 Formal Closure Record

- **Original Scope**：實作確定性 Enemy AI，依 Direct Attack、Move-to-Attack、Path-cost Approach、Standby 順序決策；沿用既有 Reducer、戰鬥規則、動畫生命週期與 PAS Turn Completion，不包含 M4-4 勝敗結果。
- **Patch 1 — Controller Phase Fix**：修正 Direct Attack Intent 與 `MOVE_COMPLETED`／Move-to-Attack 銜接，包含失效目標重新驗證。
- **Patch 2 — Attack Clock Race Fix**：有效 Attack 的首個 Frame 初始化 matching Attack ID 的 0ms Clock，避免 Clock 尚未由 Effect 建立時誤 Abort。
- **Patch 3 — Lifecycle Hardening**：透過 AI Gateway 與 private WeakSet Action Identity 授權 AI Actions；Reducer 保留授權重驗證；修正 Enemy Pre-impact Abort Turn Completion，並共用 React／Frame Lifecycle Runtime。
- **TEST-M4-3-01 — CLOSED — PASS**：10 項 ReactDOM／StrictMode 整合測試實際掛載 Controller；受控 Frame 驅動正式 Lifecycle Runtime，Impact／Complete／Abort callbacks 派送至正式 Reducer。AC-01～AC-20 證據矩陣及測試邊界見本文件上方。
- **Product Owner Browser Acceptance — PASS**：2026-11-19，M4-3 gameplay acceptance。
- **Architecture Review — APPROVED；Code Review — APPROVED**：CR-M4-3-01、CR-M4-3-02、CR-M4-3-03 均 CLOSED。
- **Git / CI**：Repository baseline `4043459cfa3cb884aa9d9a6653ed646ef59975a9`；GitHub Actions Run `44500720991` SUCCESS，Head SHA 相符。M4-3 gameplay commit 為 `6052c6197588b00c8732f34b7dbda0a3dc696a25`。
- **Automated Verification**：223/223 Tests PASS、ESLint PASS、Production Build PASS。Build 保留既有 Battle Chunk >500 kB warning。
- **Remaining Non-blocking Risks**：整合測試使用 Node + jsdom；Frame Scheduler 為受控測試替身，Visual Components 為 stub。未涵蓋 WebGL Rendering／完整 E2E；既有特殊 Browser Scenarios 維持各自驗證狀態。其他技術債依 [TECHNICAL_DEBT.md](./TECHNICAL_DEBT.md) 追蹤。
- **Formal Closure Decision**：**APPROVED**。M4-3 標記 **COMPLETED — FORMALLY ACCEPTED**；M4-4 為 **NEXT — PENDING DEVELOPMENT**；M4 75%、Overall 37.5%。

## M4-3 Patch 2

> Patch 2 當時的測試與功能驗證快照；目前正式結案及最新 223/223 測試基準見上方「M4-3 Formal Closure Record」。

- **BUG-M4-3-003 Root Cause**：`AttackAnimationController` 將「clockRef 尚未由 passive Effect 初始化」當作異常並 dispatch Pre-impact Abort。Patch 1 使 AI Attack 由 Controller Effect Phase Transition 提交，穩定暴露此 race。
- **Patch 1 Differential**：Patch 1 只增加 AI Progress／MOVE_COMPLETED 與 Controller second-phase dispatch，未修改 damage、attack-impact Guard 或 Animation Profile；現象因此發生在新增 AI Attack 提交時序與既有 Animation Controller 的邊界。
- **Attack ID Evidence**：
  - Before：Attack `1` → `ANIMATION START` → `attack-abort` → no Impact、no HP change。
  - After：Attack `1` → Clock initialized in frame → Impact Callback → Reducer Impact ACCEPTED → HP 80→70 / Applied 10 → Complete。
- **Fix**：首個 Frame 若有效 `attackMotion` 的 Clock 尚未初始化，建立 0ms Clock；只對非法 Delta 或錯誤 Attack ID Abort。尚無權繞過 Impact Guard。
- **Verification**：210/210 PASS（新增 2 項 Clock 初始化／ID tests），ESLint、Build、Diff Check PASS。Browser Ranger HP 70/80 與 Confirmed Attack Result 已確認。

## M4-3 Patch 3 — Historical Implementation and Review Snapshot

> 歷史快照：以下 Review 尚為 Conditional、TEST-M4-3-01 尚待獨立審查的狀態，記錄於正式結案前；最新狀態以本文件「M4-3 Formal Closure Record」為準。

- **Capability Issuance**：`battle.ai.gateway.ts` 以私有 identity set 記錄凍結的 AI Action；Gateway 依目前 Battle State 的 Controller Intent 發行，不接受呼叫端提供任意 Action intent；Reducer 保留 Context、Faction、Action State、Target、Destination 與 Lifecycle revalidation。
- **Enemy Pre-impact Abort**：Reducer 清除未命中 Attack Reservation 後明確排入該敵方 Turn Completion；Pending Completion 仍等待阻擋性 Death Motion。玩家 Pre-impact Abort 原有保留 Turn／Combat Action 行為不變。
- **Animation Lifecycle**：React Controller 與測試共用 Lifecycle Runtime；Node Frame Harness 覆蓋 Clock 首幀初始化、StrictMode Effect cleanup replay、Attack ID mismatch 與單一 Frame 同時跨越 Impact／Complete 的 exactly-once HP damage。
- **Automated Verification**：Agent 回報 `npm test` 213/213 PASS、`npm run lint` PASS、`npm run build` PASS；GitHub Actions Run `44496931887` SUCCESS，對應 Commit `6052c6197588b00c8732f34b7dbda0a3dc696a25`。
- **Browser Acceptance**：Product Owner 於 2026-11-19 確認 PASS。
- **Review**：Architecture Review CONDITIONAL PASS；Code Review CONDITIONAL PASS。CR-M4-3-01／02 PASS；CR-M4-3-03 Architecture PASS，TEST-M4-3-01 證據已完成，等待獨立審查。
- **TEST-M4-3-01**：新增 10 個 ReactDOM 整合測試，實際掛載 `AttackAnimationController` 與 `useAttackAnimation`，由 StrictMode 執行 Effect Replay；受控 `useFrame` harness 於 passive Effect 前推進真實 Lifecycle Runtime，Controller callbacks 以真正 `battleReducer` dispatch 驗證 HP、Attack Motion、Turn 與 Death Barrier。
- **AC-01～AC-20 Evidence Matrix**：

| AC | 驗證項目 | 測試證據 | 結果 |
|---|---|---|---|
| AC-01 | ReactDOM 真正掛載 AttackAnimationController | StrictMode mount／unmount 測試 | PASS |
| AC-02 | 正式 Controller 與 Lifecycle Runtime 未 Mock | 10 項整合測試共用正式實作 | PASS |
| AC-03 | React StrictMode Effect Replay setup／cleanup | StrictMode Replay 測試 | PASS |
| AC-04 | Replay cleanup 不誤派 Abort | Replay 後 Abort action 數為 0 | PASS |
| AC-05 | useFrame callback 註冊／卸載 | Frame harness 訂閱數與 unmount assertion | PASS |
| AC-06 | passive Effect 前執行首個 Frame | layout-phase frame-on-subscribe | PASS |
| AC-07 | 首幀建立 matching Attack ID／0ms Clock | `clockRef` assertion | PASS |
| AC-08 | Impact 前不扣 HP | Controlled delta：440ms assertion | PASS |
| AC-09 | Impact callback 派送至正式 Reducer | 跨越 Impact boundary 的 `attack-impact` action | PASS |
| AC-10 | HP 僅於 Reducer 接受 Impact 後更新 | Impact 前後 HP assertion | PASS |
| AC-11 | Impact exactly-once | 邊界及大 Delta action count | PASS |
| AC-12 | 同一 Frame 的 Impact 先於 Complete | 大 Delta action order assertion | PASS |
| AC-13 | Complete callback 清除 Attack Motion | Complete boundary 後 state assertion | PASS |
| AC-14 | 完成後額外 Frame 不重複派送 | 大 Delta 後再推進 Frame | PASS |
| AC-15 | 新 Attack ID 重設 Clock | Player Attack 1 → Enemy Attack 2 | PASS |
| AC-16 | Player／Enemy 攻擊回歸 | 連續雙方攻擊與實際 HP 更新 | PASS |
| AC-17 | 錯配 Clock Attack ID 隔離 | 僅 Abort 當前保留，不 Impact／不扣血 | PASS |
| AC-18 | Player Pre-impact Abort 保留 HP／Turn | Player Abort callback integration | PASS |
| AC-19 | Enemy Pre-impact Abort 尊重 Death Motion Barrier | Enemy Abort 後待 Death completion 才切 Turn | PASS |
| AC-20 | Unmount／Remount 無舊 Frame callback | cleanup、subscriber count、重掛後推進 | PASS |

- **其他 Lifecycle Evidence**：Post-impact Abort 保留已確認傷害並完成玩家 Turn；致命 Impact／同幀 Complete 仍等待 Death Motion。視覺子元件以 null Stub 隔離，未驗證 3D／Floating Damage 視覺及 `onFeedbackComplete` 的 UI 行為。
- **Automated Verification**：本機 `npm test` 223/223 PASS（含新增 10 項）；`npm run lint` PASS；`npm run build` PASS（保留既有 >500 kB Battle Chunk warning）。GitHub Actions Run `44496931887` SUCCESS 對應 Commit `6052c6197588b00c8732f34b7dbda0a3dc696a25`，不涵蓋目前未提交異動。
- **Browser / Acceptance**：Product Owner 對 M4-3 gameplay 於 2026-11-19 的 Browser Acceptance 維持 PASS；本次使用 Node + jsdom fixture，未執行 Browser Verification，也未取得 TEST-M4-3-01 的新 Product Owner Acceptance。
- **Status / Git**：M4-3 維持 IMPLEMENTED — PENDING FORMAL CLOSURE；TD-019 維持 APPROVED FOR CLOSURE — PENDING FORMAL CLOSURE。HEAD 與本機 `origin/main` tracking ref 維持 `6052c6197588b00c8732f34b7dbda0a3dc696a25`；本次工作樹有未提交異動，未 Commit／Push。M4 50%、Overall 35.0%、M4-4 PENDING。

## M4-3 Patch 1

- **BUG-M4-3-001 / Direct Attack Missing**：Decision Engine 與 Combat Reducer 可直接選取合法 ATTACK；原缺口是 Controller 中沒有可獨立驗證的 Direct Intent Layer，導致視覺缺失無法在 Controller Level 被精確重現。Patch 1 將 Controller next-intent 提取為純函式並加入 Regression。
- **BUG-M4-3-002 / Move-to-Attack Missing**：`MOVING` 同時代表動畫進行與動畫完成後待攻擊，Controller 依 `movementUsed` 隱含推斷第二階段；原目標失效時只走 Standby，未以最新 Battle State retarget。
- **Fix**：Movement Finish 原子寫入 `MOVE_COMPLETED`；Controller 只在此 Phase 提交後續 Attack，同一 Turn 允許 Move→Attack，並禁止在 MOVING 時發送 Attack。原目標失效後在最新 State 重新決定合法 Direct Target，否則有限 Standby。
- **Guard Integrity**：Capability、Turn Context、Combat Availability、Busy、Destination 與 `canAttackTarget()` 均保留；`movementInitiationLocked` 只禁止再移動，不禁止 Move→Attack。
- **Automated**：208/208 PASS；新增 5 項 Patch 1 Controller／Lifecycle Regression，原有 203 項全部保留。
- **Browser Evidence**：Turn 6 Goblin A 移動至 Ranger 附近後攻擊，Ranger HP 80→70；後續多個 Enemy Direct／Move Attack Cycle 持續 Impact 至 40，Turn 能正常回到玩家，無 Blocking Console Error。Patch 1 的主要功能後續已納入 Product Owner Browser Acceptance；特殊未完成 Browser Scenarios 不得補寫為 PASS。

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
- DOC-01 Patch 1：已納入 `69fc9be39351ea2531163a95f9d1561827b42190`；GitHub Actions Run `44280854293` 已確認 SUCCESS，不影響 M1–M10 進度。

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

- **歷史狀態快照（M4-3 正式結案前）**：當時 M4-3 正式敵方 AI 尚待驗收；技能、成長、劇情、存檔、PWA 與勝敗系統亦尚未完成。

**目前狀態（2026-11-20）**：M4-3 Enemy AI 已完成正式驗收（COMPLETED — FORMALLY ACCEPTED）；M4-4A End Condition Framework & Battle Outcome 已完成正式結案（COMPLETED — FORMALLY ACCEPTED）。Patch 1 為 COMPLETED — ACCEPTED，Final Review Correction 為 COMPLETED — VERIFIED；CR-M4-4A-01～05 全數 CLOSED。M4-4A Product Owner Post-Patch Browser Acceptance 為 BV-A01～A05 5/5 PASS；Agent 原始 PARTIAL／NOT VERIFIED 結果仍分列保留。最新已驗證 Repository Commit 為 `41b43c77e849276847c8c643deedd3a7ca0b0747`，GitHub Actions Run `44596893220` SUCCESS；M4-4A Feature Commit 為 `1cce94613791548cc1717942b72d1513487db857`。M4-4A 結案基準為 246/246 Automated Tests、12/12 React Integration、AC 32/32、原始 Test Traceability 28/28、Patch Traceability 9/9 PASS；Lint、Build、Diff Check PASS。M4-4B Overlay／Restart／Keyed Session Isolation 已實作但尚待獨立 Review 與 Product Owner Acceptance；本機 `npm test` 265/265、React／Session integration 31/31、Lint 與 Build PASS，Build 保留既有 >500 kB Battle Chunk warning。Browser Route 可載入，但 WebGL fallback 阻擋 3D 戰鬥及終局 Browser Regression，BV-B01、BV-B10 PARTIAL，BV-B02～B09 NOT VERIFIED。M4-4B 本機異動尚未提交，41b Commit／CI 不涵蓋。M4-4C 尚未開始；M4 維持 75%、Overall 37.5%。
- 技術債及 UX 項目詳見 [TECHNICAL_DEBT.md](./TECHNICAL_DEBT.md) 與 [UX_BACKLOG.md](./UX_BACKLOG.md)。

## 已知阻擋問題

M3、M4-1、M4-2、M4-3 與 M4-4A 無已知正式驗收阻擋。M4-4B Browser Regression 目前受瀏覽器顯示 WebGL fallback 阻擋；此環境問題尚未確認為本次程式異動造成，相關終局與 Responsive Browser Criteria 維持 PARTIAL／NOT VERIFIED。

## M4-1 狀態

- **COMPLETED — Conditional Closure**。
- 已加入 Remaining Distance Model、DES、確定性排序、Battle Time／Round／Turn ID、個體行動權、未來 10 次 Preview、HUD／Timeline 及 Active Highlight。
- AGI 已更新為劍士 10、刺客 15、法師 10、牧師 12、遊俠 12、哥布林 10。
- 玩家指令僅允許 Active Unit；待命及攻擊合法完成後自動排程下一位。致死攻擊等待所有阻擋性 Motion 結束。
- 正式敵方 AI、個體 Action Economy、勝敗及 M7 效果尚未實作。
- M4-1 當時的「模擬敵方待命」已由目前 M4-3 Capability AI Controller 取代。
- Patch 1 移除「確認移動」，加入最小 Turn-scoped Movement Commitment；攻擊與待命維持隱式確認，Undo 是唯一解除未確認移動限制的操作。
- Agent 原始 Browser Verification 保留其 PARTIAL 歷史；使用者後續已確認 M4-1 24/24、Patch 1 10/10 PASS。
- User Acceptance：M4-1 與 Patch 1 均為 PASS。
- Git／CI：兩項均已納入 `db30869e528f2aed95787d4cfdd1db3aca988c09`；Run `44385223281` SUCCESS。
- Code Review：CR-01 至 CR-05 均已由使用者核准延後，分別登錄為 TD-016 至 TD-020；條件式結案不表示風險已修復。
- 原始 M4-1 AC 不無條件標為 70/70 PASS：TD-017 保留待機事件重複完成防護缺口。

## M4-2 Implementation Status

- **COMPLETED — Formal Acceptance Approved**。
- M4-2 Patch 1：**COMPLETED**。
- Starting HEAD：`818cc6634bce89eaeffb4de13c98e9c9c05737fa`。
- 已加入 Turn Action State、Movement／Combat Action Lifecycle、Turn-bound Command Context、Combat Reservation／Consumption、Movement Initiation Lock、Pre-/Post-impact Abort Integration 與 Turn Reset。
- TD-016 已分離全域最小事件時間與 Tie-break，並加入 Near-tie／Round Boundary／Preview 與 10,000 次獨立 Oracle；TD-017 已完成 Command Context Audit；TD-020 具備長期理論抵達時間與行動次數驗證。
- 以上修復已通過 M4-2 Formal Acceptance；對應 TD-016、TD-017 與 TD-020 已 CLOSED。
- TD-018 維持 OPEN、留待 M7；TD-019 已於 M4-3 Formal Acceptance 後 CLOSED。
- 技術債統計：21 項；CLOSED 12、OPEN 8、PARTIALLY RESOLVED 1。非阻擋性 Dependency Maintenance 項目見 [TECHNICAL_DEBT.md](./TECHNICAL_DEBT.md)。
- TD-016、TD-017、TD-020：CLOSED。
- CR-01 至 CR-05：RESOLVED。
- M4-3：**COMPLETED — FORMALLY ACCEPTED**；CR-M4-3-01／02／03 與 TEST-M4-3-01 均 CLOSED；M4-4：**NEXT — PENDING DEVELOPMENT**。

### M4-2 Test Coverage Mapping（32 Planned Scenarios）

32 個原規劃情境由 20 + 5 項新增 M4-2/Patch 1 測試與既有 Regression 組合覆蓋，不以測試數量代替情境覆蓋。

| # | Scenario | Evidence |
|---:|---|---|
| 1 | Turn Action 初始化 | `Turn Action State 初始化並與 Active Unit、Turn ID 維持單一來源` |
| 2 | 合法 Standby | `缺失、錯誤或過期 Context 的 Standby 以 no-op 拒絕` |
| 3 | 重複／舊 Standby | 同測試；`next` 後重播 stale action |
| 4 | 錯誤 Turn／Unit Context | 同測試的 wrong turn／unit assertions |
| 5 | 同 Battle Time 不同 Turn | `不同玩家在相同 Battle Time 連續取得 Turn…` |
| 6 | 同角色新 Turn | `相同角色再次取得 Individual Turn…` |
| 7 | Mode／Target／Cancel stale | `舊 Turn 指令不可污染…` |
| 8 | 過期 Movement／Undo | `舊 Turn…` + 既有 `battle.test` motion/undo tests |
| 9 | 過期 Confirm Attack | `舊 Turn…` + Guard consistency test |
| 10 | 無 Active Unit | 既有 `Turn 權限…空 Timeline 安全停止` |
| 11 | Movement Finish 消耗 | `合法 Movement Finish 消耗權限…` |
| 12 | Movement Cancel 不消耗 | 同測試的 cancel branch |
| 13 | Undo 恢復位置／權限 | 同測試的 undo branch |
| 14 | Repeat Move 拒絕 | 同測試 + 既有 `合法移動後核心拒絕再次移動` |
| 15 | Lock 單獨禁止 Undo | `Movement Initiation Lock 單獨禁止 Undo…` |
| 16 | MOV／Terrain／Dijkstra Regression | `movement`／`terrain`／`obstacles` test groups |
| 17 | Confirm creates Reservation | `Confirm Attack 保留 Reservation…` |
| 18 | Confirm 不先扣血 | 同測試的 target HP assertion |
| 19 | Unified Combat Eligibility | `Reducer 與共用 Combat Guard…` |
| 20 | Invalid Context／Target no Reservation | 同測試 invalid context／target assertions |
| 21 | Consumed cannot re-confirm | 同測試 consumed assertion |
| 22 | Move then Attack preserves Movement | `已移動後 Confirm Attack…` |
| 23 | Impact atomic consume | `合法 Impact 原子消耗…` |
| 24 | Duplicate Impact idempotent | 同測試 repeated Impact assertion |
| 25 | Pre-impact Abort Recovery | `Pre-impact Abort 釋放 Reservation…` |
| 26 | Abort preserves used move / Undo loss | `Pre-impact Abort 不恢復已使用移動…` |
| 27 | Snapshot failure / stale Abort | `Impact Snapshot 驗證失敗…` |
| 28 | Post-impact Abort completion | `Post-impact Abort 保留傷害…` |
| 29 | Reset preserves persistent state / IDs | `Turn Reset 僅清理 Turn-scoped State…` |
| 30 | PAS Exact／Near-tie／Round Boundary | `battle.turn.precision`: near-tie、epsilon boundary、round boundary tests |
| 31 | 10,000 Oracle + Stress | fixed-speed Oracle + `10,000 次 Near-tie × Round Boundary stress` |
| 32 | Preview／actual consistency | `Preview 的十次…` + `Near-tie Round Boundary 後 Preview…` |

Final Addendum 額外證據：

- `同一 Scheduler 連續 10,000 個 Near-tie 事件不累積誤差`：不重建 Turn State，直接驗證 10,000 次事件後 Battle Time、Round、Remaining Distance、Turn ID 與近似 Tie 累積誤差上界。
- `Direct Reducer 拒絕缺失、過期、錯誤 Context 及舊 Confirm／Standby`：直接呼叫 `battleReducer()`，驗證六類 Context replay，不經 Fixture 自動補齊。

## 下一步

M4-3 已 **COMPLETED — FORMALLY ACCEPTED**。M4-4A End Condition Framework & Battle Outcome、Patch 1 與 Final Review Correction 已分別標記 **COMPLETED — FORMALLY ACCEPTED**、**COMPLETED — ACCEPTED**、**COMPLETED — VERIFIED**；CR-M4-4A-01～05 全數 CLOSED。Formal Closure 文件已納入 Repository Commit `41b43c77e849276847c8c643deedd3a7ca0b0747`／GitHub Actions Run `44596893220` SUCCESS；M4-4A Feature Commit 為 `1cce94613791548cc1717942b72d1513487db857`。M4-4A 結案基準為 246/246 Automated Tests、12/12 React Integration Tests、32/32 AC、28/28 T、9/9 P-T、Lint、Build 與 Diff Check PASS；Product Owner Post-Patch BV-A01～A05 5/5 PASS（2026-11-20）。Patch 前 PO 驗收與 Agent 原始 PARTIAL／NOT VERIFIED 結果仍分列保留。M4-4B **IMPLEMENTED — PENDING REVIEW**；本機 265/265 tests、31/31 Session／React Integration、Lint 與 Build PASS；Browser 終局驗證受 WebGL fallback 阻擋，Product Owner Acceptance PENDING。M4-4C 為 **PENDING DEVELOPMENT**；M4 整體仍 IN PROGRESS，維持 75%、Overall 37.5%。目前 M4-4B 程式、測試與文件異動尚未提交；不 Commit／Push。
