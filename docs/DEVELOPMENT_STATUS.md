# Development Status

最後確認日期：2026-11-20。

## 狀態語彙

- **已實作**：程式或文件已存在。
- **已驗收**：使用者已完成對應驗收；Agent 不得代為標記。
- **已提交**：Git HEAD 已包含該異動。

## 目前基準

| 項目 | 狀態 |
| --- | --- |
| Current Verified Repository Baseline | `uNaXiG/sword-of-sealing` · `main` @ `8ae9f928ecf0712a3947c5c6a20d41733c8a90a7` — Latest M5-2A Combat UI/UX Repository Baseline；`HEAD` 與 Fetch 後 `origin/main` 一致 |
| Latest Verified Repository CI Run | [44722441270](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44722441270) — SUCCESS（`main` / `8ae9f928ecf0712a3947c5c6a20d41733c8a90a7`）；build、Deploy to GitHub Pages 均 SUCCESS |
| Latest Verified M4-4A Feature Commit | `main` @ `1cce94613791548cc1717942b72d1513487db857`；End Condition Framework & Battle Outcome |
| Current Repository HEAD | `main` @ `8ae9f928ecf0712a3947c5c6a20d41733c8a90a7`；已 Fetch，與 `origin/main` tracking ref 一致 |
| Latest Verified GitHub Pages Deployment | [Run 44722441270](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44722441270) — `build` 與 `deploy` jobs 均 SUCCESS |
| M4-3 Gameplay Commit / CI | Commit `6052c6197588b00c8732f34b7dbda0a3dc696a25`；[Run 44496931887](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44496931887) — SUCCESS |
| M4-4A Patch 1 Session Start Baseline | 歷史基準：`main` HEAD `11b1652d1702376d703da8eed4cb83586e23401e`；當時工作樹乾淨，之後 Patch 1 與原 M4-4A 異動已納入 `1cce946` |
| M4-4B Conditional Closure Commit | `e299fa48e28d16e24aadba9cc7925bedf4d53895`；16 個異動檔案；Battle Core Modification 0 |
| M4-4C Session Start Baseline | `main`／HEAD／`origin/main` `3705dfe0737fe0df1798f280c5e1c5c8056f8ad9`；開始時工作樹乾淨 |
| Current Working Tree | Modified；保留既有中繼資料異動，另含未提交的 M5-2B 相機程式、測試與文件；目前無 staged changes；未 Commit／Push；HEAD 與 `origin/main` 均為 `8ae9f928ecf0712a3947c5c6a20d41733c8a90a7` |
| 最近完成項目 | M5-1 Battle HUD Redesign（含 UI Refinement Patch 1／2）：**COMPLETED — FORMALLY ACCEPTED**；M5-2A：**COMPLETED — FORMALLY ACCEPTED WITH LIMITATIONS**；M4-1～M4-4 既有正式結案狀態不變 |
| 主要里程碑狀態 | M1–M4 **COMPLETED**；M5 **IN PROGRESS**、M5-1 **COMPLETED — FORMALLY ACCEPTED**；M5-2A **COMPLETED — FORMALLY ACCEPTED WITH LIMITATIONS**、M5-2B **IMPLEMENTED — PENDING REVIEW**、M5-3／M5-4 PENDING，詳見 [ROADMAP.md](./ROADMAP.md) |
| M3-4 與 Patch 1（Revision 2） | **COMPLETED**；已實作、已驗收、已提交並通過 CI |
| M3 進度 | 100% |
| M4 進度 | 100%（4/4） |
| M5 進度 | 37.5%（M5-1 已正式結案；M5-2A 已正式結案；M5-2B 待審查，不計為正式完成） |
| 完整結案主要里程碑 | 4/10 |
| 整體里程碑等權重進度 | 43.75%（4 個主要里程碑完成 + M5 的 37.5%；Roadmap Completion Percentage，不代表實際工時比例） |
| M4 結案狀態 | M4-1：**COMPLETED — Conditional Closure**；M4-1 Patch 1：**COMPLETED**；M4-2：**COMPLETED — Formal Acceptance Approved**；M4-2 Patch 1：**COMPLETED**；M4-3：**COMPLETED — FORMALLY ACCEPTED**；M4-4：**COMPLETED — FORMALLY ACCEPTED** |
| M4-2 狀態 | **COMPLETED — Formal Acceptance Approved**；Feature Commit 與對應 CI 已驗證 |
| M4-3 狀態 | **COMPLETED — FORMALLY ACCEPTED**；Patch 1／2／3 與 TEST-M4-3-01 已完成；223/223 Automated Tests；Product Owner Browser Acceptance、Architecture Review、Code Review 均 APPROVED |
| Code Review Findings | CR-M4-3-01／02／03 CLOSED；TEST-M4-3-01 CLOSED — PASS；TD-019 CLOSED |
| M4-4 狀態 | **COMPLETED — FORMALLY ACCEPTED**；M4-4A **COMPLETED — FORMALLY ACCEPTED**；M4-4B／4C **COMPLETED — FORMALLY ACCEPTED WITH LIMITATIONS**；VA1 **COMPLETED — ACCEPTED** |
| M3 Closure Documentation | 已提交至 `9c8e623` 並通過 Repository CI |

## M4 Formal Closure Record — 2026-11-20

**Authorization：FORMAL CLOSURE APPROVED WITH RESIDUAL VERIFICATION LIMITATIONS。** M4-4A、M4-4B、M4-4C、M4-4C Verification Addendum 1 與 M4 Combat System 均已正式結案；M4 **COMPLETED — FORMALLY ACCEPTED**。M4-4B／M4-4C 的核准限制與 GPU 資源延後驗證均保留，不代表所有 GPU 資源已完整驗證。VA2 與 Runtime Patch 均未啟動。

| Closure Item | Final Decision |
|---|---|
| M4-4A | COMPLETED — FORMALLY ACCEPTED |
| M4-4B | COMPLETED — FORMALLY ACCEPTED WITH LIMITATIONS |
| M4-4C | COMPLETED — FORMALLY ACCEPTED WITH LIMITATIONS |
| M4-4C Verification Addendum 1 | COMPLETED — ACCEPTED |
| M4 Combat System | COMPLETED — FORMALLY ACCEPTED |
| Architecture Review | APPROVED |
| Independent Code Review | APPROVED WITH LIMITATIONS |
| Product Owner Acceptance | APPROVED |
| Formal Closure | APPROVED |

**Verified Repository Baseline：** Branch `main`、Commit `b21b36c8b8343865b8abd457cdd70c8b332dfc7b`、GitHub Actions Run [44617918846](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44617918846) SUCCESS、GitHub Pages Deployment SUCCESS。CI log 驗證 271/271 Tests；Production Route Integration 6/6、ESLint、Production Build 與 Agent 本機 Diff Check 均 PASS。該 Run／Commit 是 M4 結案驗證基準；當時的 M4 文件異動尚未提交，不屬於該 CI；目前工作樹狀態見文件開頭的 Current Working Tree。VA1 Commit 包含一份測試、五份文件及額外美術素材 [信念.png](../public/assets/images/skills/信念.png)；該素材不屬於 VA1 驗收範圍，本次未修改。

**Product Owner Browser Acceptance：** 2026-11-20，BV-C01～BV-C14 **14/14 PASS — ACCEPTED**。此驗收取得於 VA1 前基準；VA1 沒有修改 Production Runtime，因此正式採認為功能驗收證據，但不得描述為 VA1 後重跑的 Browser Regression。Agent 原始 PARTIAL／NOT VERIFIED 紀錄另列於下方並保留；PO BV-C13 PASS 不等同 `renderer.info` 或 GPU disposal 已完整驗證。

**VA1 Review Resolution：**

| Item | Final Resolution |
|---|---|
| VA1-01 Terminal Route Unmount | APPROVED |
| VA1-02 Timer／Listener／Deferred Work | APPROVED WITH LIMITATIONS |
| VA1-03 Repeated Restart Lifecycle | APPROVED WITHIN REACT HARNESS SCOPE |
| VA1-04 WebGL Diagnostics | PARTIAL — DEFERRED |
| VA1-05 Production Integration | APPROVED |
| VA1-06 Traceability | APPROVED |
| VA1-07 Git Scope | APPROVED |

Microtask instrumentation 僅涵蓋測試操作範圍；R3F／Drei adapter 與視覺替身不提供 GPU 診斷；AI instruction 未逐次獨立計數。這些限制仍列為核准限制。

**Remaining Verification／Review Resolution：**

| Item | Final Resolution |
|---|---|
| RV-M4-4B-01 Production Route Lifecycle Cleanup | CLOSED — VERIFIED |
| RV-M4-4B-02 WebGL Resource Lifecycle | PARTIAL — DEFERRED TO TD-010 |
| RV-M4-4B-03 Production Runtime Integration Coverage | CLOSED — VERIFIED |
| RC-M4-4B-07 | ACCEPTED WITH LIMITATIONS |
| RC-M4-4B-08 | CLOSED |
| B-T06 | Automated PARTIAL remains; PO supplemental verification accepted |
| B-T30／AC-B30 | GPU Lifecycle PARTIAL remains; deferral approved |

AC-C25～C28 為 **PARTIAL — ACCEPTED / DEFERRED TO TD-010**；AC-C41、AC-C42 為 PASS；AC-C45 為 PASS WITH APPROVED LIMITATIONS。AC-C01～C45 綜合結果為 **40 PASS、1 PASS WITH APPROVED LIMITATIONS、4 PARTIAL — APPROVED DEFERRAL**；C-T01～C-T36 為 36/36 PASS，依各項既定測試範圍與限制。

**Roadmap at M4 Closure：** M1–M4 100%；當時 M5–M10 0%；Completed Milestones 4/10；Overall 40%。此為 M4 結案時的歷史狀態，現況已由下方 M5-1 Formal Closure Record 取代。TD-010 保持 PARTIALLY RESOLVED；資源量測與建議追蹤時程見 [TECHNICAL_DEBT.md](./TECHNICAL_DEBT.md)。TD-006、TD-007、TD-014、TD-018、TD-019、TD-021 與 UX Backlog 既有技術債狀態未變更。

## M5-1 Formal Closure Record — 2026-11-20

**Authorization：DOCUMENTATION ONLY。** M5-1 Battle HUD Redesign（包含 UI Refinement Patch 1／2）狀態為 **COMPLETED — FORMALLY ACCEPTED**。

- **Verified Repository Baseline**：`main` HEAD `ac074cda29ac7dad977d56e9fc720bb17e417205`；local HEAD、`origin/main` 與 GitHub `main` 一致。
- **CI / Deployment**：GitHub Actions Run [44647602225](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44647602225) 對應 `main` 與上述 HEAD，結論 **SUCCESS**。本次文件同步未重跑 tests／lint/build，不另行宣稱新的測試數據。
- **Review / Acceptance**：Independent Code Review **APPROVED — MINOR DOCUMENTATION CORRECTIONS**；Product Owner Visual Acceptance **APPROVED**。
- **Historical Verification Integrity**：保留 Patch 1／2 的 Agent Browser PARTIAL／NOT VERIFIED 項目與限制，不回溯改寫或宣稱未執行的 Browser／Automated Tests 通過。
- **Progress**：M5 定義四個子階段，M5-1 完成後為 **25%**；M1–M4 完成，M5–M10 其餘項目未完成；Overall **42.5%**，完整結案主要里程碑仍 **4/10**。M5-2 為下一個待開發子階段。
- **Working Tree / Scope**：開始文件同步前工作樹乾淨；目前僅本文件同步相關 Markdown 異動，無 Production Source／Tests／Assets 修改。未暫存、未 Commit／Push。

## M5-2B Battle Camera System — Implementation & Verification — 2026-11-20

**Status：IMPLEMENTED — PENDING REVIEW。** 獨立審查與 Product Owner 驗收尚未完成；M5-2B 未正式結案。M5 維持 37.5%，Overall 維持 43.75%，Completed Milestones 維持 4/10；TD-022 保持 OPEN。

**開場構圖／焦點鎖定調整**：依參考圖將 Active Unit 放在可用戰場區左下。旋轉／縮放保持鎖定；COMMAND 的空白點擊才解除焦點、隱藏角色 CG／HUD 並開放平移。場上角色／Timeline 或 PAS 換手可重新鎖定。真實 WebGL 在 1412×713 驗證開場構圖、旋轉／縮放、空白解除與角色／Timeline 回復，PAS Active Unit 未變。`npm test -- --test-concurrency=1` 297/297 PASS；預設並行模式重跑有一次逾時中止。Lint、Build 與 CRLF-aware Diff Check PASS；Build 保留既有 chunk-size 警告。以下保留相機初版的驗證紀錄；未涵蓋情境與 PO 驗收狀態不變。

- **Repository Baseline**：branch `main`；HEAD／`origin/main` 均為 `8ae9f928ecf0712a3947c5c6a20d41733c8a90a7`。最新已驗證 CI／Pages Run `44722441270` 對應此已提交 HEAD，不包含目前未提交程式與文件異動。
- **Implementation**：新增 `BattleCameraController`、集中 `battleCameraConfig` 與相機投影／阻尼數學；PAS 換手優先聚焦新 Active Unit，合法 COMMAND／Timeline 檢視聚焦檢視單位；以 `UnitPlaceholder` 外層 Group 世界 Transform 跟隨移動。保留固定俯角與既有左鍵平移／右鍵旋轉／滾輪縮放；手動操作中止自動跟隨，後續明確檢視或 PAS 換手再恢復聚焦。安全取景依實際 Canvas、HUD／CG／Timeline Rect 更新，支援 Reduced Motion 及 Observer／Listener／Frame lifecycle 清理。ATTACK 目標點擊仍更新目標檢視呈現，但不發出一般檢視相機請求。
- **Core Boundary / Regression**：沒有修改 PAS、Battle Reducer、攻擊合法性／傷害、AI 或 Outcome。修正 Camera Integration 中 ATTACK 目標點擊時保留原本角色 HUD 檢視語義、但不觸發 camera inspection；Production Route 測試確認攻擊目標檢視與 PAS 換手後 Active Unit HUD／CG 同步。
- **Automated Verification**：`npm test` 296/296 PASS；`npm run lint` PASS；`npm run build` PASS，BattleScene chunk 1,035.66 kB，既有 >500 kB chunk-size warning 保留；`git -c core.whitespace=cr-at-eol diff --check` PASS。
- **Browser Verification — Real WebGL**：COMMAND 下從 Timeline 檢視迪歐，HUD／CG 聚焦迪歐、PAS Active Unit 仍是奧黛且輪盤隱藏；點回奧黛恢復輪盤。點擊 3D 敵人改變 Inspected Unit，Active Unit 不變。實際 Move 後顯示 Undo，執行 Undo 返回原位；過程輪盤投影隨角色位置改變。左拖平移、右拖旋轉與滾輪縮放後，輪盤仍在角色投影附近。Standby 後 PAS 切換到迪歐，HUD、CG、Active Timeline 與輪盤同步更新；迪歐 Standby 後真實 Enemy AI 推進至敵方行動，觀察到哥布林對迪歐造成 5 點傷害，敵方 HUD／Timeline 更新，AI 階段後回到奧黛行動。從戰場返回主選單再進入新測試場，Active／HUD 重設為奧黛，只有 1 個 Canvas、1 個 Action Portal 與 1 個 Indicator Portal。真實 WebGL viewport 由 2560×1440 縮至 1280×720、再調至 1920×1080，輪盤持續錨定至新安全區的 Active Unit 投影；量測的頁面均無水平溢位。另量測 1280×720、1920×1080、2560×1440、390×845、845×390 viewport，頁面均無水平溢位；此為桌面瀏覽器 viewport 調整，不等同實體手機驗收。
- **Browser Limitations**：未於真實瀏覽器驗證 Reduced Motion、完整攻擊／Cancel Attack 的相機邊界、敵方 AI 移動中的相機跟隨、角色死亡／失效焦點回退及終局 Restart；亦未完成所有邊界安全區與長時間 OrbitControls 阻尼情境。Portal 的 Route Re-entry 單例已實測，但 Observer disposal 仍只由 lifecycle／React integration 測試覆蓋。上述仍為 PARTIAL／NOT VERIFIED，不由 DOM Fixture 或 Automated Tests 代替 Browser PASS。
- **Git / Status**：所有異動未 staged、未 Commit／Push；保留開始時 `docs/DEVELOPMENT_STATUS.md` 的使用者中繼資料異動。M5-2A 結案、TD-022 OPEN 與既有死亡／終局 Restart Browser 限制均未改寫。

## M5-2A Formal Closure — 2026-11-20

**Status：COMPLETED — FORMALLY ACCEPTED WITH LIMITATIONS。** M5-2A Patch 1／2 已通過 Product Owner Browser Acceptance 與 GitHub Independent Code Review；正式結案不代表角色死亡、終局 Restart 等 Browser Verification 全項已補驗。

- **Verified Closure Baseline**：Branch `main`；Commit `2b46eeaf02135e413bbe59b674d4d95045a136a8`；HEAD 與 `origin/main` 一致。
- **GitHub Evidence**：GitHub Actions Run [44714442975](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44714442975) SUCCESS；GitHub Pages Deployment SUCCESS；CI 不包含本次結案文件同步異動。
- **Review / Acceptance**：GitHub Independent Code Review **APPROVED**；Product Owner Browser Acceptance **APPROVED**。
- **Scope**：M5-2A 包含角色指令輪盤、單位檢視、水平行動順序軸、CG／肖像映射、回合交接及 2K／小螢幕 Presentation Refinement。Battle Core、PAS 排序與推進、Attack／Damage、AI、Outcome、Camera Controller 與使用者素材未由本次結案文件工作修改。
- **Limitations**：TD-022 維持 OPEN；PAS 尚未提供可靠的 per-unit 已行動／未行動契約，不宣稱 gray-out 已完成。角色死亡、終局 Restart、部分長尾 Browser Verification 保留 PARTIAL／NOT VERIFIED；此類限制不因正式結案而回溯改寫為 PASS。
- **Progress**：M5 為 37.5%，Overall 為 43.75%，Completed Milestones 維持 4/10。M5-2B 維持 **PENDING — UP NEXT**；UX-006 Active Unit Camera Framing 仍屬 M5-2B。
- **Git Scope**：本次僅同步正式結案文件，不修改 Production Code、Tests、Assets 或 Camera Controller，不執行 Commit／Push。

### 戰鬥提示收斂與 Timeline 敵軍紅框 — 2026-11-20

- **Implementation**：將戰鬥橫幅收斂為 Confirmed Damage Result，只顯示「誰對誰造成多少傷害」；移除活動、ATTACK 目標、距離、實際扣除與死亡補充文字。Timeline 敵軍卡片固定紅色外框，未選取時固定、選取後紅框脈動且不改藍框。
- **HUD Cleanup**：移除「選取目前角色以使用指令」及「敵方行動中／等待戰鬥行動」等 HUD 提示渲染；角色 HUD 只保留人物、資源、屬性與指令控制。右側攻擊範圍／攻擊力／防禦力／行動力靠右；HP／SP 使用相同寬度與左對齊基準。
- **2K HP／SP Correction**：不改動 HP／SP 原本的左側渲染起點；僅以較長條長呈現相同數值欄位。2K 攻擊範圍與右側三屬性改用固定等距欄位，不把攻擊範圍拉向身份欄或破壞既有 column spacing。
- **Verification**：桌面 1282×720、2K 2560×1440、手機 390×846 實測橫幅置中、頂部保留邊距且無水平溢位；2K HP／SP 實測同寬，右側資訊靠右；哥布林卡片實測紅色邊框，選取後紅框脈動、無藍色 outline，取消選取後脈動停止。傷害與敵軍 faction 回歸測試、Lint、Build、Diff Check 通過。

## M5-2A Battle Interaction UI — Implementation & Verification — 2026-11-20

**Status：IMPLEMENTED — PENDING REVIEW。** Product Owner Acceptance 與正式結案尚未完成；M5-2B Camera System 未開始。M5 維持 25%，Completed Milestones 維持 4/10，Overall 維持 42.5%。

- **Environment / Baseline**：Windows；branch `main`；工作起始 HEAD／本機 `origin/main` tracking ref `1955038135d8781f64312cdaeb29c5522842e7e7`；未 Fetch，因此未確認遠端即時狀態。既有 GitHub Actions Run `44647602225` 是較早的 M5-1 baseline CI，不能代表本次未提交異動。
- **Implementation**：加入五方向 Attack／Skill／Move-or-Cancel／Item／Standby 輪盤；Skill／Item disabled；既有 Undo 與 MOVE Mode Cancel 分流。Battle Runtime 的 `inspectedUnitId` 僅為本地呈現狀態；Timeline 與世界角色查看不改 `selectedUnitId`／Active Unit。右下角軸採正式 PAS Active Unit、`calculateActionValue()` 及 `predictUpcomingTurns()` 資料，最多八格、無虛構補位。CG keyed entry animation 支援 Reduced Motion；UI 使用既有圖示與 Asset Resolver。
- **Asset Preflight**：規格所列 `public/images/battle/{女主,男主,哥布林}.png` 路徑不存在；同名素材實際在既存未追蹤 `public/assets/images/battle/`。以 Vite Base URL 從該路徑載入並在瀏覽器確認；依工作樹保護要求未修改／移動／暫存素材。正式 UI 圖示沿用 `public/assets/images/ui/` 現有檔案。
- **PAS Contract Limitation**：PAS 有 Active Unit、正式 timeline 與未來預測時間值，但沒有每單位「本輪尚未／已行動」狀態。未猜測 gray-out；AC-A12 為 PARTIAL，已登錄 TD-022。M5-2A 不修改 Battle Core、PAS、AI、Reducer、Camera Controller 或 OrbitControls 契約。
- **Automated Verification**：`npm test` 281/281 PASS；`npm run lint` PASS；`npm run build` PASS（保留既有 >500 kB Battle Chunk warning）；`git -c core.whitespace=cr-at-eol diff --check` PASS。純 `git diff --check` 將既有 CRLF 行尾誤判為 whitespace；使用符合 CRLF 的 repository check 設定驗證。
- **Independent Code Review**：No significant issues found；此結果不代表 Product Owner Acceptance。使用者驗收仍 PENDING。
- **Browser Verification**：使用真實 WebGL 戰場，不是 DOM Fixture。桌面 1281×720、手機直向 390×845、橫向 845×390；均無水平溢位。確認五個指令位置與 Skill／Item disabled、Move Mode Cancel、完成移動後 Undo、Attack Mode Cancel、Standby；Standby 後敵方 AI 回合移動並對迪歐造成 10 HP 傷害。Canvas 點擊迪歐／哥布林及 Timeline 點擊只更新檢視資料，PAS Active Unit／操作輪盤仍分別為當前 Active Unit。驗證八格上限、正式順位／時間值、三角色圖片、邊緣淡化與快速切換僅留一個 CG。Reduced Motion 下 CG `animation-name:none`；Browser Fixture 中攔截角色圖片請求後 HUD／Timeline Fallback 正常，解除攔截並 reload 後圖片復原。右鍵拖曳實際旋轉鏡頭。
- **Browser Limitations**：Attack Mode 確認按鈕在實際畫面因合法目標數為 0 保持 Disabled，未於本次 Browser 完成確認攻擊；攻擊合法性／結算由既有 Automated Tests 覆蓋。未於 Browser 觸發角色死亡或終局 Restart；Route reload/re-entry 已確認檢視回到 Active Unit，但不等同終局 Restart 驗收。Product Owner Acceptance 未執行。
- **Known Issue**：三張圖片的要求路徑未存在，改用實際提供且已確認可載入的 `public/assets/images/battle/`；需 Product Owner 確認資產位置符合預期。已行動友軍 gray-out 等待 TD-022 資料契約。
- **Git**：未暫存、Commit、Push、Checkout 或修改任何使用者圖片；工作樹包含本任務程式／測試／文件異動與原有未追蹤圖片。

## M5-2A Patch 1 — Interaction Consistency & UI Refinement — 2026-11-20

**Status：IMPLEMENTED — PENDING REVIEW。** Baseline 為 `main`／`origin/main` `8b0aa67776c66cb4b0585a1ec887e598a1ca9d30`；M5-2A 與 M5-2B 狀態不變，M5 維持 25%、Overall 42.5%。

- **Interaction Consistency**：共享 Inspection Policy 禁止 MOVE Mode 的世界與 Timeline 檢視切換；COMMAND 檢視非 Active Unit 時世界錨點輪盤立即隱藏，重新檢視 Active Unit 後依原授權恢復。Cancel Attack 在 Session Presentation Boundary 回復 Active Unit。正式 Reducer 的 ATTACK 單位選取現在對非法目標清除 `selectedAttackTargetId`，Confirm Attack 立即 Disabled；重新選合法目標後可確認。移動後 Undo Record 不受檢視切換影響。
- **UI Refinement**：Timeline 與 HUD 在桌面共同分配底部寬度；移除可見標題、順位及 Scrollbar。`ResizeObserver` 依實際容器寬度只渲染完整卡片，最多八格。友軍 Timeline 使用小肖像、HUD 大型展示恢復 M5-1 `assets/images/cg/hero/*-戰鬥1.png`；敵方 HUD 與 Timeline 使用哥布林肖像。輪盤由 Drei `Html` 錨定 Active Unit Group，投影跟隨角色與既有 OrbitControls，並以量測的 HUD／Timeline Rect 避免 UI 碰撞；Camera Controller 未修改。
- **Automated Verification**：`npm test` 284/284 PASS、`npm run lint` PASS、`npm run build` PASS；Build 保留既有 1,028.41 kB Battle chunk >500 kB warning。`git -c core.whitespace=cr-at-eol diff --check` PASS。
- **Independent Code Review**：初次 review 發現 Landscape Active Unit 切換可能與 Timeline 重疊；Patch 加入量測保留區與投影避讓後，Follow-up Review **No significant issues found**。Product Owner Acceptance 仍 PENDING。
- **Real WebGL Browser Verification**：確認非 Active Unit 檢視隱藏輪盤；MOVE Mode 點友軍與 Timeline 均不改檢視；完成移動後檢視切換保留 Undo。ATTACK 先選哥布林 A 再點迪歐，HUD 顯示迪歐、正式目標清空、Confirm Disabled；Cancel 回復奧黛 CG 與輪盤；重新選敵人後實際造成 23 點傷害並切換 PAS Active Unit。輪盤在角色完成移動及右鍵旋轉、滾輪縮放、左鍵平移後重新投影。Desktop 1281×720 顯示 8 格；Mobile 390×845 顯示 6 格；Landscape 845×390 顯示 5 格，HUD／Timeline／輪盤無重疊與水平溢位。敵方使用哥布林肖像，Reduced Motion 為 `animation-name:none`，缺圖 Browser Fixture 後 Fallback 正常並可恢復。Route exit 移除 Action Portal，re-entry 建立單一 Portal。
- **Browser Limitations**：Enemy AI 已實際推進，未於本次 Patch 1 Browser 觸發角色死亡或結果 Overlay；終局 Restart 只由既有 Automated Route／Session Tests 覆蓋，Browser BV-P07／BV-P15 維持 PARTIAL。Product Owner Acceptance 尚未執行。
- **Scope / Git**：只修改 Presentation、最小 Attack Target Selection Consistency、Tests 與文件；未修改 PAS 排序／推進、AI 決策、傷害、Outcome、Camera Controller 或依賴。TD-022 維持 OPEN。未 Commit／Push，素材未修改。

## M5-2A Patch 2 — Timeline Layout & CG Background Continuity — 2026-11-20

**Status：IMPLEMENTED — PENDING REVIEW。** 以 Patch 1 未提交工作樹為基礎；M5-2A 維持待審查、M5-2B 未開始，M5 為 25%、Overall 為 42.5%。Product Owner Acceptance 未執行。

- **Timeline Layout**：獨立的不可見容量量測區監聽實際可用內容寬度；時間軸依完整卡片數使用內容寬度並靠右排列，最多八格，空間不足只呈現完整的前 N 格。無橫向可捲動內容；保留正式 PAS 排序／行動值、Active／Inspected 標示及卡片檢視 callback。
- **CG Background**：新增固定於 HUD 左側、與角色立繪容器分離的背景漸層層。友軍仍載入 M5-1 原始大型 CG，敵軍仍使用 Goblin 肖像；背景尺寸不隨陣營、圖片比例或快速切換改變，角色圖層動畫及 Reduced Motion 規則不變。
- **Automated Verification**：`npm test` 284/284 PASS（包含 Timeline 桌面／緊湊尺寸的完整卡片邊界測試）；`npm run lint` PASS；`npm run build` PASS；`git -c core.whitespace=cr-at-eol diff --check` PASS。Build 的 Battle chunk 為 1,028.62 kB，既有 >500 kB warning 保留。
- **Real WebGL Browser Verification**：桌面實際視口 1282×720 顯示 8 格，Timeline 約 608px 寬、右側約 16px 安全距離。直向手機 390×845 顯示 6 格、約 330px 寬；橫向 846×390 顯示 5 格、約 326px 寬；三者皆無頁面水平溢位。直向手機 HUD 與 Timeline 垂直分離；橫向版 Timeline 位於 HUD 上方。角色依序切換奧黛→哥布林→迪歐→哥布林，以及快速連續切換時，背景量測寬度維持約 820px、角色圖層僅有一張已掛載圖片，正式友軍 CG／敵軍肖像 URL 正確。Reduced Motion 下動畫名稱為 `none`；Move／Cancel Move、Attack／Cancel Attack、Timeline 點擊均正常。
- **Browser Evidence / Limitations**：已擷取真實 WebGL 戰場的友軍奧黛與敵軍哥布林畫面。使用者提及的最新兩張參考截圖未隨本次 Session 提供；因此視覺檢查依正式文字規格與實際瀏覽器頁面完成，不能聲稱已逐像素比對該兩張圖。Agent Browser 驗證不等同 Product Owner Visual Acceptance，仍待使用者驗收。
- **Scope / Git**：只調整 Timeline／CG Presentation、對應測試與本狀態文件；沒有修改 PAS、Battle Core、攻擊互動、Camera Controller、使用者圖片或依賴。Patch 1 與 Patch 2 異動均未 Commit／Push；TD-022 保持 OPEN。

### M5-2A 追補修正 — 回合交接同步 HUD／CG

- **Implementation**：暫態單位檢視只在原 PAS `turnId` 生效；攻擊結算後由正式 PAS 推進回合時，HUD／CG 同步切換至新的 Active Unit。回合內仍可手動檢視角色，不修改 PAS、Battle Core 或 Camera Controller；未提交，仍待 Product Owner 驗收。
- **Verification**：真實 WebGL 戰場中，奧黛選取並攻擊哥布林 A，造成 23 點傷害；換手後 HUD、CG、輪盤與 Timeline 同步顯示迪歐。新增 Production Route 回歸測試，亦確認新回合仍可重新檢視哥布林 A，不影響 Active Unit。`npm test` 285/285、Lint、Build 與 CRLF-aware Diff Check 均通過；既有 Battle chunk >500 kB 警告保留。

### M5-2A 視覺微調 — 行動軸光暈與中空輪盤

- **Implementation**：Timeline 的目前行動金框與同一角色的預測卡片藍框共用脈動節奏；Reduced Motion 下改為靜態。半透明深藍輪盤以金線分隔五個扇形按鈕，中心保留 Canvas 點擊；原指令位置、權限與快捷操作範圍不變。
- **Verification**：真實 WebGL 驗證三張奧黛卡片同步脈動、切換檢視仍追蹤奧黛、Reduced Motion 靜止，以及五個扇形命中、中心命中 Canvas、Hover／鍵盤焦點與 Attack／Move 進入及取消。`npm test` 285/285、Lint、Build 和 CRLF-aware Diff Check 通過，保留既有 >500 kB chunk 警告。未提交，Product Owner 驗收待確認；里程碑狀態與進度不變。

- **Timeline Action Value Display**：行動軸右下角只以整數格式呈現正式數值；底層 PAS／預測數值不變，不新增回合運算。瀏覽器確認顯示 `0、33、67、133`，格式化單元測試通過。

### M5-2A 視覺微調 — 2K 桌面尺寸

- **Implementation**：為寬度 2100px 以上且高度 1000px 以上的桌面版增加獨立 HUD／Timeline 放大規則。2560×1440 實測角色資訊欄約 973px、Timeline 約 754px、肖像圖標約 84px；狀態欄文字、資源條、屬性圖示及行動值同步放大。1920 以下及手機版規則保持原尺寸。
- **Browser Verification**：2560×1440 無頁面水平溢位，HUD 與 Timeline 無重疊；小螢幕模式未套用 2K 放大規則。尚待使用者最終視覺驗收。

以下 M5-1 初始實作與 Patch 1／2 區段保留當時的實作狀態、測試結果及 Browser 限制；其 PENDING／PARTIAL／NOT VERIFIED 記錄為歷史證據，現行結案決策以本記錄為準。

## M5-1 Battle HUD Redesign — Initial Implementation Snapshot (Pre-Patch 1)

以下保留 Patch 1 前的實作與 Agent Browser Verification 歷史紀錄，不代表本次 Patch 1 的瀏覽器結果。

- **Status**：IMPLEMENTED — PENDING REVIEW。尚未完成 Independent Review 或 Product Owner Browser Acceptance，不代表 M5-1 或 M5 已正式結案。
- **Runtime scope**：Production Runtime 使用 `BattleHUD` 取代舊 Debug HUD／Timeline 掛載；正式 Result Overlay、Session／Reducer、戰鬥規則與 callback 來源不變。HUD 依 Active Unit 顯示立繪、HP／SP、攻擊／防禦／移動、無狀態效果提示、靜態攻擊模式縮圖及既有操作按鈕。
- **Roster**：初始我方調整為保留 ID／職業／格位的迪歐（knight）與奧黛（assassin）；三隻 Goblin 的配置不變。其他職業 Registry／Factory 保留，不調整職業屬性。
- **Automated Verification**：`npm test` 276/276 PASS；Production Route Integration 7/7 PASS；`tests/battle.hud.test.mjs` 4/4 PASS；`npm run lint` PASS；`npm run build` PASS。Build 的 Battle Chunk 約 1,014 kB，既有 >500 kB chunk warning 仍在。
- **Agent Browser Verification**：PARTIAL。於 1920×1080、1366×768、1280×720、390×844、844×390 viewport 操作；HUD 角色資料／立繪及圖示載入、面板與按鈕留在 viewport、面板與立繪無水平重疊、文件無水平溢位；實際操作 Move／Cancel、Attack／Cancel、Standby 及返回主選單。五種尺寸均顯示 WebGL fallback，無法驗證 3D 戰場、OrbitControls 或棋盤 Pointer 互動；Browser Screenshot Capture 不可用。觀察到 Three.js `Clock` deprecated 與 `PCFSoftShadowMap` removed warnings。
- **Traceability / Scope**：HUD helper 的四項測試覆蓋角色資料與 Base Path、敵方立繪隔離、資源百分比、防止攻擊縮圖偏離正式 attack geometry；Production Route Integration 覆蓋正式 Runtime HUD 更新及操作 callbacks。M5-2～M5-4 仍 PENDING；M5-5 在目前 Roadmap 尚未定義。UX-001～005 保持 PENDING、Target Milestone 為 M5-3。
- **Acceptance / Git**：Product Owner Acceptance PENDING。M4 維持 100%、Completed Milestones 4/10、Overall 40%。M5-1 工作樹異動尚未提交，沒有對應的新 Commit／CI；M4 Formal Closure Commit／Run 僅為先前驗證基準。

## M5-1 UI Refinement Patch 1 — Implementation & Verification

- **Status**：IMPLEMENTED — PENDING REVIEW。Independent Review 與 Product Owner Acceptance 尚未完成；M5、Overall、M4 進度與既有驗收狀態不變。
- **Presentation changes**：桌面角色 CG 維持原比例並以 `86svh` 高度呈現；依 viewport 縮小。ATK／MOV／DEF 使用現有 UI 圖示與 Active Unit 正式資料；移除空狀態效果容器（BattleUnit 目前沒有狀態效果資料）。我方 overhead name／HP 只在 presentation 隱藏；敵方標籤保留。
- **Active Unit Indicator**：Drei `Html` 綁定單位世界座標，依 PAS `activeUnitId` 更新，並輸出至 pointer-events-none overlay；浮動動畫支援 `prefers-reduced-motion`。不修改 Battle Core、PAS、Unit Position 或 Restart Authority。
- **Automated Verification**：`npm test` 279/279 PASS（相較 Patch 前 276 項新增 3 項 Unit Presentation 測試）；Production Route Integration 7/7 PASS；HUD mapping 4/4、Unit Presentation 3/3 PASS；Lint PASS；Production Build PASS。Battle Chunk 1,022.08 kB，保留 >500 kB chunk warning。`git -c core.whitespace=cr-at-eol diff --check` PASS。
- **Browser Verification**：在實際 WebGL 可用時，桌面 CG 實測為 viewport 高度 86%；六種 desktop／mobile viewport 的文件無水平溢位，mobile CG 縮小至 24%／45%。實際觀察 Active Unit 從奧黛切換至迪歐後指標跟隨、敵方標籤保留；pointer probe 在立繪覆蓋區收到 Canvas `pointerdown`；Reduced Motion 時指標 `animation-name: none`。透過正式主選單離開戰場時 HUD、portal 與 indicator 卸載，重新進入後新 Session 回到奧黛並重新顯示 indicator。
- **Browser Limitations**：未在瀏覽器完成 Move／Attack／Cancel 與 Victory／Defeat／Restart 結果流程；對應 callback／Session 行為由自動化測試涵蓋。P-BV10 僅完成六種 viewport 的幾何／溢位量測，未完成各尺寸的視覺與操作驗收，標記 PARTIAL。多次路由及 reload 後 Browser 顯示 WebGL fallback；其後的診斷曾嘗試在 WebGL2 Canvas 讀取另一種 context，產生 context-type warning，因此該晚期 Browser 狀態不作為乾淨的 GPU／Console 證據。P-BV09、P-BV11 為 NOT VERIFIED，P-BV12 為 PARTIAL；不宣稱 GPU／WebGL lifecycle 通過。
- **Scope / Acceptance**：M4 automated regression 279/279 PASS；不代表 P-BV11 的瀏覽器勝敗流程已驗證。M5-2～M5-4 仍 PENDING，M5-5 未於 Roadmap 定義；Product Owner Acceptance PENDING。工作樹未提交，沒有本次 Commit／CI。

## M5-1 UI Refinement Patch 2 — Styling Update

- **Status**：IMPLEMENTED — PENDING REVIEW；Patch 2 不改 M5、Overall、M4 進度或驗收狀態。
- **HUD / CG / Indicator**：桌面面板左偏約 5vw、寬 68vw（上限 1280px）、z-index 3；手機維持底部緊湊全寬版。桌面 CG 維持 `86svh` 與 `object-fit: contain`。CG 後方 pointer-events-none 漸層遮罩延伸至完整 viewport 高度，寬度依立繪原始比例計算；左側 alpha 30%、45% 位置 20%，向右淡至透明，手機定位包含立繪底部避讓距離。底部 HUD 採用水平黑色漸層（alpha .7 至 .5 at 80% 至 0）及 48px 圓角，無外框、陰影及 backdrop blur。指標由 110px 調為 62px（約 56%），手機由 88px 調為 50px；Html 錨點由 y=2.05 調至 1.88，不修改 Unit Position／PAS。
- **Portrait Mapping / Test**：沿用既有 `女主-戰鬥1.png` mapping（1024×1536），本 Patch 不改資產選擇；同步 `battle.hud.test.mjs` URL assertion 以符合目前來源。Patch 1 的歷史紀錄保留原狀。
- **Browser Verification**：桌面 1232×862 實測 HUD 寬 68%、左距 5%、CG 高 86%；箭頭實測約 62px。桌面及手機直向 390×845、橫向 846×390 遮罩均延伸至 viewport 邊緣（誤差小於 1px）、寬度依立繪比例且無水平溢位。本次 HUD 背景在 desktop/mobile 實測為目前 CSS 的水平黑色漸層，border-radius 計算值為 48px；手機操作按鈕仍在 viewport 內。先前 Patch 2 已確認 CG／gradient 區域 pointer event 到達 Canvas、Move／Cancel、Attack／Cancel、Standby 操作正常與 Reduced Motion 停用動畫；本次 CSS 調整未重測操作流程。Result Overlay 未在瀏覽器觸發驗證；勝敗與 Restart 自動化回歸由既有 `npm test` 覆蓋。
- **Automated Verification**：先前 Patch 2 基準 `npm test` 279/279 PASS、Lint PASS；此輪 CSS 後續調整 `npm run build` PASS（Battle Chunk 1,021.91 kB，>500 kB chunk warning 保留）及 Diff Check PASS；未重跑 tests／lint。Three.js `Clock` deprecated 與 `PCFSoftShadowMap` removed warnings 為既有警告。
- **Scope / Git**：僅調整 HUD／CG／indicator presentation CSS、indicator anchor 與 portrait URL test assertion；未修改 Battle Core、Roster、Unit Position、AI、PAS、Session Restart 或使用者素材。工作樹未提交；不 Commit／Push。

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
| M4-4B Product Owner Browser Acceptance | PASS — 10/10 | Product Owner 於 2026-11-20 確認 BV-B01～BV-B10 PASS；不回溯改寫 Agent 原始 WebGL fallback 與 PARTIAL／NOT VERIFIED 紀錄 |
| M4-4B Independent Review / Conditional Closure | APPROVED WITH LIMITATIONS / APPROVED | Architecture Review APPROVED；Independent Code Review APPROVED WITH LIMITATIONS；Conditional Closure APPROVED；RC-M4-4B-01～06 APPROVED、07 PARTIAL（移交 M4-4C）、08 文件修正已完成 |
| M4-4B Automated Test / AC Traceability | 28 PASS + 2 PARTIAL / 36 PASS + 1 PARTIAL | B-T06、B-T30 維持 Automated PARTIAL；AC-B07／08 由 PO BV-B06 補充為 PASS、AC-B09 由 PO BV-B09 補充為 PASS、AC-B30 維持 PARTIAL |
| M4-4C Automated Tests | 271/271 PASS | VA1 保留原有 270 項並新增 1 項 Production terminal Route unmount test |
| M4-4C Production Route Integration | 6/6 PASS | 正式 App／BattleScene／Session Host／Scenario／Reducer／Runtime wiring；只替換 WebGL／純視覺 Adapter |
| M4-4C ESLint / Production Build | PASS / PASS | `npm run lint`、`npm run build`；Build 保留既有 >500 kB Battle Chunk warning |
| M4-4C Agent Browser Regression | PARTIAL | 既有 Move／Undo／Standby、合法攻擊及敵方移動證據保留；VA1 完成 2 次 warm-up、10 次量測 Route 往返；其他終局／Restart／Modal／Mobile 項目依 BV Matrix |
| M4-4C WebGL Resource Measurement | PARTIAL | 2 次 warm-up、10 次量測及 1 次額外 renderer inspection；14 個 Canvas／Context Identity 均觀察到對應 Context Loss；最終 Menu 0 個 Canvas；未取得有效 `renderer.info.memory`，不宣稱 GPU Disposal 或無 leak |

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

> 歷史快照：本節記錄 M4-4A Formal Closure 文件同步時的專案狀態；後續 M4-4B 結案狀態見緊接其後的 Conditional Closure 紀錄。

- **Formal Acceptance Date**：2026-11-20。M4-4A End Condition Framework & Battle Outcome 為 **COMPLETED — FORMALLY ACCEPTED**；Patch 1 為 **COMPLETED — ACCEPTED**；Final Review Correction 為 **COMPLETED — VERIFIED**。
- **Reviews**：Architecture Review APPROVED；Independent Code Review APPROVED；Product Owner Acceptance APPROVED；Formal Closure APPROVED。CR-M4-4A-01～05 全數 CLOSED。
- **Product Owner Browser Acceptance**：M4-4A Patch 1 Post-Patch Browser Regression，BV-A01～A05 5/5 PASS — ACCEPTED（2026-11-20）。Patch 前 Product Owner 5/5 PASS 與 Agent 原始 Browser PARTIAL／NOT VERIFIED 紀錄仍分列保留。
- **Verified Repository / CI**：Branch `main`；M4-4A Formal Closure 文件後續納入 Repository Commit `41b43c77e849276847c8c643deedd3a7ca0b0747`；GitHub Actions Run `44596893220` SUCCESS。M4-4A Feature Commit 為 `1cce94613791548cc1717942b72d1513487db857`；Commit `5048fea...`／Run `44595045755` 保留為 Formal Closure 當時的歷史基準。CI 只涵蓋已提交內容，不取代本機測試。
- **Verification Baseline**：246/246 Automated Tests、12/12 React Integration Tests、AC 32/32、原始 Test Traceability 28/28、Patch Test Traceability 9/9 PASS；Lint、Build、Diff Check PASS。Build 的既有 >500 kB Battle Chunk warning 保留。
- **Architecture Constraints**：Strategy／DI、Configuration Immutability、明確 Battle Session、Initial ACTIVE、Outcome Trigger Boundary、Motion／Reservation Barriers、DEFEAT Priority、Pre-PAS Resolution、Terminal Guards 均維持原契約。Restart Session Isolation、Save／Load Serialization 與 Round Limit Semantics 未實作。
- **Technical Debt / UX Backlog**：本次不調整相關狀態；TD-018、TD-021 維持 OPEN，TD-019 維持 CLOSED — M4-3 FORMAL ACCEPTANCE；UX Backlog 未變更。
- **Roadmap / Scope**：M4-4A 已完成；此 Formal Closure 的文件異動後續已納入 `41b43c7`。目前 M4-4B 為 IMPLEMENTED — PENDING REVIEW，M4-4C PENDING DEVELOPMENT；M4-4 整體仍 IN PROGRESS。M4 維持 75%、Overall 37.5%。

## M4-4B Implementation & Conditional Closure — Historical Snapshot (Superseded by M4 Formal Closure)

### Environment / Baseline

- **Branch / HEAD**：`main`／`e299fa48e28d16e24aadba9cc7925bedf4d53895`；`origin/main` tracking ref 相同，Conditional Closure 開始前工作樹乾淨。
- **Verified Repository / CI**：Commit `e299fa48e28d16e24aadba9cc7925bedf4d53895`；GitHub Actions Run [44605672030](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44605672030) SUCCESS，Branch `main`、Head SHA 相符。
- **Implementation Scope**：M4-4B 已提交異動 16 個檔案，Battle Core Modification 0；本次 Closure 為文件同步，無 Runtime Source Code 或 Test Source Code 異動。
- **Local verification**：`npm test` 265/265 PASS；`npm run lint` PASS；`npm run build` PASS；本次 build 保留既有 >500 kB Battle Chunk warning。`tests/battle.animation.react.integration.test.mjs` 與 `tests/battle.session.test.mjs` 合計 31/31 PASS（29 React Integration + 2 Session tests）。
- **Agent Browser Verification (historical)**：Battle Route 載入並顯示初始 HUD／資訊及 WebGL fallback；Agent BV-B01、BV-B10 PARTIAL，BV-B02～B09 NOT VERIFIED。保留原始觀察，不回溯改寫。
- **Final status**：Architecture Review、Product Owner Acceptance 與 Conditional Closure APPROVED；Independent Code Review APPROVED WITH LIMITATIONS。M4-4B **COMPLETED — CONDITIONALLY ACCEPTED**；M4-4C **NEXT — PENDING DEVELOPMENT**。未啟動 M4-4B Patch 1，亦未宣告 M4-4 Formal Acceptance。

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
| B-T30 | 原 `Session remount and unmount clean old controller Frame subscriptions`；VA1 `Production Route unmounts terminal Victory and Defeat Overlays without leaking old Session callbacks` | 原測試仍只驗證 harness cleanup；VA1 補足正式 App／Session／Overlay Route cleanup、Frame／Canvas 計數與 stale callback isolation，但不測量 GPU disposal；GPU lifecycle limitation 核准延後至 TD-010 | PARTIAL — APPROVED DEFERRAL |

### AC-B01～AC-B37 Verification Matrix

| AC | Result | Evidence / Limitation |
|---|---|---|
| AC-B01 ACTIVE 不顯示 Overlay | PASS | B-T01 |
| AC-B02 VICTORY UI 正確 | PASS | B-T02 |
| AC-B03 DEFEAT UI 正確 | PASS | B-T03 |
| AC-B04 共用 Result Overlay Component | PASS | Production Runtime 同一 `BattleResultOverlay` 接收兩種正式 Outcome |
| AC-B05 僅依據正式 Outcome 顯示 | PASS | Runtime 以 `outcome !== null` 條件 render；B-T01～04 |
| AC-B06 背景戰場保留 | PASS | Runtime 中 Canvas 與 Overlay 同屬場景；Overlay 不替換 Battle Runtime |
| AC-B07 終局背景操作隔離 | PASS | PO BV-B06 Terminal Input Protection PASS；Agent 原自動化／瀏覽器證據保留原狀 |
| AC-B08 Modal Keyboard／Focus | PASS | PO BV-B06 Terminal Input Protection PASS；B-T06 自動化覆蓋仍為 PARTIAL |
| AC-B09 Desktop／Mobile 版面 | PASS | PO BV-B09 Responsive Layout PASS |
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
| AC-B30 Controller／Effect Cleanup | PARTIAL — APPROVED DEFERRAL | VA1 補足正式 Route／Session／Overlay unmount、Frame cleanup 與 stale callback evidence；WebGL／GPU disposal 仍未驗證，核准移交 TD-010 |
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

實際 Browser Screenshot 顯示 Battle Route 背景與 HUD，但沒有 3D 棋盤／單位；DOM 另顯示 Canvas WebGL fallback。未據 Node／jsdom 證據宣稱視覺 PASS。當時 Product Owner Acceptance 尚待正式結果；後續 PO 驗收另列於下方，不回溯改寫此 Agent 紀錄。

> 上段為 Agent 原始 Browser Verification 快照，保留其 PARTIAL／NOT VERIFIED 狀態；以下為 Product Owner 後續獨立 Acceptance，不回溯改寫 Agent 結果。

### Product Owner Browser Acceptance — 2026-11-20

| BV | Product Owner Result |
|---|---|
| BV-B01 Normal Battle | PASS |
| BV-B02 Victory Overlay | PASS |
| BV-B03 Defeat Overlay | PASS |
| BV-B04 Victory Restart | PASS |
| BV-B05 Defeat Restart | PASS |
| BV-B06 Terminal Input Protection | PASS |
| BV-B07 Repeated Restart | PASS |
| BV-B08 Rapid Restart Input | PASS |
| BV-B09 Responsive Layout | PASS |
| BV-B10 Runtime Regression | PASS |

**Final Result：10/10 PASS — ACCEPTED。** 此為 Product Owner 提供的瀏覽器驗收結果，不是 Agent 自動化或 Agent Browser Verification 結果。

### Independent Review Findings

| Finding | Review Result | Closure Record |
|---|---|---|
| RC-M4-4B-01 | APPROVED | Independent review result recorded |
| RC-M4-4B-02 | APPROVED | Independent review result recorded |
| RC-M4-4B-03 | APPROVED | Independent review result recorded |
| RC-M4-4B-04 | APPROVED | Independent review result recorded |
| RC-M4-4B-05 | APPROVED | Independent review result recorded |
| RC-M4-4B-06 | APPROVED | Independent review result recorded |
| RC-M4-4B-07 | ACCEPTED WITH LIMITATIONS | Independent review accepted the residual WebGL Resource Lifecycle limitation and its deferral to TD-010 |
| RC-M4-4B-08 | CLOSED | Documentation correction and final disposition recorded by Formal Closure |

### M4-4C Remaining Verification — RV-M4-4B-01～03

These originated as deferred verification items, not confirmed defects. The Formal Closure disposition below supersedes the earlier pending-review state; RV-M4-4B-02 remains deferred to TD-010:

| ID | Evidence Collected | Current Status |
|---|---|---|
| RV-M4-4B-01 | Six Production Route Integration Tests include Victory／Defeat Overlay unmount, Runtime／Frame／Canvas cleanup, fresh Session and stale callback isolation; Agent Browser completed 2 warm-ups + 10 measured idle Route round trips. | CLOSED — VERIFIED |
| RV-M4-4B-02 | Read-only Browser identity sampling mapped C1/G1 through C14/G14 and observed matching Context Loss events; final Menu had 0 connected Canvas after 1.5 seconds. `renderer.info.memory` unavailable; disposal／long-duration stability deferred. | PARTIAL — DEFERRED TO TD-010 |
| RV-M4-4B-03 | Six Production Route Integration Tests use real App／Scene／Session Host／Scenario／Reducer／Runtime callback wiring, including ID collisions, AI／Death isolation, terminal Outcomes／Overlay unmount and Restart. WebGL／visual leaves remain test adapters. | CLOSED — VERIFIED |

### M4-4B Conditional Closure Decision — Historical (Superseded by M4 Formal Closure)

- M4-4B Implementation **COMPLETED**；Architecture Review **APPROVED**；Independent Code Review **APPROVED WITH LIMITATIONS**；Product Owner Acceptance **APPROVED**；Conditional Closure **APPROVED**。
- Automated Test Traceability remains **28 PASS / 2 PARTIAL**: B-T06 and B-T30 remain partial automated coverage. PO BV-B06 supplements Browser Acceptance for terminal input protection but does not upgrade B-T06 automated coverage.
- Combined Acceptance Criteria are **36 PASS / 1 PARTIAL**: AC-B07／B08 are PASS based on PO BV-B06; AC-B09 is PASS based on PO BV-B09; AC-B30 remains PARTIAL and transfers to M4-4C.
- Architecture contract remains Keyed Session Remount, Session-owned Reducer Dispatch, Scenario Factory Initialization, Generation-based Restart Idempotency, Native Modal Dialog, and Outcome Single Source of Truth. AI Capability Isolation is based on Runtime Dispatch ownership, not underlying Capability Session Binding; the latter is not claimed as implemented.
- M4-4B Patch 1 is not started. M4-4 Formal Acceptance remains PENDING. M4 remains 75%; Overall remains 37.5%.

## M4-4C Verification Record — COMPLETED WITH APPROVED LIMITATIONS

### C-T01～C-T36 Automated Test Traceability

`tests/battle.route.lifecycle.integration.test.mjs` directly mounts the Production App and route wiring. Its Vite test adapter replaces WebGL／Drei and pure visual output only; Session Host, Scenario Factory, Reducer, Outcome Resolver, Runtime callback wiring, Restart Handler, AI and Animation Controllers remain production implementations. Legacy combat contracts map to their existing focused tests; no prior assertions were removed or weakened.

| ID | Test File / Test Name | Actual Assertion Evidence | Result / Limitation |
|---|---|---|---|
| C-T01 | `battle.route.lifecycle.integration.test.mjs` — `Production App route entry, idle exit, and re-entry create isolated Sessions` | Hash route mounts Battle; Session is ACTIVE; Canvas and Frame callbacks mount. | PASS |
| C-T02 | Same test | Idle exit replaces Battle with Main Menu; Frame callbacks／Canvas reach zero; App listener remains singular. | PASS |
| C-T03 | `battle.route.lifecycle.integration.test.mjs` — `Production Runtime Move and Player callbacks with colliding IDs stay bound to the old Session` | Start real Move Motion, unmount Route, re-enter, replay old Finish／Cancel／Standby; new Motion and Turn references remain unchanged. | PASS |
| C-T04 | `battle.route.lifecycle.integration.test.mjs` — `Production Runtime Attack callbacks with colliding IDs stay isolated before and after Impact` | Unmount with pre-impact Attack Motion; old Impact／Complete／Abort do not change new Session Attack or HP. | PASS |
| C-T05 | Same Attack callback test | Advance real Frame Harness through Impact, unmount, re-enter and replay prior callbacks; new Attack／HP remain unchanged. | PASS |
| C-T06 | `battle.route.lifecycle.integration.test.mjs` — `Production Runtime Enemy AI and Death callbacks cannot mutate a re-entered Session` | Real lethal lifecycle creates Death Motion; old Death Complete／Abort and Impact Consume leave the new Session unchanged. | PASS |
| C-T07 | Same Enemy AI and Death callback test | Advance real Production AI to an enemy Motion／Attack; unmount and dispatch captured old AI action; new Motion／Attack／Turn references remain unchanged. | PASS |
| C-T08 | `battle.route.lifecycle.integration.test.mjs` — `Production Route unmounts terminal Victory and Defeat Overlays without leaking old Session callbacks` | Reaches VICTORY through the configured Production lifecycle, confirms Victory dialog, exits Route, verifies dialog／Runtime／Frame／Canvas cleanup, re-enters ACTIVE Session, and replays old callbacks without changing it. | PASS |
| C-T09 | Same terminal Route unmount test | Repeats the complete Route unmount／re-entry／stale callback assertions after a legal DEFEAT and Defeat dialog. | PASS |
| C-T10 | `battle.route.lifecycle.integration.test.mjs` — Production App route entry／exit test | Ten re-entry cycles produce distinct Sessions／Reducers, initial Unit snapshots and ACTIVE outcomes. | PASS |
| C-T11 | `battle.route.lifecycle.integration.test.mjs` — Move and Player callback test | Old Finish／Cancel with identical Motion／Turn／Unit IDs do not change the new Motion. | PASS |
| C-T12 | `battle.route.lifecycle.integration.test.mjs` — Attack callback test | Old pre-impact callback set cannot Impact the new Session or change target HP. | PASS |
| C-T13 | Same Attack callback test | Old Complete／Abort callbacks both before and after Impact cannot clear or alter a new Attack Motion. | PASS |
| C-T14 | `battle.route.lifecycle.integration.test.mjs` — Enemy AI and Death callback test | Old Death Complete／Abort cannot remove a new Death Motion with matching IDs. | PASS |
| C-T15 | Same Enemy AI and Death callback test | Old Consume Impact callback cannot clear the new Session's matching Confirmed Impact. | PASS |
| C-T16 | Same Enemy AI and Death callback test | Captured old Production AI Gateway action cannot change new Session Motion／Attack／Turn. | PASS |
| C-T17 | `battle.route.lifecycle.integration.test.mjs` — Move and Player callback test | Old Session Standby callback is replayed after re-entry; new Session Turn reference remains unchanged. | PASS |
| C-T18 | Move／Attack／Death／Impact route integration tests | Test asserts identical corresponding lifecycle IDs across old／new Sessions before replaying stale callbacks. | PASS |
| C-T19 | Route integration tests; `tests/battle.animation.react.integration.test.mjs` — `unmount aborts pending attack once, removes its frame callback, and remount is clean` | Frame Harness reports zero active callbacks after Route unmount／controller cleanup. | PASS |
| C-T20 | `battle.route.lifecycle.integration.test.mjs` — Attack callback test | Unmount during pre- and post-impact Attack lifecycle removes active Frame subscriptions; re-entry creates fresh callbacks. | PASS |
| C-T21 | `battle.route.lifecycle.integration.test.mjs` — Enemy AI and Death callback test | Death Motion callback is session-bound; unmount and re-entry preserve new Death Motion／Impact. | PASS |
| C-T22 | `battle.route.lifecycle.integration.test.mjs` — Enemy AI and Death callback test | Test-only capture observes real Production AI Effect dispatch; stale dispatch is isolated. | PASS |
| C-T23 | `battle.route.lifecycle.integration.test.mjs` plus source inspection of `App.tsx` and battle hooks | StrictMode hash listener count remains one through Route transitions and zero after App unmount; runtime has no `setTimeout`／`setInterval`; test-only `queueMicrotask` tracking confirms scheduled work completes with pending count zero after Route exit and App unmount. | PASS |
| C-T24 | `battle.route.lifecycle.integration.test.mjs` — `Production Runtime Outcome, Overlay, and Restart use the configured battle Session` | Ten effective Restarts each verify Generation increment, fresh initial ACTIVE Session, old Restart／Player callback isolation, controller Frame cleanup, one active Runtime／Canvas, and balanced active Frame／Canvas counts without cumulative Session-owned work. | PASS |
| C-T25 | `battle.route.lifecycle.integration.test.mjs` — Production App route entry／exit test | Ten Route re-entry cycles assert zero active Frame／Canvas on exit, one on entry, one Route listener, fresh Session／Reducer. | PASS |
| C-T26 | Same Route entry／exit test under React `StrictMode` | Route listener and Canvas／Frame lifecycle counts remain balanced through StrictMode and final unmount. | PASS |
| C-T27 | Production Outcome／Restart test | Replayed stale Restart Handler after a successful restart does not replace the current Session. | PASS |
| C-T28 | Production Outcome／Restart test | Configured Production Scenario reaches VICTORY through Reducer lifecycle and displays Victory Overlay. | PASS |
| C-T29 | Production Outcome／Restart test | Configured Production Scenario reaches DEFEAT through enemy／Death lifecycle and displays Defeat Overlay. | PASS |
| C-T30 | Production Outcome／Restart test; `battle.animation.react.integration.test.mjs` — configured Victory／Defeat lifecycle tests | Harness advances Attack／Death Motions through their real completion barriers before Outcome and Overlay assertions. | PASS |
| C-T31 | Production Outcome／Restart test | Victory Restart produces new ACTIVE Session whose Units equal its Scenario initial state; prior Session remains isolated. | PASS |
| C-T32 | Production Outcome／Restart test | Defeat Restart restores the new Session's initial Units and clears Outcome／Overlay. | PASS |
| C-T33 | `battle.test.mjs`, movement／obstacle tests | Assertions cover Movement Validation, obstacle routing, occupancy, undo and action economy; full suite passes. | PASS |
| C-T34 | `battle.turn.test.mjs`, `battle.ai.test.mjs`, `battle.action-economy.test.mjs` | Assertions cover PAS order／completion, AI authorization／movement／attack／standby and Action Guards. | PASS |
| C-T35 | `battle.attack.test.mjs`, `battle.death.test.mjs`, `end-conditions.test.mjs`, React animation integration | Assertions cover Reservation, Impact／Abort, Death Barrier, Outcome priority and terminal guards. | PASS |
| C-T36 | `end-conditions.test.mjs`, `battle.session.test.mjs`, route integration test | Assertions cover terminal immutability, fresh Session snapshots, callback isolation and Restart. | PASS |

### AC-C01～AC-C45 Acceptance Criteria Matrix

| AC | Result | Evidence / Limitation |
|---|---|---|
| AC-C01 | PASS | Production App Route integration test mounts ACTIVE Battle Session. |
| AC-C02 | PASS | Idle Route exit unmounts Battle and clears test-observed Frame／Canvas ownership. |
| AC-C03 | PASS | Ten re-entries create distinct Session／Reducer instances and initial snapshots. |
| AC-C04 | PASS | Production Move Motion is active at Route exit; stale callbacks do not affect re-entered Session. |
| AC-C05 | PASS | Attack callbacks isolated with both pre-impact and post-impact Motion. |
| AC-C06 | PASS | Death Motion completion／abort／impact callbacks isolated after re-entry. |
| AC-C07 | PASS | Real AI Effect／Gateway action captured during enemy Motion; old action is isolated. |
| AC-C08 | PASS | VA1 terminal Route integration reaches VICTORY／DEFEAT, removes each Result Overlay on Route exit, cleans Runtime／Frame／Canvas ownership, and isolates callbacks after re-entry. |
| AC-C09 | PASS | Move Finish／Cancel callbacks remain bound to prior Session. |
| AC-C10 | PASS | Attack Impact／Complete／Abort callbacks remain bound to prior Session. |
| AC-C11 | PASS | Death Complete／Abort callbacks remain bound to prior Session. |
| AC-C12 | PASS | Consume Impact callback cannot clear a matching new Session impact. |
| AC-C13 | PASS | Captured old AI Gateway dispatch cannot change new Session. |
| AC-C14 | PASS | Old Player Standby callback cannot change the new Session Turn. |
| AC-C15 | PASS | Move／Attack／Death／Impact IDs are asserted equal across Sessions before stale replay. |
| AC-C16 | PASS | Stale Restart Handler cannot remount the current Generation. |
| AC-C17 | PASS | Frame lifecycle harness observes callback cleanup after Move／Route unmount. |
| AC-C18 | PASS | Attack Frame subscriptions clear on unmount; existing Controller test independently asserts cleanup. |
| AC-C19 | PASS | Death lifecycle unmount and stale callback isolation covered with real controller wiring. |
| AC-C20 | PASS | Real AI Effect／Gateway dispatch captured and isolated across Route re-entry. |
| AC-C21 | PASS | StrictMode App listener lifecycle is counted; no runtime timer exists in inspected scope; test-only `queueMicrotask` tracking reaches pending 0 and scheduled = completed after Route exit／App unmount. |
| AC-C22 | PASS | StrictMode Route mount／unmount, controller Frame cleanup, and deferred-work completion are asserted. |
| AC-C23 | PASS | Ten effective integration Restarts each restore initial Session State and verify Generation, stale callback rejection, one active Runtime／Canvas, and balanced stable Frame／Canvas counts; Node harness, not Browser stress. |
| AC-C24 | PASS | Ten automated Route re-entry cycles plus two Browser warm-ups and ten measured Menu／Battle round trips. |
| AC-C25 | PARTIAL — ACCEPTED / DEFERRED TO TD-010 | Source lifecycle and Browser Canvas／Context identities are observed; final Menu has zero connected Canvas, but renderer ownership／`renderer.info.memory` is unavailable. |
| AC-C26 | PARTIAL — ACCEPTED / DEFERRED TO TD-010 | VA1 maps each observed Context Loss to its Canvas／Context identity (including the initial Context); no valid Renderer memory statistics, so GPU disposal remains unverified. |
| AC-C27 | PARTIAL — ACCEPTED / DEFERRED TO TD-010 | Owned Geometry／Texture／OrbitControls cleanup inspected; no full shared asset／GPU disposal measurement. |
| AC-C28 | PARTIAL — ACCEPTED / DEFERRED TO TD-010 | No reproducible leak observed in available counts; insufficient GPU telemetry to conclude no Resource Leak. |
| AC-C29 | PASS | Existing Movement／Obstacle／Occupancy／Attack tests pass; no Runtime Source Code change. |
| AC-C30 | PASS | Existing Action Economy／PAS tests pass; browser standby advances turns. |
| AC-C31 | PASS | Existing AI Authorization／Decision tests pass; browser observed enemy movement. |
| AC-C32 | PASS | Existing End Condition and Victory／Defeat Integration tests pass. |
| AC-C33 | PASS | Existing Overlay／Restart tests and Production Runtime outcome integration pass. |
| AC-C34 | PASS | Production configured Reducer reaches both terminal Outcomes after lifecycle barriers. |
| AC-C35 | PASS | Victory／Defeat Restart produce fresh Session State equal to Scenario initial Units. |
| AC-C36 | PASS | `npm test` 271/271; original 270 test cases retained. |
| AC-C37 | PASS | Six Production Route Integration tests pass 6/6. |
| AC-C38 | PASS | `npm run lint` exit code 0. |
| AC-C39 | PASS | `npm run build` exit code 0; existing Battle chunk warning remains. |
| AC-C40 | PASS | CRLF-aware `git diff --check` and new-file whitespace scan pass. |
| AC-C41 | PASS | RV evidence, residual limitations and approved TD-010 deferral are documented. |
| AC-C42 | PASS | Independent Review and RC-M4-4B-07／08 dispositions are recorded. |
| AC-C43 | PASS | README and all seven requested documentation files synchronized; UX Backlog unchanged. |
| AC-C44 | PASS | No Runtime／Battle Core／Test／Dependency changes in this closure; VA1's out-of-scope asset is present in the verified baseline and was not modified. No Commit／Push. |
| AC-C45 | PASS WITH APPROVED LIMITATIONS | Closure evidence and residual GPU verification deferral are approved and recorded; no unconditional GPU PASS is claimed. |

### BV-C01～BV-C14 Agent Browser Verification

Browser verification below is Agent-observed evidence, not Product Owner Acceptance. Node／jsdom results are not used to upgrade Browser status.

| BV | Result | Agent Browser Evidence / Limitation |
|---|---|---|
| BV-C01 | PARTIAL | Actual 3D Browser: Assassin Move／Undo, Swordsman Attack on Goblin A (15 damage), and Standby. Blocking／occupancy cases not deliberately exercised. |
| BV-C02 | PARTIAL | Undo restored Move; Standby advanced Player Turn; Timeline showed player／enemy order. Full action restrictions not exhaustively checked. |
| BV-C03 | PARTIAL | Goblin units visibly moved during Enemy Turns; no verified enemy attack／standby sequence. |
| BV-C04 | NOT VERIFIED | Did not defeat all enemies or observe Victory Overlay／terminal protection. |
| BV-C05 | NOT VERIFIED | Did not defeat all player units or observe Defeat Overlay. |
| BV-C06 | NOT VERIFIED | No Browser Victory／Defeat Restart performed. |
| BV-C07 | NOT VERIFIED | Modal Pointer／Tab／Escape／Scroll／OrbitControls interactions not tested. |
| BV-C08 | PASS | Actual Main Menu ↔ Battle Route operated for 12 round trips (2 warm-up, 10 measured); Battle rendered after re-entry. |
| BV-C09 | NOT VERIFIED | Browser route stress was idle; no exact in-motion／AI／death mid-Route exit performed. Automated integration evidence is separate. |
| BV-C10 | NOT VERIFIED | No terminal Outcome Route exit／re-entry performed in Browser. |
| BV-C11 | NOT VERIFIED | Ten Restart cycles were performed by Production React Integration test, not Browser. |
| BV-C12 | PARTIAL | Two warm-up and ten measured idle Menu／Battle round trips completed; each measured Battle mount had one connected Canvas. Route observation does not prove GPU disposal or terminal／in-motion Browser behavior. |
| BV-C13 | PARTIAL | VA1 identity-mapped the initial Context and 13 new Canvas／WebGL2 Contexts; all 14 observed contexts emitted a matching Context Loss on exit, with no restore events. After final Menu cleanup delay: 0 connected Canvas; `renderer.info.memory` unavailable, so GPU disposal remains NOT VERIFIED. Full samples follow. |
| BV-C14 | PARTIAL | Desktop gameplay and no page-level unhandled exception observed; Mobile not tested. Console included Three.js `THREE.Clock`／`PCFSoftShadowMap` warnings and Main Menu image `ERR_CONNECTION_REFUSED`; cause of image failure is environment-dependent and unclassified. |

> The following is the separate Product Owner acceptance record. It does not rewrite the Agent results above and was obtained before VA1; it is not a post-VA1 Browser regression.

### Product Owner Browser Acceptance — 2026-11-20 (Pre-VA1 Baseline)

| BV | Product Owner Result |
|---|---|
| BV-C01 Normal Combat Regression | PASS |
| BV-C02 PAS & Action Economy | PASS |
| BV-C03 Enemy AI | PASS |
| BV-C04 Victory Lifecycle | PASS |
| BV-C05 Defeat Lifecycle | PASS |
| BV-C06 Victory／Defeat Restart | PASS |
| BV-C07 Modal Interaction | PASS |
| BV-C08 Idle Route Transition | PASS |
| BV-C09 Active Route Transition | PASS |
| BV-C10 Terminal Route Transition | PASS |
| BV-C11 Repeated Restart Stress | PASS |
| BV-C12 Repeated Route Transition Stress | PASS |
| BV-C13 Resource Diagnostics | PASS |
| BV-C14 Responsive & Runtime Regression | PASS |

**Final Result：14/14 PASS — ACCEPTED。** VA1 did not modify Production Runtime; this pre-VA1 PO acceptance is adopted as functional acceptance evidence. PO BV-C13 does not establish `renderer.info.memory`, complete GPU disposal, or long-duration resource stability. The Agent's earlier BV-C13 PARTIAL and other PARTIAL／NOT VERIFIED records remain unchanged.

### VA1 WebGL Sample Record

The prior 13-creation／11-loss observation is retained as historical evidence. VA1 used temporary page-local instrumentation to assign Canvas／Context IDs and listen for `webglcontextlost`／`webglcontextrestored`; it did not alter Production source. At instrumentation start, existing Canvas C1／WebGL2 Context G1 was connected on `#battle` (104,115,685 heap bytes); its matching loss was observed during the preparatory exit. The two warm-ups and ten measured cycles are listed below. Heap values are `performance.memory.usedJSHeapSize` samples in bytes.

| Cycle | Battle Canvas／Context | Battle Heap Bytes | Menu Heap Bytes | Exit Loss Identity |
|---|---|---:|---:|---|
| Warm-up 1 | C2／G2 | 97,308,722 | 98,601,369 | C2／G2 |
| Warm-up 2 | C3／G3 | 98,001,657 | 98,729,415 | C3／G3 |
| Measured 1 | C4／G4 | 99,446,844 | 99,184,541 | C4／G4 |
| Measured 2 | C5／G5 | 99,893,060 | 99,715,705 | C5／G5 |
| Measured 3 | C6／G6 | 100,376,564 | 103,082,131 | C6／G6 |
| Measured 4 | C7／G7 | 100,888,914 | 104,640,358 | C7／G7 |
| Measured 5 | C8／G8 | 99,503,317 | 104,438,028 | C8／G8 |
| Measured 6 | C9／G9 | 93,015,529 | 104,776,748 | C9／G9 |
| Measured 7 | C10／G10 | 93,422,777 | 101,255,613 | C10／G10 |
| Measured 8 | C11／G11 | 100,765,845 | 105,745,408 | C11／G11 |
| Measured 9 | C12／G12 | 94,289,082 | 106,211,008 | C12／G12 |
| Measured 10 | C13／G13 | 110,184,892 | 106,684,463 | C13／G13 |

An additional, non-measured Battle entry for the `renderer.info` inspection created C14／G14; its matching loss was observed on return to the Menu. Every observed loss (C1／G1 through C14／G14) reported `connected=false`, `cancelable=true`, and `defaultPrevented=false`; no `webglcontextrestored` event was observed. After a 1.5-second final Menu delay, the route was `(menu)`, connected Canvas count was 0, and heap was 107,159,387 bytes.

The read-only renderer probe found no `canvas.__r3f` state or exposed renderer global; the canvas exposed only React Fiber／props keys, so no valid `renderer.info.memory` value was obtainable. The test-only R3F fixture substitutes Canvas and returns only a size from `useThree`, so it is not a valid renderer-memory source. Browser console warnings observed during the route mounts were `THREE.Clock` deprecation and `PCFSoftShadowMap` removal／fallback to `PCFShadowMap`. These event／heap observations do not prove GPU resource disposal or absence of a leak.

### Resource Ownership and Measurement Notes

- Production source inspection: App removes its `hashchange` listener; `useBattleAI` uses synchronous Effect dispatch and no Timer; Drei OrbitControls cleanup removes listeners and disposes controls; Death Particle Geometry, Floating Damage CanvasTexture and Unit Label CanvasTexture are disposed by their owners.
- Installed R3F `9.8.2` Canvas root cleanup was inspected for Event／Scene／Renderer teardown; it disposes an owned Renderer and requests Context Loss on root unmount. This dependency behavior is not equivalent to observing all GPU allocations.
- Browser sampling: see the VA1 table above. Context creation/loss events are event observations, not live renderer counts; zero connected Canvas after Route exit is not GPU disposal evidence.
- Heap sampling fluctuated and does not establish a leak trend. `renderer.info.memory` and Geometry／Texture／Program counts remain NOT VERIFIED. No claim is made that GPU resources were fully disposed or that no leak exists.
- The Browser successfully rendered WebGL in this M4-4C session; this does not retroactively alter M4-4B's historical WebGL fallback／PARTIAL record or constitute Product Owner acceptance.

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

> 歷史快照：以下記錄 M4-4A 結案後、M4-4B Conditional Closure 前的狀態；目前最新基準見上方「M4-4B Implementation & Conditional Closure」。

**當時狀態（2026-11-20，M4-4B Conditional Closure 前）**：M4-3 Enemy AI 已完成正式驗收（COMPLETED — FORMALLY ACCEPTED）；M4-4A End Condition Framework & Battle Outcome 已完成正式結案（COMPLETED — FORMALLY ACCEPTED）。Patch 1 為 COMPLETED — ACCEPTED，Final Review Correction 為 COMPLETED — VERIFIED；CR-M4-4A-01～05 全數 CLOSED。M4-4A Product Owner Post-Patch Browser Acceptance 為 BV-A01～A05 5/5 PASS；Agent 原始 PARTIAL／NOT VERIFIED 結果仍分列保留。當時最新已驗證 Repository Commit 為 `41b43c77e849276847c8c643deedd3a7ca0b0747`，GitHub Actions Run `44596893220` SUCCESS；M4-4A Feature Commit 為 `1cce94613791548cc1717942b72d1513487db857`。M4-4A 結案基準為 246/246 Automated Tests、12/12 React Integration、AC 32/32、原始 Test Traceability 28/28、Patch Traceability 9/9 PASS；Lint、Build、Diff Check PASS。M4-4B Agent Browser Route 顯示 WebGL fallback，原始 BV-B01、BV-B10 PARTIAL，BV-B02～B09 NOT VERIFIED；後續 Product Owner 驗收與 Conditional Closure 請見本文件上方。M4 維持 75%、Overall 37.5%。
- 技術債及 UX 項目詳見 [TECHNICAL_DEBT.md](./TECHNICAL_DEBT.md) 與 [UX_BACKLOG.md](./UX_BACKLOG.md)。

## 已知阻擋問題

M4 已正式結案。剩餘明確驗證限制為 TD-010：`renderer.info.memory`、GPU Disposal 與長時間資源穩定性未驗證，AC-C25～C28 已核准延後；這不是已確認可重現的 Resource Leak。Agent 原始 PARTIAL／NOT VERIFIED 與 PO Acceptance 分開保留。M5-1 已正式結案；M5-2～M5-4 仍待開發，M5 整體未結案。M5-1 歷史 Browser 限制維持原始標記，不因 PO Visual Acceptance 改寫。

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

## Historical Next-Step Snapshot — Before M4 Formal Closure

M4-3 已 **COMPLETED — FORMALLY ACCEPTED**。M4-4A End Condition Framework & Battle Outcome、Patch 1 與 Final Review Correction 已分別標記 **COMPLETED — FORMALLY ACCEPTED**、**COMPLETED — ACCEPTED**、**COMPLETED — VERIFIED**；CR-M4-4A-01～05 全數 CLOSED。Formal Closure 文件已納入 Repository Commit `41b43c77e849276847c8c643deedd3a7ca0b0747`／GitHub Actions Run `44596893220` SUCCESS；M4-4A Feature Commit 為 `1cce94613791548cc1717942b72d1513487db857`。M4-4A 結案基準為 246/246 Automated Tests、12/12 React Integration Tests、32/32 AC、28/28 T、9/9 P-T、Lint、Build 與 Diff Check PASS；Product Owner Post-Patch BV-A01～A05 5/5 PASS（2026-11-20）。Patch 前 PO 驗收與 Agent 原始 PARTIAL／NOT VERIFIED 結果仍分列保留。M4-4B **COMPLETED — CONDITIONALLY ACCEPTED**：Repository Commit `e299fa48e28d16e24aadba9cc7925bedf4d53895`／GitHub Actions Run `44605672030` SUCCESS；265/265 Automated Tests、29/29 React Integration、2/2 Session Tests、Lint、Build PASS；PO BV-B01～B10 10/10 PASS。自動化追溯為 28 PASS／2 PARTIAL，綜合 AC 為 36 PASS／1 PARTIAL。RC-M4-4B-07 與 RV-M4-4B-01～03 移交 M4-4C；M4-4B Patch 1 未啟動，M4-4 Formal Acceptance 仍 PENDING。M4-4C 為 **NEXT — PENDING DEVELOPMENT**；M4 整體仍 IN PROGRESS，維持 75%、Overall 37.5%。本次 Conditional Closure 文件異動尚未提交；不 Commit／Push。
此段保留 M4 Formal Closure 前的 Roadmap／Acceptance 快照；其中 M4-4C 尚未開始、M4-4 Formal Acceptance PENDING、M4 75% 與 Overall 37.5% 等均為當時歷史狀態，已由上方 **M4 Formal Closure Record** 取代。

## Current Next Milestone

M4 **COMPLETED — FORMALLY ACCEPTED**；M1–M4 進度 100%。M5 — 戰鬥 UI／UX **IN PROGRESS（37.5%）**；M5-1 **COMPLETED — FORMALLY ACCEPTED**，M5-2A **COMPLETED — FORMALLY ACCEPTED WITH LIMITATIONS**，M5-2B **IMPLEMENTED — PENDING REVIEW**，M5-3／M5-4 仍 PENDING。Completed Milestones 維持 4/10，Overall 為 43.75%。任務指引提及 M5-5 尚未在目前 Roadmap 定義；不推測其需求或驗收。
