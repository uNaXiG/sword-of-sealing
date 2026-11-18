# Copilot Instructions — Sword of Sealing

## 專案定位

Sword of Sealing（封印之劍）是使用 React、TypeScript、Vite、Three.js 與 React Three Fiber 開發的單人 3D 格子回合制戰棋 RPG。正式美術與故事系統尚未全部實作；目前核心工作聚焦於戰鬥原型。

## Context Loading

每次新 Session 預設先讀取：

1. `.github/copilot-instructions.md`
2. [DEVELOPMENT_STATUS.md](../docs/DEVELOPMENT_STATUS.md)
3. [ROADMAP.md](../docs/ROADMAP.md)
4. [ARCHITECTURE.md](../docs/ARCHITECTURE.md)

依任務類型按需讀取 [GAME_DESIGN.md](../docs/GAME_DESIGN.md)、[COMBAT_SYSTEM.md](../docs/COMBAT_SYSTEM.md)、[ART_GUIDELINES.md](../docs/ART_GUIDELINES.md)、[UX_BACKLOG.md](../docs/UX_BACKLOG.md)、[TECHNICAL_DEBT.md](../docs/TECHNICAL_DEBT.md) 或 [CHANGELOG.md](../docs/CHANGELOG.md)。小型任務不必載入全部文件，但須讀取足以核實需求的來源。

### Session Initialization Protocol

1. 依上列順序讀取核心文件。從 Development Status 確認目前狀態與既有測試基準，從 Roadmap 確認目前里程碑及下一項任務；檢查相關技術債與 UX Backlog。
2. 以唯讀 Git 指令核對目前分支、HEAD、遠端追蹤分支及工作樹；追蹤分支是本機紀錄，不能單憑它推定遠端最新狀態。
3. 區分文件所載的規劃與驗收、原始碼的實際行為及 Git 的版本狀態。若不一致，先回報差異；未重跑的測試只標示為既有基準。
4. 初始化不等於授權開始實作。初始化本身不修改檔案，亦不執行會改動 Git 狀態的操作。

## 基本架構原則

- Battle State 是戰鬥資料的 Single Source of Truth。
- Game Logic 與 Rendering 分離；UI 不自行決定戰鬥規則。
- Reducer 負責操作合法性與不可變狀態更新。
- Highlight 與核心判定共用相同規則。
- 動畫層不得直接修改正式戰鬥資料。
- 職業使用 Interface + Registry + Factory，不使用繼承式職業樹。
- 核心規則優先保持陣營無關，以供未來敵方 AI 共用。

### Battle Lifecycle Integrity

- Renderer 不決定正式傷害、死亡或回合結果，也不將逐幀動畫進度寫入核心 Battle State。傷害視覺回饋只依核心確認的 Impact Event。
- Reducer 驗證事件合法性與狀態轉移；Movement、Attack、Death 等事件須處理唯一識別、重複、過期及異常中止。
- 所有阻擋性 Motion 結束後才解除動畫操作鎖，且操作仍須符合其他核心條件。棋格佔位須與單位生命週期一致。
- 回合制、敵方 AI 與技能應優先重用核心規則。實作細節以 [ARCHITECTURE.md](../docs/ARCHITECTURE.md) 與 [COMBAT_SYSTEM.md](../docs/COMBAT_SYSTEM.md) 為準。

### Rendering & Resource Lifecycle

- 動畫 Transform 須有明確基準值、所有權與重置機制，避免 React Re-render 與 `useFrame` 共同造成累積偏移。需對齊的元素應共用座標基準，或明確轉換座標。
- 避免每幀建立 Texture、Material 或 Geometry。由資源擁有者負責回收，並處理 StrictMode、Unmount、Remount 與過期 Callback。
- 修正局部渲染問題時，不得改變既有核心戰鬥規則。

## 開發協作

- 使用者是 Product Owner / Game Designer，負責確認玩法與最終瀏覽器驗收。
- Agent 依正式 FR、TS、AC、DoD 實作，不自行擴張規格。
- 若文件、需求與實際程式衝突，先回報差異並等待確認。
- 未確認的劇情、美術規格、職業平衡、動畫時序與遊戲規則不得自行補完。

## Coding 與 Testing Guidelines

- 沿用既有 TypeScript、React Hooks、純函式與不可變更新模式。
- 精準修改相關檔案；避免無關重構及任意新增依賴。
- 新規則應優先加入既有 Node.js 原生測試，不弱化既有 Assertions 或 Skip 測試。
- 驗證時執行最小必要測試，完成正式任務時依規格執行 `npm test`、`npm run lint`、`npm run build`。

### Verification Integrity

- 分開回報 Automated Tests、Integration Verification、Browser Verification 與 User Acceptance。各項依證據標為 `PASS`（已驗證且通過）、`FAIL`（不符預期）、`PARTIAL`（只驗證部分範圍）或 `NOT VERIFIED`（未驗證）。
- Browser Verification 必須有實際瀏覽器操作證據；測試、Lint、Build、Vite 啟動或 Console 無錯誤，不等於視覺通過。只有使用者能確認 User Acceptance。
- 若使用特殊 Fixture，標明是 Node Fixture 或 Browser Fixture。無法實際驗證時，回報限制與仍待驗證的項目。

## Scope 與 Git 限制

- 不提前實作未來 Milestone、UX Backlog 或技術債。
- 不調整職業數值、CI/CD、Vite Base Path、部署設定或依賴，除非規格明確授權。
- 未經明確授權不得 Commit、Push、Reset、Checkout、Pull 或破壞現有工作內容。
- 不得因未驗證而宣稱 PASS，也不得隱藏警告或限制。

### Repository Baseline Management

- 在 [DEVELOPMENT_STATUS.md](../docs/DEVELOPMENT_STATUS.md) 分開記錄 Latest Verified Repository Commit 與 Latest Verified Gameplay Commit；CI 結果須對應實際 Commit SHA 及 Branch。
- 分清 `IMPLEMENTED`（已實作）、`ACCEPTED`（使用者已驗收）、`COMMITTED`（已納入 Git 提交）及 `COMPLETED`（已依 Roadmap 結案）。提交與驗收是不同事實。
- 未提交工作不屬於遠端 CI，不能沿用其通過判定；不得虛構 Commit SHA 或 CI 結果。CHANGELOG 保留當時正確的歷史狀態；既有測試未重跑就不得描述為本次執行。

## 文件維護規則

每次正式開發任務將持久化文件同步更新納入 Definition of Done：

- 更新 [DEVELOPMENT_STATUS.md](../docs/DEVELOPMENT_STATUS.md) 的實作／驗收／提交狀態。
- 在 [CHANGELOG.md](../docs/CHANGELOG.md) 加入可確認的異動與驗證。
- 里程碑狀態改變時更新 [ROADMAP.md](../docs/ROADMAP.md)。
- 架構、戰鬥規則、遊戲設計、美術、UX 或技術債改變時更新對應單一來源文件。
- Git、CI/CD、測試與驗收狀態只能依實際確認結果更新。
- Agent 不得代替使用者將瀏覽器驗收標記為完成。
- 詳細資訊只寫在對應文件；其他文件使用相對連結，避免重複維護。

## 回報格式

正式開發完成後回報：實作摘要、檔案異動、核心設計、功能規則、自動化驗證、逐項 AC/BV、Scope Compliance、Technical Debt / Known Issues、Final Status。

## Definition of Done

符合正式需求與 AC、保留既有行為、更新必要測試與文件、完成授權範圍的測試／Lint／Build／Browser Verification、檢查 Diff 僅含授權異動，並清楚區分實作、驗收及 Commit 狀態。
