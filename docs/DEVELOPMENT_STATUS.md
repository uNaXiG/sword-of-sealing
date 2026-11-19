# Development Status

最後確認日期：2026-11-19。

## 狀態語彙

- **已實作**：程式或文件已存在。
- **已驗收**：使用者已完成對應驗收；Agent 不得代為標記。
- **已提交**：Git HEAD 已包含該異動。

## 目前基準

| 項目 | 狀態 |
| --- | --- |
| Current Verified Repository Baseline | `uNaXiG/sword-of-sealing` · `main` @ `4043459cfa3cb884aa9d9a6653ed646ef59975a9` — `feat(tests): add integration tests for AttackAnimationController and frame harness` |
| Latest Verified Repository CI Run | [44500720991](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44500720991) — SUCCESS（`main` / `4043459c`） |
| Latest Verified Gameplay Commit | `main` @ `6052c6197588b00c8732f34b7dbda0a3dc696a25`（M4-3 Patch 3） |
| Gameplay CI Run | [44496931887](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44496931887) — SUCCESS（`main` / `6052c619`） |
| M4-4A Session Start Git Baseline | `main` HEAD `11b1652d1702376d703da8eed4cb83586e23401e`；本機 `origin/main` tracking ref 相同；開始時工作樹乾淨。此為本機 ref 記錄，不據此推定遠端最新狀態或 CI 狀態 |
| Current Working Tree | M4-4A 原有異動及 Patch 1 Source／Tests／文件含未提交異動；未 Commit／Push |
| 最近完成項目 | M4-1：COMPLETED — Conditional Closure；M4-2：COMPLETED — Formal Acceptance Approved；M4-3：COMPLETED — FORMALLY ACCEPTED |
| 主要里程碑狀態 | M1–M3 **COMPLETED**；M4 **IN PROGRESS（75%）**，M4-4A Patch 1 已實作、待獨立 Final Review；M4-4B／C 尚未開始；安排以 [ROADMAP.md](./ROADMAP.md) 為準 |
| M3-4 與 Patch 1（Revision 2） | **COMPLETED**；已實作、已驗收、已提交並通過 CI |
| M3 進度 | 100% |
| M4 進度 | 75%（3/4） |
| 完整結案主要里程碑 | 3/10 |
| 整體里程碑等權重進度 | 37.5%（Roadmap Completion Percentage，不代表實際工時比例） |
| M4 結案狀態 | M4-1：**COMPLETED — Conditional Closure**；M4-1 Patch 1：**COMPLETED**；M4-2：**COMPLETED — Formal Acceptance Approved**；M4-2 Patch 1：**COMPLETED**；M4-3：**COMPLETED — FORMALLY ACCEPTED** |
| M4-2 狀態 | **COMPLETED — Formal Acceptance Approved**；Feature Commit 與對應 CI 已驗證 |
| M4-3 狀態 | **COMPLETED — FORMALLY ACCEPTED**；Patch 1／2／3 與 TEST-M4-3-01 已完成；223/223 Automated Tests；Product Owner Browser Acceptance、Architecture Review、Code Review 均 APPROVED |
| Code Review Findings | CR-M4-3-01／02／03 CLOSED；TEST-M4-3-01 CLOSED — PASS；TD-019 CLOSED |
| M4-4 狀態 | **IN PROGRESS**；M4-4A Patch 1 **IMPLEMENTED — PENDING INDEPENDENT FINAL REVIEW**；M4-4B／C **PENDING DEVELOPMENT** |
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
| M4-4A Patch 1 Starting Baseline | 239/239 PASS；ESLint PASS；Build PASS | Patch 開始前重跑；HEAD `11b1652d1702376d703da8eed4cb83586e23401e`；保留既有未提交 M4-4A 異動 |
| M4-4A Patch 1 Automated Tests | 246/246 PASS | `npm test`；保留原 239 項測試意圖並新增 7 個測試；涵蓋 nested config、Outcome Trigger Boundary、Attack Reservation、configured session progression 與 Victory／Defeat React lifecycle |
| M4-4A Patch 1 ESLint / Production Build | PASS / PASS | `npm run lint`、`npm run build`；Build 保留既有 >500 kB Battle Chunk warning |
| M4-4A Agent Browser Verification (pre-P1) | PARTIAL | 真實 Browser 載入 Battle Scene，操作模式／待命及多輪 AI 回合流程；未能確認一次成功移動或攻擊。原 BV-A02～A05 未驗證 |
| M4-4A Product Owner Browser Acceptance (pre-P1) | PASS（2026-11-19；BV-A01～A05 5/5） | 依 Product Owner 提供的驗收結果記錄；屬 Patch 1 前證據，不代表本次 Runtime 變更已重驗 |
| M4-4A Patch 1 Browser Regression | PARTIAL | BV-A01 部分重驗：確認移動、攻擊模式、待命與 PAS；未完成有效攻擊。BV-A02～A05 尚未重驗 |
| M4-4A Review / Acceptance | PENDING INDEPENDENT FINAL REVIEW | M4-4A Architecture Review 已 APPROVED、Code Review CONDITIONAL APPROVAL；Patch 1 尚未經獨立 Final Review，亦未宣告 Formal Acceptance |

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
| AC-A29 Git Diff Check | PASS | `git -c core.whitespace=cr-at-eol diff --check` 與未追蹤檔案 whitespace inspection；尊重 Repository 的 CRLF 行尾 | No commit or push |
| AC-A30 持久化文件同步 | PASS | README、Development Status、Roadmap、Architecture、Combat System、Game Design、Changelog 同步 Patch 1；TD-018／019／021 與 UX Backlog 未變更 | Patch 後 Browser Regression 與 Review 狀態不得推定完成 |
| AC-A31 無未授權 Scope Expansion | PASS | Diff inspection；只實作 M4-4A，未建立 Overlay／Restart／Session Isolation | BV-A01 Patch 後 PARTIAL；BV-A02～A05 NOT VERIFIED |
| AC-A32 無 Circular Runtime Dependency | PASS | TypeScript Production Build；Battle Core imports Condition Contracts／Resolver, not concrete AllDead modules | — |

## M4-4A Browser Evidence

| BV | Agent Browser Verification (pre-P1) | Product Owner Acceptance (2026-11-19, pre-P1) | Patch 1 Browser Regression |
|---|---|---|---|
| BV-A01 Normal Battle Regression | PARTIAL | PASS | PARTIAL — moved Assassin successfully; Attack Mode showed 0 legal targets; Standby advanced to Player Turn 2 |
| BV-A02 Victory Terminal State | NOT VERIFIED | PASS | NOT VERIFIED |
| BV-A03 Defeat Terminal State | NOT VERIFIED | PASS | NOT VERIFIED |
| BV-A04 Death Barrier Visual Regression | NOT VERIFIED | PASS | NOT VERIFIED |
| BV-A05 Terminal Interaction | NOT VERIFIED | PASS | NOT VERIFIED |

Product Owner 的 5/5 PASS 是 Patch 1 前的真實瀏覽器驗收紀錄；Agent 原有 PARTIAL／NOT VERIFIED 結果保留為獨立歷史證據。Patch 1 改變 Runtime Outcome Trigger，相關 Browser Regression 必須重驗；Node／React Integration 測試不替代 Browser Verification 或新的 Product Owner Acceptance。

## M4-4A Patch 1 Review Finding Resolution

| Finding | Patch 1 Resolution | Evidence | Status |
|---|---|---|---|
| CR-M4-4A-01 Configuration Immutability | 明確區分 Runtime shallow freeze 與 Concrete Strategy Author Contract；Test-only nested config 使用 schema-specific copy/freeze | `tests/end-conditions.test.mjs`：`test-only nested configuration strategy snapshots and protects its schema explicitly`；Architecture／Combat System Contract | IMPLEMENTED |
| CR-M4-4A-02 Outcome Evaluation Boundary | 僅在有效安全的 Move／Lifecycle Completion 與 Pre-PAS 觸發；Session 初始化保持 ACTIVE，初始已成立條件在首個合法安全觸發點結算 | `session initialization is ACTIVE and only valid outcome triggers evaluate initial conditions`；stale／unauthorized、Attack Reservation 與 PAS tests | IMPLEMENTED |
| CR-M4-4A-03 Test Coverage Completion | 補齊指定 truth table、constructor、Attack-only barrier、Gateway、雙向終局、configured session 等情境 | `tests/end-conditions.test.mjs`、`tests/battle.animation.react.integration.test.mjs`；246/246 | IMPLEMENTED |
| CR-M4-4A-04 React Outcome Integration | 真實 `AttackAnimationController`、`DeathAnimationController`／`useDeathAnimation`、Session、Configured Reducer、Win／Loss AllDead 覆蓋正式 Victory、Defeat 及 late callback | React tests：`configured Victory waits for React attack and death lifecycle completion without advancing PAS`；`configured Defeat waits for React enemy attack and player death lifecycle completion` | IMPLEMENTED |
| CR-M4-4A-05 Documentation Synchronization | 同步七份指定文件；記錄 Product Owner Patch 前 5/5 Acceptance，並保留 Agent 舊 Browser 結果 | README、Development Status、Architecture、Combat System、Game Design、Roadmap、Changelog | IMPLEMENTED |

以上為 Patch Implementation 狀態，不代表獨立 Final Review 或 M4-4A Formal Acceptance 已完成。

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

**目前狀態（2026-11-19）**：M4-3 Enemy AI 已完成正式驗收（COMPLETED — FORMALLY ACCEPTED）；M4-4A Patch 1 已實作，246/246 Tests PASS。Patch 前 Product Owner Browser Acceptance 為 BV-A01～A05 5/5 PASS；Patch 後 Browser Regression 與獨立 Final Review 尚未完成，故 M4-4A 仍未正式結案。M4-4B／C 尚未開始。M4 仍為 75%，專案整體仍為 37.5%。
- 技術債及 UX 項目詳見 [TECHNICAL_DEBT.md](./TECHNICAL_DEBT.md) 與 [UX_BACKLOG.md](./UX_BACKLOG.md)。

## 已知阻擋問題

目前無已知 M3、M4-1、M4-2 或 M4-3 正式驗收阻擋。M4-3 的 Architecture／Code Review 已 APPROVED；既有特殊 Browser Scenarios 維持各自驗證狀態。

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

M4-3 已 **COMPLETED — FORMALLY ACCEPTED**。M4-4A Patch 1 **IMPLEMENTED — PENDING INDEPENDENT FINAL REVIEW**；246/246 Tests、ESLint、Production Build 與 Diff Check PASS（保留既有 >500 kB Battle Chunk warning）。Patch 前 Product Owner BV-A01～A05 5/5 PASS；Patch 後 BV-A01 PARTIAL、BV-A02～A05 NOT VERIFIED，未宣稱 Patch 後驗收完成。M4-4B／C 為 **PENDING DEVELOPMENT**；M4 維持 75%、Overall 維持 37.5%。M4-4A 尚未正式驗收，亦未 Commit／Push。
