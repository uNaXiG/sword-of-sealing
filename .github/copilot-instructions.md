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

## 基本架構原則

- Battle State 是戰鬥資料的 Single Source of Truth。
- Game Logic 與 Rendering 分離；UI 不自行決定戰鬥規則。
- Reducer 負責操作合法性與不可變狀態更新。
- Highlight 與核心判定共用相同規則。
- 動畫層不得直接修改正式戰鬥資料。
- 職業使用 Interface + Registry + Factory，不使用繼承式職業樹。
- 核心規則優先保持陣營無關，以供未來敵方 AI 共用。

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
- Browser Verification 只能根據實際操作結果使用 `PASS`、`FAIL` 或 `NOT VERIFIED`。

## Scope 與 Git 限制

- 不提前實作未來 Milestone、UX Backlog 或技術債。
- 不調整職業數值、CI/CD、Vite Base Path、部署設定或依賴，除非規格明確授權。
- 未經明確授權不得 Commit、Push、Reset、Checkout、Pull 或破壞現有工作內容。
- 不得因未驗證而宣稱 PASS，也不得隱藏警告或限制。

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
