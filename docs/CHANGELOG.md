# Changelog

僅記錄可由 Git、測試、CI 或已確認驗收結果支持的歷史。日期使用 UTC+8；有對應 Commit 時以其日期為準。

## 2026-11-21 — M5-3B Patch 1 HUD Integrated Damage Forecast (IMPLEMENTED — PENDING REVIEW)

- **Implementation**：將正式傷害預覽整合到目標 HUD 的既有 HP 血條，區分預計剩餘、預計扣除與既有損失，致命傷害以目前 HP 為上限；淡紅區段使用 CSS 脈動並支援 Reduced Motion。移除獨立預覽面板與 HUD 內攻擊按鈕，HUD 外保留確認／取消，二次點擊及右鍵流程不變；修正右鍵取消後 R3F 空白事件誤隱藏 HUD。
- **Presentation Addendum**：HP 預覽文字顯示「目前 HP → 預計剩餘 HP／上限」（例：`60 → 37/60`），箭頭使用 lucide outline icon；真實 WebGL 瀏覽器確認箭頭與預計 HP 的 computed color 相同。HUD／Production Route 目標測試、Lint 與 Build 本次重新通過。
- **Verification**：`npm test` 重跑 306/306 PASS，單程序完整測試 306/306、HUD／Production Route 目標測試 31/31、Lint 與 Build PASS；首輪預設並行測試因 Route worker 停滯逾 5 分鐘而中止，後續重跑通過。Build 保留 >500 kB Battle chunk warning。真實 WebGL 驗證滿血／已損血／致命預覽及正式傷害、目標切換／非法選取、觸控模擬、右鍵拖曳、Reduced Motion、指定三種 viewport 與 Route Re-entry；Browser 整體仍 PARTIAL，終局 Restart 及實體手機未驗證。細節見 [Development Status](./DEVELOPMENT_STATUS.md)。
- **Status / Scope**：M5-3 維持 IMPLEMENTED — PENDING REVIEW；M5 50%、Overall 45%、Completed Milestones 4/10、TD-022 OPEN。未修改 Battle Core／PAS／AI／Reducer／Outcome／正式傷害規則／Camera Controller／Assets；未 Commit／Push，既有基準 CI 不涵蓋未提交工作。

## 2026-11-21 — M5-3 Attack Interaction (IMPLEMENTED — PENDING REVIEW)

- **Implementation**：加入以正式 Presentation Focus／攻擊合法目標為依據的 3D 高亮；首次點選合法目標顯示正式傷害與剩餘 HP，第二次點擊同目標或保留的「確認攻擊」按鈕才發動。完成移動後 Undo 自動進入 MOVE；右鍵在 COMMAND 撤銷、MOVE 取消模式、ATTACK 取消攻擊；右鍵拖曳超過 5px 不觸發快捷操作。UX-003 依 Product Owner 裁定更新為雙擊同一目標確認。
- **Automated Verification**：`npm test` 301/301 PASS；HUD／Production Route 目標測試 26/26 PASS；`npm run lint` PASS；`npm run build` PASS，保留 >500 kB Battle chunk warning。`git -c core.whitespace=cr-at-eol diff --check` PASS。
- **Browser Verification**：實際 WebGL 戰場載入並觀察 HUD、輪盤、Timeline、高亮、移動及右鍵 Undo 後自動回 MOVE；ATTACK 右鍵取消與 MOVE 右鍵取消已確認；390×845 viewport 的 document width 為 390px、無水平溢位。合法目標傷害預覽／二次點擊、右鍵拖曳、Reduced Motion 與其他 viewport 尚未完成，整體 Browser Verification 為 PARTIAL。
- **Scope / Status**：未修改 Battle Reducer、PAS、AI、Outcome、傷害公式、Camera Controller 或 Assets；TD-022 仍 OPEN。M5-3 **IMPLEMENTED — PENDING REVIEW**，Product Owner Acceptance 未完成；M5 50%、Overall 45%、Completed Milestones 4/10 不變。工作樹未提交／推送；基準 CI Run `44763816555` 對應 `8e4f6bcf36a7ccd0382aafeb59c04606b563762a`，不含本次異動。

## 2026-11-20 — M5-2B Formal Closure

- **Closure**：M5-2B 已通過 Independent Code Review 與 Product Owner Browser Acceptance，正式結案為 **COMPLETED — FORMALLY ACCEPTED WITH LIMITATIONS**。
- **Baseline**：Commit `6f6bc2f4bee95a5a3cca66710999035ae99eb4fa`、GitHub Actions Run [44762610196](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44762610196) SUCCESS；`build` 與 `deploy` jobs 均 SUCCESS。
- **Contract**：初始斜視焦點約畫面高度 52% 且依 UI Safe Area 避讓；COMMAND 鎖定追蹤、右鍵旋轉與滾輪縮放不解除鎖定；空白解除隱藏 CG／HUD／輪盤；角色、Timeline 與 PAS 換手恢復聚焦；MOVE 可左鍵平移，退出後恢復鎖定。
- **Progress**：M5 50%、Overall 45%、Completed Milestones 4/10；M5-3 為 PENDING — UP NEXT；TD-022 保持 OPEN。
- **Scope**：僅同步文件，不修改 Production Code、Tests、Assets 或 Camera Controller，不 Commit／Push。

## 2026-11-20 — M5-2B MOVE 左鍵平移

- 選擇移動格時暫停自動取景，允許左鍵拖曳戰場而不清除角色 CG／HUD；離開 MOVE 後恢復角色取景。

## 2026-11-20 — M5-2B 焦點高度微調

- 將鎖定焦點的預設高度上移至畫面約 52%，保留水平取景與 HUD／Timeline 避讓。

## 2026-11-20 — M5-2B 開場取景與焦點鎖定

- 開場以可用戰場區左下為焦點。旋轉／縮放不解除鎖定；COMMAND 點擊空白才解除，並隱藏角色 CG／HUD。選取角色或 PAS 換手恢復焦點，不變更戰鬥權限。驗證見 [Development Status](./DEVELOPMENT_STATUS.md)。

## 2026-11-20 — M5-2B Battle Camera System（IMPLEMENTED — PENDING REVIEW）

- **Implementation**：加入單一 R3F 相機控制器、集中相機設定與投影／阻尼數學；PAS 換手聚焦新 Active Unit，Presentation 檢視聚焦被檢視角色，並跟隨實際移動中的 Unit Group。保留固定俯角、既有 OrbitControls 手動平移／旋轉／縮放、手動操作中止自動跟隨、安全區避讓與 Reduced Motion。ATTACK 目標點擊更新角色檢視資料但不發出一般檢視相機請求；不修改 PAS、Battle Core、AI 或 Outcome。
- **Regression / Automated Verification**：維持 ATTACK 目標檢視與 PAS 換手 HUD／CG 同步；新增 Camera Math 與 React-mounted Controller 整合測試，覆蓋 ResizeObserver／R3F 尺寸更新先後不同時的重新取景。`npm test` 296/296 PASS，`npm run lint` PASS，`npm run build` PASS（BattleScene chunk 1,035.66 kB，既有 >500 kB 警告），CRLF-aware Diff Check PASS。
- **Browser Verification**：真實 WebGL 戰場確認 Timeline 檢視迪歐時 HUD／CG 聚焦迪歐、Active Unit 仍為奧黛且輪盤隱藏；點回 Active Unit 恢復輪盤。COMMAND 點擊 3D 敵人改變 Inspected Unit、不改 PAS。實際 Move／Undo 後輪盤隨單位回到原位；左平移、右旋轉、滾輪縮放時輪盤持續投影於角色周圍。Standby 後 PAS 切換至迪歐，HUD／CG／輪盤同步更新；迪歐 Standby 後觀察到敵方 AI 對迪歐造成 5 點傷害，敵方行動後回到奧黛。主選單 Route Re-entry 後確認 1 個 Canvas 與各 1 個 Portal、HUD／Active 重設。真實 WebGL viewport 由 2560×1440 縮至 1280×720、再調至 1920×1080，輪盤持續錨定至新安全區的 Active Unit 投影；量測的頁面均無水平溢位。另量測 1280×720、1920×1080、2560×1440、390×845、845×390 viewport；此為桌面真實瀏覽器調整 viewport，不代表實體手機驗收。
- **Limits / Status**：Browser 中的 Reduced Motion、攻擊取消／目標點擊相機邊界、敵方 AI 移動時的相機跟隨、角色死亡、終局 Restart 及全部相機安全區／邊界情境尚未完整驗證；Observer disposal 由 lifecycle／React integration 測試覆蓋但非 Browser 驗證。詳細狀態見 [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md)。M5-2B 維持 **IMPLEMENTED — PENDING REVIEW**，未經獨立審查或 Product Owner 驗收；M5 37.5%、Overall 43.75%、Completed Milestones 4/10 不變。TD-022 保持 OPEN。未 Commit／Push。

## 2026-11-20 — 2K HUD HP／SP 起點與右側欄位修正

- HP／SP 保持原本左側渲染起點，只調整 2K 顯示長度；攻擊範圍維持與右側 ATK／MOV／DEF 相同的固定欄位與等距配置。

## 2026-11-20 — 戰鬥提示收斂與 Timeline 敵軍紅框

- 戰鬥提示只保留確認傷害的「誰對誰造成多少傷害」；移除攻擊中、合法目標、距離、實際扣除與失能補充文字。Timeline 所有敵軍肖像固定紅色外框，選取時不改藍框且不閃爍。

## 2026-11-20 — 戰鬥提示獨立置頂顯示

- 活動與攻擊目標提示由角色 HUD 移至畫面中央正上方獨立橫幅；半透明深藍呈現、保留安全邊距、支援 2K／手機尺寸。取消 ATTACK 或提示消失時橫幅同步移除。

## 2026-11-20 — M5-2A Formal Closure & Documentation Synchronization (COMPLETED — FORMALLY ACCEPTED WITH LIMITATIONS)

- **Closure Evidence**：`main` @ `2b46eeaf02135e413bbe59b674d4d95045a136a8`；GitHub Actions Run [44714442975](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44714442975) SUCCESS、GitHub Pages Deployment SUCCESS；GitHub Independent Code Review APPROVED；Product Owner Browser Acceptance APPROVED。
- **Milestone**：M5-2A 正式結案為 **COMPLETED — FORMALLY ACCEPTED WITH LIMITATIONS**。M5 由 25% 更新為 37.5%，Overall 由 42.5% 更新為 43.75%，Completed Milestones 維持 4/10。
- **Next / Limitations**：M5-2B 維持 **PENDING — UP NEXT**；UX-006 歸屬 M5-2B。TD-022 維持 OPEN；角色死亡、終局 Restart 等 PARTIAL／NOT VERIFIED Browser Verification 保留。本次只同步文件，不 Commit／Push，也不修改 Production Code、Tests、Assets 或 Camera Controller。

## 2026-11-20 — Timeline 整體配色淡化 (IMPLEMENTED — PENDING REVIEW)

- Timeline 外框由深藍不透明色改為極淡中性玻璃色，降低容器與陰影視覺重量；肖像方塊仍為透明，邊框、行動值與脈動標示不變。

## 2026-11-20 — 2K Timeline 再放大並恢復藍色辨識度 (IMPLEMENTED — PENDING REVIEW)

- 2560×1440 下 Timeline 圖標由 84px 調整為 96px，容器實測約 850px；容器恢復低透明深藍玻璃色，肖像方塊仍保持透明。保留與 HUD 的無重疊與無水平溢位。

## 2026-11-20 — 2K 角色 HUD 與輪盤軸心放大 (IMPLEMENTED — PENDING REVIEW)

- 2560×1440 下角色狀態 HUD 實測約 1178×220px，資訊欄、資源條、屬性與按鈕同步放大；輪盤視覺直徑由 224px 調整為約 255px。手機版及一般桌面版尺寸維持原樣，兩者均無水平溢位。

## 2026-11-20 — Timeline 肖像方塊透明化 (IMPLEMENTED — PENDING REVIEW)

- 右下角 Timeline 的每個肖像圖標方塊改為完全透明背景，保留既有金／藍／一般邊框、脈動、Inspected 標示與行動值。

## 2026-11-20 — 2K 桌面 HUD／Timeline 尺寸調整 (IMPLEMENTED — PENDING REVIEW)

- 針對寬度 2100px 以上、高度 1000px 以上的桌面版放大角色資訊 HUD 與 Timeline；2K 實測 HUD 約 973px、Timeline 約 754px、圖標約 84px。小螢幕與既有操作規則不變。

## 2026-11-20 — Timeline 行動值整數顯示 (IMPLEMENTED — PENDING REVIEW)

- Timeline 的右下角行動值改為僅在呈現層四捨五入為整數，正式 PAS／預測數值與回合演算法不變。真實瀏覽器確認顯示 `0、33、67、133`；新增格式化測試。

## 2026-11-20 — M5-2A 行動軸光暈與中空輪盤 (IMPLEMENTED — PENDING REVIEW)

- 目前行動金框與同一角色的預測藍框同步脈動；輪盤改為半透明中空五區，保留指令授權，並提供滑鼠與鍵盤焦點回饋。驗證見 [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md)。

## 2026-11-20 — M5-2A 回合交接 HUD／CG 修正 (IMPLEMENTED — PENDING REVIEW)

- 暫態角色檢視不再跨 PAS 回合保留。真實 WebGL 驗證奧黛攻擊哥布林 A 後，HUD、CG、輪盤與 Timeline 同步切換至迪歐。回歸測試及驗證細節見 [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md)。

## 2026-11-20 — M5-2A Patch 1 Interaction Consistency & UI Refinement (IMPLEMENTED — PENDING REVIEW)

- **Baseline / Scope**：`main`／`origin/main` @ `8b0aa67776c66cb4b0585a1ec887e598a1ca9d30`；Patch 只調整 Presentation、最小 Attack Target State Consistency、Tests 與文件。M5-2B 未啟動，Camera Controller 未修改。
- **Interaction / UI**：檢視非 Active Unit 時輪盤隱藏；MOVE Mode 禁止世界／Timeline 切換檢視；非法攻擊目標清除舊 Target，Cancel Attack 回復 Active Unit。Timeline 採 ResizeObserver 完整卡片容量、無標題／順位／Scrollbar；友軍還原大型 M5-1 CG、Timeline 使用小肖像；輪盤以 Active Unit 世界投影並避開 HUD／Timeline。
- **Verification**：`npm test` 284/284、Lint、Build、CRLF-aware Diff Check PASS；Build 保留既有 >500 kB chunk warning。真實 WebGL 驗證 Move／Undo／Attack Target／Confirm／Cancel／AI、輪盤移動與鏡頭跟隨、Desktop/Mobile/Landscape、CG、Reduced Motion、Fallback 與 Route Re-entry。角色死亡／終局 Restart Browser 未驗證；M5-2A 仍待 Product Owner Acceptance。
- **Independent Review**：Landscape Timeline collision finding 已修正並經 Follow-up Review；Product Owner Acceptance 仍 PENDING。

## 2026-11-20 — M5-2A Patch 2 Timeline Layout & CG Background Continuity (IMPLEMENTED — PENDING REVIEW)

- **Timeline**：ResizeObserver 改量測獨立的可用內容區，Timeline 依完整可容納卡片數收縮並貼齊右側；桌面最多 8 格，小螢幕僅顯示完整圖標，不保留隱藏可捲動項目。
- **CG**：固定 HUD 背景漸層與友軍大型 CG／敵軍肖像分層，切換角色時背景尺寸不變；保留原始友軍 CG、敵方肖像、圖片載入 Fallback 及 Reduced Motion。
- **Verification**：`npm test` 284/284、Lint、Build 與 CRLF-aware Diff Check PASS；Build 保留既有 >500 kB chunk warning。真實 WebGL Browser 驗證桌面 8 格、手機直向 6 格、橫向 5 格、角色切換／快速切換、Reduced Motion 與 Move／Attack Cancel；三種版面無水平溢位。已擷取奧黛及哥布林畫面；未取得 PO 訊息所提的參考截圖，故未宣稱完成圖像對照。Product Owner Visual Acceptance 仍待執行。
- **Status / Scope**：M5-2A 維持 **IMPLEMENTED — PENDING REVIEW**；M5 為 25%、Overall 為 42.5%，M5-2B 未啟動。沒有修改 Battle Core／PAS／Camera Controller／圖片素材；Patch 1／2 均未 Commit／Push。細節見 [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md)。

## 2026-11-20 — M5-2A Battle Interaction UI (IMPLEMENTED — PENDING REVIEW)

- **Implementation**：新增角色五方向操作輪盤、Inspection Presentation State、最多八格的橫向 PAS Timeline，以及角色 CG 切換動畫與 Reduced Motion 支援。Skill／Item 維持 Disabled；移動、Undo、Attack、Standby 沿用既有授權 callback。
- **PAS / Assets**：Timeline 顯示正式 PAS 順序與行動時間值，不自行排序或補造單位。PAS 缺少單位每輪行動狀態，未實作友軍 gray-out，追蹤於 TD-022。指定 `public/images/battle/` 路徑不存在；沿用實際提供且未修改的 `public/assets/images/battle/` 三張素材。
- **Verification**：`npm test` 281/281、Lint、Build 與 CRLF-aware Diff Check PASS；Build 保留既有 >500 kB chunk warning。真實 WebGL Browser 驗證涵蓋桌面／直向／橫向手機、輪盤／Move Undo／Standby／角色查看／Timeline／動畫／Reduced Motion／Fallback 與鏡頭既有操作；Attack 本次無合法目標，未完成瀏覽器確認攻擊。死亡及終局 Restart 未於瀏覽器驗證。
- **Independent Review**：No significant issues found；Product Owner Acceptance 仍 PENDING。
- **Status / Scope**：M5-2A **IMPLEMENTED — PENDING REVIEW**；M5 維持 25%，Overall 42.5%，M5-2B 未啟動。Battle Core／PAS／AI／Reducer／Camera Controller 與使用者圖片未修改；未 Commit／Push。詳細追溯與限制見 [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md)。

## 2026-11-20 — M5-1 Formal Closure (COMPLETED — FORMALLY ACCEPTED)

- **Verified Baseline**：`main` HEAD `ac074cda29ac7dad977d56e9fc720bb17e417205`；GitHub Actions Run [44647602225](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44647602225) SUCCESS。
- **Acceptance / Review**：M5-1（含 UI Refinement Patch 1／2）COMPLETED — FORMALLY ACCEPTED；Independent Code Review APPROVED — MINOR DOCUMENTATION CORRECTIONS；Product Owner Visual Acceptance APPROVED。
- **Traceability / Limitations**：保留先前 Agent Browser PARTIAL／NOT VERIFIED 紀錄；本次文件同步未執行 tests／lint/build，不新增測試通過聲明。
- **Roadmap**：M5 25%（1/4），M5-2 NEXT；Overall 42.5%，Completed Milestones 4/10。
- **Working Tree**：驗收 baseline 起始工作樹乾淨；本次僅更新 Markdown 文件，異動尚未提交，未修改 Production Source／Tests／Assets。

> 以下 M5-1 Patch 2、Patch 1 與 Initial Implementation 項目保留其記錄當時的狀態及驗證結果；當時的 PENDING／PARTIAL／NOT VERIFIED 不代表目前結案狀態，亦不因 Formal Closure 而回溯改寫。

## 2026-11-20 — M5-1 UI Refinement Patch 2 (IMPLEMENTED — PENDING REVIEW)

- **HUD Layout**：桌面面板移至底部偏左，寬 68vw／上限 1280px 並置於 CG 前方；手機保留緊湊全寬版。CG 尺寸及比例不變。
- **Indicator / CG Mask**：箭頭調整為桌面 62px、手機 50px，錨點略靠近角色頭部；CG 後方漸層遮罩延伸至完整 viewport 高度，寬度依立繪原始比例計算，左側 alpha 30%、45% 位置 20%，向右淡至透明；手機定位納入立繪底部避讓距離。偽元素與立繪均不攔截 Pointer Events。
- **HUD Finish**：底部資訊面板採用黑色水平漸層（alpha .7 至 .5 at 80% 至 0），圓角 48px；不加入金色邊框、陰影或 backdrop blur。
- **Mapping Test Alignment**：保留現有 `女主-戰鬥1.png` mapping（1024×1536），不變更資產選擇；修正 HUD test URL assertion 以符合來源。
- **Browser Verification**：桌面 1232×862 實測 HUD 寬 68%、CG 高 86%；遮罩上下邊界延伸至 viewport 邊緣（誤差小於 1px）、寬度依立繪比例。HUD 背景在桌面與手機 390×845 均實測為目前 CSS 的水平黑色漸層，面板 border-radius 為 48px；手機無水平溢位且操作按鈕位於 viewport 內。先前 Patch 2 已確認 Canvas 收到 CG／Mask 區域 pointer event、Move／Cancel、Attack／Cancel、Standby 與 Active Unit 更新；本次為 CSS 調整，未重測操作流程。Reduced Motion 停用箭頭動畫。Result Overlay 未在瀏覽器觸發。
- **Automated Verification**：先前 Patch 2 基準 `npm test` 279/279 PASS、Lint PASS；本次 CSS 後續調整執行 `npm run build` 與 Diff Check PASS，未重跑 tests／lint。Build 的 1,021.91 kB Battle Chunk warning 保留。
- **Status / Scope**：M5-1 維持 IMPLEMENTED — PENDING REVIEW，Product Owner Acceptance PENDING；M5／Overall 百分比不變。未修改 Battle Core、PAS、AI、Roster、Unit Position、Restart Authority 或使用者素材；未 Commit／Push。

## 2026-11-20 — M5-1 UI Refinement Patch 1 (IMPLEMENTED — PENDING REVIEW)

- **Visual Refinement**：角色 CG 使用透明背景戰鬥圖並依 viewport 響應縮放；HUD 改用 ATK／MOV／DEF 圖示與正式 Unit 數值，移除沒有狀態資料時的空容器；我方 overhead name／HP 僅在 presentation 隱藏，敵方資訊保留。
- **Active Unit Indicator**：透過 Drei `Html` 對應 PAS Active Unit 世界座標，使用 click-through overlay 並支援 reduced motion；不改 Battle Core 或 Unit Position。
- **Automated Verification**：`npm test` 279/279 PASS（新增 3 項 Unit Presentation 測試）；Production Route Integration 7/7、HUD 4/4、Unit Presentation 3/3 PASS；Lint、Build、Diff Check PASS。Battle Chunk 1,022.08 kB，>500 kB warning 保留。
- **Browser Verification**：實際 WebGL 畫面觀察 CG 86% viewport 高度、PAS 切換後指標更新、敵方標籤保留；六種 viewport 無水平溢位；立繪覆蓋區 pointer event 仍到達 Canvas；Reduced Motion 停用指標動畫；主選單 Route unmount／re-entry 後新 Session 與指標重設。
- **Limitations / Status**：Browser Move／Attack／Cancel 與 Victory／Defeat／Restart 流程未完成（P-BV09、P-BV11 NOT VERIFIED）；P-BV10 僅有 viewport 幾何／溢位量測，標記 PARTIAL。後續 WebGL fallback 與 context-type diagnostic warning 使 P-BV12 為 PARTIAL，GPU lifecycle 不作通過宣告。Independent Review 與 Product Owner Acceptance PENDING；M5-1 維持 IMPLEMENTED — PENDING REVIEW，M5／Overall 百分比不變，未 Commit／Push。M4 Commit／CI 是歷史基準，不涵蓋本次未提交異動。

## 2026-11-20 — M5-1 Battle HUD Redesign — Initial Implementation (Pre-Patch 1)

- **HUD**：正式 Runtime 改用 Battle HUD 顯示 Active Unit 立繪、HP／SP、屬性、空狀態效果提示、靜態正式攻擊幾何縮圖及既有操作按鈕；保留 Result Overlay、Session／Reducer 與既有戰鬥規則。
- **Roster**：初始我方改為奧黛（assassin）及迪歐（knight），沿用原 ID、職業數值與格位；保留三隻 Goblin、其他職業 Registry／Factory。
- **Verification**：`npm test` 276/276 PASS，Production Route Integration 7/7 PASS，HUD helper 4/4 PASS；Lint、Build PASS。Build 保留 Battle Chunk 約 1,014 kB 的 >500 kB warning。
- **Agent Browser Verification**：PARTIAL。五種 desktop／mobile viewport 的 HUD 資料、素材載入、面板尺寸、無水平溢位／立繪重疊及按鈕／主選單操作均已檢查；WebGL fallback 阻止 3D／OrbitControls 驗證，Screenshot Capture 不可用。記錄到 Three.js Clock deprecated 與 PCFSoftShadowMap removed warnings。
- **Status / Scope**：Independent Review 與 Product Owner Acceptance PENDING；M5-2～M5-4 未開始，M5-5 未於目前 Roadmap 定義；M4 維持 100%，Overall 40%。工作樹未提交，未 Commit／Push；保留 11 個使用者未追蹤 UI 素材，不修改、不暫存。M4 的 Git／CI 僅為既有驗證基準，不涵蓋本次異動。

## 2026-11-20 — M4 Formal Closure & Documentation Synchronization

- **Formal Acceptance**：M4-4A **COMPLETED — FORMALLY ACCEPTED**；M4-4B、M4-4C **COMPLETED — FORMALLY ACCEPTED WITH LIMITATIONS**；VA1 **COMPLETED — ACCEPTED**；M4 Combat System 與 M4 **COMPLETED — FORMALLY ACCEPTED**。Architecture Review APPROVED、Independent Code Review APPROVED WITH LIMITATIONS、Product Owner Acceptance APPROVED。
- **Verified Repository / CI**：Branch `main`、Commit `b21b36c8b8343865b8abd457cdd70c8b332dfc7b`、GitHub Actions Run [44617918846](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44617918846) SUCCESS；GitHub Pages Deployment SUCCESS。CI log 確認 271/271 Automated Tests PASS；Production Route Integration 6/6、ESLint、Production Build 與 Agent Diff Check PASS。
- **Product Owner Acceptance**：2026-11-20 BV-C01～C14 14/14 PASS。該功能驗收於 VA1 前取得並由正式結案採認，不是 VA1 後重新執行的 Browser Regression。Agent 原始 PARTIAL／NOT VERIFIED 紀錄維持原狀；PO BV-C13 PASS 不表示 GPU disposal 已完整驗證。
- **VA1 Review / Traceability**：VA1-01 APPROVED；VA1-02 APPROVED WITH LIMITATIONS；VA1-03 APPROVED WITHIN REACT HARNESS SCOPE；VA1-04 PARTIAL — DEFERRED；VA1-05／06／07 APPROVED。C-T01～C-T36 36/36 PASS（依各項範圍與限制）；AC-C01～C45 統計為 40 PASS、1 PASS WITH APPROVED LIMITATIONS、4 PARTIAL — APPROVED DEFERRAL。
- **Residual Verification**：RV-M4-4B-01／03 CLOSED — VERIFIED；RV-M4-4B-02 PARTIAL — DEFERRED TO TD-010；RC-M4-4B-07 ACCEPTED WITH LIMITATIONS；RC-M4-4B-08 CLOSED。B-T06 維持 Automated PARTIAL；B-T30／AC-B30 的 GPU Lifecycle 維持 PARTIAL 並核准延後。
- **TD-010**：14/14 observed Context Loss identity matches、final Route exit 後 0 connected Canvas、JS Heap 約 93.02–110.18 MB、Final Menu Heap 107,159,387 bytes；`renderer.info.memory`、GPU Disposal 與長時間資源穩定性 NOT VERIFIED。沒有已確認可重現的 Resource Leak，但不宣稱不存在 Leak；建議於 M10 效能／穩定性窗口進一步量測。TD-010 維持 PARTIALLY RESOLVED；其他技術債與 UX Backlog 未變更。
- **Roadmap**：M1–M4 100%；M5–M10 0%；Completed Milestones 4/10；Overall 40%。M5 — 戰鬥 UI／UX 為 NEXT — PENDING DEVELOPMENT。M4 Closure 不宣告所有 GPU 資源已完整驗證。
- **Scope / Verification**：本紀錄依 2026-11-20 Formal Closure 決議同步；Verified Commit／CI 是已驗證基準，不是本次文件異動的提交或 CI。Closure documentation changes 尚未提交；不包含 Runtime、Test Source、Dependency 或 User-owned Asset 異動，不 Commit／Push。

> 下列 VA1／M4-4B 記錄保留各階段當時狀態，是歷史快照；其 Review、Acceptance、M4／Roadmap 目前狀態由本 Formal Closure 記錄取代。Agent 原始驗證結果仍按原證據保留。

## 2026-11-20 — M4-4C Verification Addendum 1 (Historical Snapshot — Review Pending)

- **Baseline**：VA1 以 `main`／HEAD `5006b4bb618088d0d342a2313c1a4b60a526d7da` 為基準；GitHub Actions Run [44614674924](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44614674924) SUCCESS，該 CI 不涵蓋本次未提交 Test／Documentation changes。
- **Production Lifecycle Tests**：原有 5 項 Route Integration Tests 保留；新增正式 Victory／Defeat Overlay Route unmount 測試，完整檢查離場 cleanup、新 ACTIVE Session 與舊 callback 隔離。十次有效 Restart 現逐次檢查 Generation、初始 State、Controller／Frame／Canvas cleanup 與穩定資源數量。
- **Timer／Listener**：App hash listener 在 StrictMode Route transition／unmount 維持單一／零；Production Battle Runtime 無 `setTimeout`／`setInterval`；測試追蹤 Route、Restart 與 unmount 操作中的 `queueMicrotask`，確認排程 work 完成、pending 為零。
- **Browser WebGL Measurement**：完成 2 次 warm-up、10 次量測 Route 往返；initial C1/G1 與新建 C2/G2～C14/G14 共 14 個 Context 均觀察到對應 Context Loss，沒有 Restore event。最後返回 Menu 並等待 1.5 秒後，connected Canvas 為 0；只讀 Renderer Probe 未能取得 `renderer.info.memory`。逐次 Heap／Identity 資料與 Console warnings 見 [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md)。GPU disposal／無 leak 仍 NOT VERIFIED。
- **Automated Verification**：`npm test` 271/271 PASS；Production Route Integration 6/6 PASS；`npm run lint` PASS；`npm run build` PASS，既有 >500 kB Battle Chunk warning 保留；CRLF-aware `git diff --check` PASS。
- **Status／Scope**：RV-M4-4B-01／03 evidence collected、RV-M4-4B-02 PARTIAL，全部待 Independent Review；RC-M4-4B-07 維持 PARTIAL。Product Owner Acceptance 與 M4-4 Formal Acceptance PENDING；M4 為 75%、Overall 37.5%。只修改一個既有 Test Source 與必要文件；無 Runtime／Battle Core／`public/assets/` 異動，未 Commit／Push。

## 2026-11-20 — M4-4C Lifecycle Verification (Historical Snapshot — Pending Review)

- **Baseline**：`main`／HEAD `3705dfe0737fe0df1798f280c5e1c5c8056f8ad9`；GitHub Actions Run [44607801214](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44607801214) SUCCESS，對應開始驗證基準，不涵蓋本次未提交檔案。
- **Production Integration**：新增 `tests/battle.route.lifecycle.integration.test.mjs` 與兩個 test-only R3F／Drei fixture。正式 App／BattleScene／Session Host／Runtime／Scenario／Reducer／Outcome／Restart wiring 未 Mock；視覺元件與 WebGL surface 替換為測試 Adapter。新增 5 項 Integration Tests，涵蓋 10 次 Route 重入、同 ID 的 Move／Player／Attack／AI／Death Callback 隔離、Victory／Defeat 與 10 次有效 Restart。
- **Automated Verification**：`npm test` 270/270 PASS（原 265 項保留，新增 5 項）；Route Integration 5/5 PASS；`npm run lint` PASS；`npm run build` PASS，既有 >500 kB Battle Chunk warning 仍存在；CRLF-aware Diff Check 與新增檔案 whitespace inspection PASS。
- **Agent Browser Verification**：實際操作 Move／Undo／Standby、合法攻擊（劍士對哥布林 A，15 點傷害）與敵方移動；Main Menu／Battle 往返 12 次（2 次 warm-up、10 次量測）。BV-C01～C03 為 PARTIAL；BV-C08 PASS；BV-C12／C13／C14 PARTIAL；BV-C04～C07、C09～C11 NOT VERIFIED。不得以 Node／jsdom 結果替代 Browser 結果。
- **Resource Measurements**：穩定 Route 有 1 個 Canvas；量測觀察 13 次 Canvas／WebGL 建立、11 次 Context Loss，最後一次未確認；JS Heap 約 91–113 MB 波動，未取得有效 `renderer.info`。不據此宣稱 GPU Resource Disposal 通過或存在 Resource Leak。
- **Status / Limitations**：M4-4C 為 IN PROGRESS — PARTIAL VERIFICATION；RV-M4-4B-01～03 有部分證據但尚待 Independent Review，RC-M4-4B-07 維持 PARTIAL。M4 75%、Overall 37.5%；PO Acceptance 與 M4-4 Formal Acceptance PENDING。本次未修改 Production Runtime 或 Battle Core；僅新增 Test Source Code 與同步文件，未 Commit／Push。另有非本任務 `public/assets/` 二進位異動於工作樹中，未碰觸或回復；詳細矩陣與目前狀態見 [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md)。

## 2026-11-20 — M4-4B Conditional Closure & Documentation Synchronization (Historical Snapshot)

- **Closure Decision**：M4-4B Implementation **COMPLETED**；Architecture Review **APPROVED**；Independent Code Review **APPROVED WITH LIMITATIONS**；Product Owner Acceptance **APPROVED**；Conditional Closure **APPROVED**。M4-4 Formal Acceptance 仍 **PENDING**；未啟動 M4-4B Patch 1。
- **Verified Repository / CI**：Branch `main`、Commit `e299fa48e28d16e24aadba9cc7925bedf4d53895`；GitHub Actions Run [44605672030](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44605672030) SUCCESS，Head SHA 相符。該實作提交包含 16 個異動檔案，Battle Core Modification 0。
- **Verification Baseline**：265/265 Automated Tests、29/29 React Integration Tests、2/2 Session Tests、Lint 與 Build PASS；Build 保留既有 >500 kB Battle Chunk warning。Automated Test Traceability 維持 28 PASS／2 PARTIAL（B-T06、B-T30）；綜合 Acceptance Criteria 為 36 PASS／1 PARTIAL（AC-B30）。
- **Product Owner Browser Acceptance**：2026-11-20 BV-B01～BV-B10 全部 PASS，Final Result 10/10 PASS — ACCEPTED。這是 Product Owner 驗收，不是 Agent 自動化或 Agent Browser Verification 結果。
- **Independent Review**：RC-M4-4B-01～06 APPROVED；RC-M4-4B-07 PARTIAL，移交 M4-4C；RC-M4-4B-08 已以文件同步修正，未代替 reviewer 另行批准。
- **Traceability / Remaining Verification**：AC-B07／B08 依 PO BV-B06 更新為 PASS；AC-B09 依 PO BV-B09 更新為 PASS；AC-B30 維持 PARTIAL。RV-M4-4B-01 Production Route Lifecycle Cleanup、RV-M4-4B-02 WebGL Resource Lifecycle、RV-M4-4B-03 Production Runtime Integration Coverage 均移交 M4-4C；此為待驗證項目，非已確認缺陷或已完成驗證。AI Capability Isolation 依 Runtime Dispatch Ownership 成立，不宣稱底層 Capability Session Binding 已實作。
- **Historical Browser Record**：下方 M4-4B Implementation entry 保留 Agent 當時 WebGL fallback 與 PARTIAL／NOT VERIFIED 結果，不回溯改寫。Product Owner 10/10 Acceptance 為獨立後續證據。
- **Roadmap / Scope**：M4-4B **COMPLETED — CONDITIONALLY ACCEPTED**；M4-4C **NEXT — PENDING DEVELOPMENT**。M4 維持 75%、Overall 37.5%。本次僅同步文件，不修改 Runtime／Test Source Code，不開始 M4-4C，未 Commit／Push；TECHNICAL_DEBT 與 UX Backlog 未修改，既有狀態保留。

## 2026-11-20 — M4-4B Implementation (Historical Snapshot — Pending Review)

> 歷史快照：以下為 M4-4B 初始實作與 Agent Browser Verification 狀態；後續 PO Acceptance、Independent Review 及 Conditional Closure 見上方紀錄。Agent 原始 WebGL limitation 與 BV 結果不回溯改寫。

- **Implementation**：新增單一 Victory／Defeat `BattleResultOverlay`，由正式 `BattleState.outcome` 驅動；以 `BattleSessionHost` Generation 與 Keyed `BattleSessionRuntime` Remount 實作 Restart 和 Session Isolation。重用 `createBattleScenarioSession()` 重新注入正式 Win／Loss Condition 並建立初始 State。
- **Lifecycle / Reset**：Battle Reducer／Dispatch、AI Hook、Attack／Death Hooks、Frame Controllers、Canvas、Camera、選取及 Hover 等狀態全部屬於單場 Runtime。舊 Callback 維持舊 Dispatch；同 ID 重用仍隔離。測試直接證明 Frame Subscription cleanup；底層 GPU 資源釋放未宣稱已壓力驗證。
- **Automated Verification**：`npm test` 265/265 PASS；`tests/battle.animation.react.integration.test.mjs` 與 `tests/battle.session.test.mjs` 共 31/31 PASS（29 React Integration + 2 Session tests）；ESLint、Production Build 與 Diff Check PASS。Build 保留既有 >500 kB Battle Chunk warning。
- **Browser Verification**：BV-B01 PARTIAL；Battle Route 可載入，但測試瀏覽器顯示 WebGL fallback，截圖只見背景與 HUD，未能執行 3D 戰鬥；BV-B02～B09 NOT VERIFIED；BV-B10 PARTIAL（載入時沒有觀察到 console/page errors，但 WebGL fallback 持續存在）。未將 Node／jsdom 測試當作 Browser Verification；Product Owner Acceptance PENDING。
- **Baseline / Git**：開始基準為 `main`／Commit `41b43c77e849276847c8c643deedd3a7ca0b0747`／GitHub Actions Run `44596893220` SUCCESS。此 Commit／CI 僅為開始基準，不涵蓋本次未提交 M4-4B 異動；本次未 Commit／Push。
- **Roadmap / Scope**：M4-4B **IMPLEMENTED — PENDING REVIEW**；M4-4C **PENDING DEVELOPMENT**。M4 維持 75%、Overall 37.5%。未實作 EXP、Gold、Loot、Level Up、Story、Save／Load 或新 Condition；TD-018／019／021 與 UX Backlog 未變更。

## 2026-11-20 — M4-4A Formal Closure

- **Formal Acceptance**：M4-4A End Condition Framework & Battle Outcome **COMPLETED — FORMALLY ACCEPTED**；Patch 1 **COMPLETED — ACCEPTED**；Final Review Correction **COMPLETED — VERIFIED**。Architecture Review、Independent Code Review、Product Owner Acceptance 與 Formal Closure 均 APPROVED。
- **Review Findings**：CR-M4-4A-01～05 全數 CLOSED。保留各 Finding 原始 Resolution、測試證據，以及 Final Review／Final Correction 階段的歷史狀態，見 [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md)。
- **Product Owner Browser Acceptance**：2026-11-20 Patch 1 Post-Patch Browser Regression：BV-A01～A05 5/5 PASS — ACCEPTED。2026-11-19 Patch 前 Product Owner Acceptance 與 Agent 原始 PARTIAL／NOT VERIFIED 紀錄仍分開保留。
- **Verification Baseline**：246/246 Automated Tests、12/12 React Integration Tests、AC 32/32、原始 Test Traceability 28/28、Patch Test Traceability 9/9 PASS；Lint、Build、Diff Check PASS。Build 保留既有 >500 kB Battle Chunk warning。
- **Verified Repository / CI**：當時記錄的 Branch `main`；Formal Closure 文件後續納入 Commit `41b43c77e849276847c8c643deedd3a7ca0b0747`，GitHub Actions Run [44596893220](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44596893220) SUCCESS。M4-4A Feature Commit 為 `1cce94613791548cc1717942b72d1513487db857`；原始 Formal Closure 快照中的 `5048fea...`／Run `44595045755` 保留為當時基準。
- **Architecture / Roadmap**：Strategy／DI、Configuration Immutability、Battle Session、Outcome Trigger Boundary、Motion／Reservation Barriers、DEFEAT Priority、Pre-PAS Resolution 與 Terminal Guards 保持不變。Restart Session Isolation、Save／Load Serialization 與 Round Limit Semantics 未實作。M4-4B 為 NEXT — PENDING DEVELOPMENT；M4-4C PENDING DEVELOPMENT；M4-4 整體仍 IN PROGRESS。M4 75%、Overall 37.5%。
- **Technical Debt / UX Backlog**：未修改；TD-018、TD-021 維持 OPEN，TD-019 維持 CLOSED — M4-3 FORMAL ACCEPTANCE。
- **Scope**：僅同步文件，無 Runtime Source Code 或 Test Source Code 異動；不 Commit／Push。

## 2026-11-20 — M4-4A Final Review Correction

> 歷史快照：以下記錄 Final Review Correction 完成後、Formal Closure 前的狀態；目前核准狀態見本文件上方「M4-4A Formal Closure」。

- **Test Correction**：在既有 `Win and loss managers cover single, ANY, ALL, and default ANY truth tables` 測試中補上 WinCondition ALL 與 LossCondition ALL 的 all-false assertions；未新增測試案例、未修改 Runtime Source Code。
- **Traceability**：依 M4-4 Revision 2 原始規格建立 T-01～T-28 逐項追溯；Patch 1 額外情境另列 P-T01～P-T09。既有 TEST-M4-3-01 的 10 項 React Integration Tests 保留，並與 configured Victory／Defeat Lifecycle tests 分開列證。
- **Automated Verification**：`npm test` 246/246 PASS；`npm run lint` PASS；`npm run build` PASS，保留既有 >500 kB Battle Chunk warning；`git -c core.whitespace=cr-at-eol diff --check` PASS。
- **Verified Repository / CI Baseline**：本機 `main` HEAD 為 `1cce94613791548cc1717942b72d1513487db857`；GitHub Commit 查詢確認 SHA 相符。[GitHub Actions Run 44592995763](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44592995763) — SUCCESS（Deploy to GitHub Pages，Head SHA 相符）。該 Run 僅代表已提交 Commit，不涵蓋本次未提交 correction。
- **Review / Acceptance**：Architecture Review APPROVED；Code Review APPROVED WITH MINOR CORRECTIONS。CR-M4-4A-01／02／04 標記 APPROVED；CR-03／05 本次修正已完成並通過本機驗證。Patch 前 Product Owner Browser Acceptance 仍為 5/5 PASS；Patch 後 Agent BV-A01 PARTIAL、BV-A02～A05 NOT VERIFIED；Patch 後 Product Owner Acceptance PENDING。未宣告 M4-4A Formal Acceptance。
- **Git / Scope / Roadmap**：僅變更既有測試 Assertion 與七份文件；工作樹尚未提交／推送，無 Runtime Source Code 異動。M4 75%、Overall 37.5%；M4-4B／C 尚未開始。

## 2026-11-19 — M4-4A Patch 1 — End Condition Hardening & Verification

- **CR-M4-4A-01 — Configuration Immutability**：補充 Concrete Strategy 作者契約；新增 Test-only nested configuration Strategy，以明確欄位快照證明外部修改不影響設定。未新增通用任意物件遞迴 Freeze，也未替既有 AllDead 加入無意義設定。
- **CR-M4-4A-02 — Outcome Trigger Boundary**：移除 Reducer wrapper 對所有 Action 的無條件 Outcome Evaluation。只在合法 Move Finish／Cancel、有效 Lifecycle Completion 與 Pre-PAS 檢查結算；初始化維持 ACTIVE，初始條件在第一個有效安全觸發點檢查；無效／未授權 Action 與 stale／duplicate callback 不觸發結算。
- **CR-M4-4A-03／04 — Tests & React Integration**：擴充 ANY／ALL truth table、Constructor parameter、Attack Motion／Reservation、AI Gateway 終局 guard、雙向終局晚到事件及 configured AllDead session progression；React Controller Harness 掛載真實 `AttackAnimationController`、`DeathAnimationController`／`useDeathAnimation`，並使用 Battle Session／Reducer／Win／Loss AllDead 驗證 Victory 與 Defeat 的分階段 Impact／Attack Complete／Death Complete。
- **Automated Verification**：`npm test` 246/246 PASS（相較 Patch 起始基準 239 項新增 7 個測試案例）；`npm run lint` PASS；`npm run build` PASS，既有 >500 kB Battle Chunk warning 保留；`git -c core.whitespace=cr-at-eol diff --check` PASS，另檢查未追蹤檔案 whitespace。
- **Browser**：Product Owner 已提供 2026-11-19 的 Patch 前 BV-A01～A05 5/5 PASS；此證據與 Agent 原先 PARTIAL／NOT VERIFIED 歷史分開保存。Patch 後 BV-A01 PARTIAL（成功移動、攻擊模式顯示 0 個合法目標、待命推進至 Player Turn 2）；BV-A02～A05 NOT VERIFIED，尚未取得 Patch 後 Product Owner Acceptance。
- **Documentation / Stage Scope**：同步 README、Development Status、Architecture、Combat System、Game Design、Roadmap、Changelog；M4-4B 為 Overlay／Restart／Session Isolation，M4-4C 為 Final Regression／Browser Verification／Independent Review／Formal Acceptance。TD-018、TD-019、TD-021 與 UX Backlog 狀態未調整。
- **Review / Git（Patch 1 當時快照）**：CR-M4-4A-01～05 已實作處理；當時尚待獨立 Final Review，未宣告 Formal Acceptance，且未 Commit／Push。其後 Patch 1 已納入 Commit `1cce94613791548cc1717942b72d1513487db857`，GitHub Actions Run `44592995763` SUCCESS。Final Review Correction 的目前工作樹狀態見本文件最上方；M4 仍 75%，Overall 37.5%。

## 2026-11-19 — M4-4A End Condition Architecture & Battle Resolution

> 歷史快照：以下記錄 M4-4A 原始實作階段的驗證與 Review 狀態；目前正式結案狀態見本文件上方「M4-4A Formal Closure」。

- **Implemented locally**：新增 EndCondition Strategy、唯讀 BattleConditionContext、ANY／ALL Win／Loss Manager、共用 AllDead 查詢、Outcome Resolver、Battle Session／Reducer Injection，以及 Production Scenario 明確配置。Outcome 只在 Motion／Death／Combat Reservation 安全結束後解析；DEFEAT 優先，終局後 Reducer 與 AI Gateway 阻擋新指令及晚到 Callback。
- **Tests**：新增 16 項 `tests/end-conditions.test.mjs`；`npm test` 239/239 PASS，原 223 個測試案例保留。另測試有效 Move Motion 完成前不提交 Outcome。既有 AI 測試斷言由欄位不存在更新為 `outcome === null`，以符合新增 ACTIVE Outcome Contract，保留原本「不自主宣告終局」的測試意圖。
- **Verification**：`npm run lint` PASS；`npm run build` PASS，既有 >500 kB Battle Chunk warning 保留；`git -c core.whitespace=cr-at-eol diff --check` PASS（保留 Windows CRLF 行尾）。
- **Browser**：BV-A01 PARTIAL（載入場景、操作模式／待命及多輪 AI 回合流程；未確認成功移動／攻擊）；BV-A02～A05 NOT VERIFIED。未以自動化測試代替瀏覽器證據；無 Overlay 屬 M4-4A 預期範圍。
- **Reviews / Acceptance**：M4-4A 尚待獨立 Architecture／Code Review 及 Product Owner Acceptance；不得標記為正式結案。
- **Git / Scope（初始 M4-4A 實作快照）**：Session Start HEAD／本機 `origin/main` tracking ref 為 `11b1652d1702376d703da8eed4cb83586e23401e`；該次程式、測試與文件異動當時未提交／推送。後續 M4-4A Patch 1 已納入 Commit `1cce94613791548cc1717942b72d1513487db857`，Run `44592995763` SUCCESS。M4 維持 75%，Overall 37.5%；M4-4B／C 尚未開始。

## 2026-11-19 — M4-3 Formal Closure

- **Milestone**：M4-3 Enemy AI 正式驗收完成，狀態 **COMPLETED — FORMALLY ACCEPTED**。
- **Implementation**：Patch 1 修正 Direct Attack Intent 與 `MOVE_COMPLETED`／Move-to-Attack；Patch 2 修正 Attack Animation Clock Initialization Race；Patch 3 完成 AI Gateway／Capability、Enemy Pre-impact Abort Contract 與 Animation Lifecycle Hardening。
- **TEST-M4-3-01**：10 項 React Controller Integration Tests PASS；ReactDOM／StrictMode 掛載真實 Controller，受控 Frame 驅動正式 Lifecycle Runtime，callbacks 派送至正式 Reducer。測試不是 WebGL 或完整 E2E；細節見 [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md)。
- **Automated Verification**：223/223 Tests PASS、ESLint PASS、Production Build PASS；保留既有 >500 kB Battle Chunk warning。
- **Acceptance / Reviews**：Product Owner Browser Acceptance PASS（2026-11-19）；Architecture Review APPROVED；Code Review APPROVED；CR-M4-3-01／02／03 及 TEST-M4-3-01 CLOSED。
- **Git / CI**：Repository Commit `4043459cfa3cb884aa9d9a6653ed646ef59975a9`；GitHub Actions Run [44500720991](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44500720991) SUCCESS，Head SHA 相符。M4-3 gameplay Commit `6052c6197588b00c8732f34b7dbda0a3dc696a25` 的 Run `44496931887` SUCCESS。
- **Technical Debt**：TD-019 **CLOSED — M4-3 FORMAL ACCEPTANCE**；其他既有技術債狀態不因本次結案而自動改變。
- **Roadmap**：M4 75%；Overall 37.5%；下一階段 M4-4 **NEXT — PENDING DEVELOPMENT**，尚未開始。
- **Scope**：僅同步文件；未修改 Production Code，未開始 M4-4，未 Commit／Push。

## 2026-11-19 — M4-3 TEST-M4-3-01 — React Controller Lifecycle Integration Evidence

> 歷史快照：下列狀態記錄於 M4-3 Formal Closure 前；目前結案狀態以本文件最上方的 M4-3 Formal Closure 為準。

- **Added**：10 個 ReactDOM 整合測試，真正掛載 `AttackAnimationController` 與 `useAttackAnimation`；React StrictMode 執行 Effect Replay，受控 `useFrame` harness 在 passive Effect 前推進正式 Lifecycle Runtime。
- **Verified**：Impact／Complete／Abort callbacks 透過 React hook dispatch 至正式 `battleReducer`；涵蓋首幀 Clock 初始化、delta 邊界、同幀事件順序與 exactly-once、Attack ID 轉換／錯配、Player／Enemy Abort、HP、Turn 與 Death Motion Barrier。AC-01～AC-20 矩陣見 [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md)。
- **Automated Verification**：本次本機 `npm test` 223/223 PASS、`npm run lint` PASS、`npm run build` PASS；保留既有 Battle Chunk > 500 kB warning。
- **Scope / Fixture**：僅以 Node + jsdom ReactDOM Fixture 驗證 Controller Lifecycle；視覺子元件 stub 為 null，未驗證 3D／Browser 視覺與 `onFeedbackComplete` UI 行為；沒有修改戰鬥規則。
- **Git / CI**：HEAD 與本機 `origin/main` tracking ref 仍為 `6052c6197588b00c8732f34b7dbda0a3dc696a25`。Run `44496931887` SUCCESS 僅對應該已提交 Commit，不涵蓋本次未提交測試與文件異動；未 Commit／Push。
- **Acceptance / Review**：2026-11-19 Product Owner Browser Acceptance 是既有 M4-3 gameplay 驗收，本次沒有 Browser Verification 或新的 Product Owner Acceptance。TEST-M4-3-01 證據待獨立 Architecture／Code Review；M4-3 維持 IMPLEMENTED — PENDING FORMAL CLOSURE，TD-019 維持 APPROVED FOR CLOSURE — PENDING FORMAL CLOSURE，M4 50%、Overall 35.0%、M4-4 PENDING。

## 2026-11-19 — M4-3 Patch 3 — Capability, Abort, and Animation Lifecycle Hardening

> 歷史快照：下列實作驗證紀錄更新時 Patch 3 尚未提交；目前 Commit、CI、Browser Acceptance 與 Review 最新狀態請見本文件最上方的 M4-3 Formal Closure。

- **Changed**：AI Action signer 從純 Decision Engine 移至 `battle.ai.gateway.ts`；Gateway 僅依目前 Battle State 導出的 Controller Intent 發行 frozen Action，使用私有 identity set 授權，Reducer 繼續完整重驗證。
- **Fixed**：Enemy AI Pre-impact Abort 在清除 Reservation 後 queue 該 Turn Completion，並沿 Pending Resolver 等待阻擋 Motion；Player Pre-impact Abort 行為不變。
- **Changed / Verified**：React Attack Controller 與 Node Frame Harness 共用 Lifecycle Runtime；新增首幀 Clock race、Effect cleanup replay、Attack ID mismatch、同一 Frame Impact／Complete exactly-once 回歸。
- **Verification**：本機 `npm test` 213/213 PASS；`npm run lint` PASS；`npm run build` PASS（既有 Battle Chunk > 500 kB warning）。
- **Browser / Acceptance / CI**：Patch 3 未執行 Browser Verification，未取得新的 Product Owner Acceptance 或 GitHub CI；不沿用 Patch 1／2 結果。
- **Status**：IMPLEMENTED；Architecture Review／Code Review／Formal Closure PENDING；TD-019 PENDING REVIEW；M4 50%、Overall 35.0%、M4-4 PENDING。
- **Git / Scope at Snapshot**：該次紀錄時 Patch 3 尚未提交／推送；此歷史狀態已由下方 Review & Verification Status Update 取代。

## 2026-11-19 — M4-3 Patch 3 — Review & Verification Status Update

> 歷史快照：TEST-M4-3-01 尚待補證的狀態為當時紀錄；最新整合測試結果與審查狀態請見本文件最上方。

- **Git Baseline**：`main`、`origin/main`、工作樹均已核實；Commit `6052c6197588b00c8732f34b7dbda0a3dc696a25`，`Refactor AI logic and introduce AI action gateway`。
- **CI**：GitHub Actions Run [44496931887](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44496931887) — SUCCESS；Head SHA 與上述 Commit 相符。
- **Automated Verification**：213/213 Tests、ESLint、Production Build PASS（Agent 回報）。
- **Product Owner Acceptance**：Browser Acceptance PASS（2026-11-19）。
- **Review**：Architecture Review／Code Review CONDITIONAL PASS；CR-M4-3-01 AI Gateway Capability Boundary PASS；CR-M4-3-02 Enemy Pre-impact Abort Contract PASS；CR-M4-3-03 Architecture PASS，但 React-mounted Controller Integration Test 待補證。
- **Outstanding**：TEST-M4-3-01 — React Controller Lifecycle Integration Evidence；須補足 React mount、Effect Replay、Frame 驅動與 Callback Dispatch 整合測試，或取得 Product Owner 正式豁免後列為後續技術債。
- **Status**：M4-3 IMPLEMENTED — PENDING FORMAL CLOSURE；TD-019 APPROVED FOR CLOSURE、待 Formal Closure。M4-4 PENDING；M4 50%；Overall 35.0%。完成測試要求或取得正式豁免前不調整完成率。

## 2026-11-19 — DOC-M4-3-01 — M4-3 Git Baseline Synchronization

> 歷史快照：以下記錄 M4-3 Patch 1／2 文件同步時尚待 Review 的狀態；後續 Patch 3、TEST-M4-3-01 與正式結案已更新其狀態。

- **Baseline**：M4-3 Enemy AI、Patch 1 與 Patch 2 已納入 Git Commit `a912457ae7eb159bd7f5411217f8548e30956e67`，Commit 訊息為 `feat: Implement AI decision-making for battle actions`。
- **Added**：純 AI 決策引擎、Capability Authorization、Reducer Revalidation、AI Controller、Direct Attack、Move-to-Attack 與 Movement Completion。
- **Fixed / Patch 1**：修正 BUG-M4-3-001 Direct Attack Intent 與 BUG-M4-3-002 `MOVE_COMPLETED`／Move-to-Attack 銜接。
- **Fixed / Patch 2**：修正 BUG-M4-3-003 Attack Animation Clock Initialization Race；有效首個 Frame 建立相符 0ms Clock，不再於 Impact 前誤派 Pre-impact Abort。
- **Verification**：`npm test` 210/210 PASS；`npm run lint` PASS；`npm run build` PASS；GitHub Actions Run `44489947675` SUCCESS。
- **Acceptance**：Product Owner 已確認主要 M4-3 Browser Acceptance PASS；特殊未完成的戰術、Console Abort、長時間或特殊 Death Browser Scenarios 保持個別 NOT VERIFIED。
- **Review**：Architecture Review／Code Review PENDING；M4-3 尚未正式結案；TD-019 維持 PENDING REVIEW；M4 50%、Overall 35.0%、M4-4 PENDING。
- **Scope**：本紀錄同步持久化文件，不取代正式審查，也未變更來源程式或測試。

## 2026-11-19 — M4-3 Enemy AI — IN DEVELOPMENT / PENDING ACCEPTANCE

> 歷史快照：以下狀態為實作與初次驗證當時的紀錄；最新 Git／CI／Acceptance 基準請見本文件最上方的 DOC-M4-3-01。

- **Added**：純 Rule-based Tactical AI，依 Direct Attack、Kill／Applied Damage、Move-to-Attack、Path-cost Approach、No-oscillation Standby 產生確定性 Decision。
- **Added**：私有 Capability AI Action、Faction-neutral Combat Revalidation、Turn-scoped AI Progress 與 StrictMode-safe React Controller。
- **Changed**：敵方移動重用 Movement Motion；敵方攻擊重用 Attack Reservation、Impact、Confirmed Impact、Death Barrier 與 Turn Completion。
- **Removed**：Development-only `simulate-enemy-standby` UI／Reducer 入口。
- **Verification**：`npm test` 203/203 PASS（新增 22 項 AI Decision／Reducer／Lifecycle Tests）；`npm run lint` PASS；`npm run build` PASS，保留既有 Battle Chunk > 500 kB warning。
- **Browser**：Agent 實測 Enemy Batch 自動由 Turn 6–8 推進至玩家 Turn 9、敵方回合無玩家控制按鈕，並驗證離開／重入後乾淨初始化。特殊戰術、Abort 與 Death Browser Scenarios 尚待 Product Owner Acceptance；對應 Node Deterministic Fixtures 已覆蓋。
- **Status**：M4-3 **IN DEVELOPMENT / PENDING ACCEPTANCE**；M4 維持 50%、Overall 35.0%；M4-4 PENDING；TD-019 PENDING REVIEW。
- **Git / Scope**：未 Commit、未 Push、未開始 M4-4。

## 2026-11-19 — M4-3 Patch 2 — Enemy Impact Regression Fix

> 歷史快照：以下驗證與當時 Product Owner Acceptance 狀態已由最上方 DOC-M4-3-01 的最新基準同步。

- **Fixed / BUG-M4-3-003**：AttackMotion 先被 `useFrame` 觀察、Clock 仍未由 Effect 初始化時，不再誤派 Pre-impact Abort。
- **Root Cause**：Patch 1 Effect-driven AI Attack 暴露既有 Animation Controller 的 Clock Initialization Race；不是 Impact Guard、Damage Formula 或 UI State mismatch。
- **Changed**：首個合法 Frame 以 Attack ID 建立 0ms Clock；非法 Delta／錯誤 Attack ID 仍 Abort。
- **Verification**：`npm test` 210/210 PASS；`npm run lint` PASS；`npm run build` PASS；Diff Check PASS。
- **Trace / Browser**：Attack 1 依序產生 Impact Callback、Reducer ACCEPTED、Applied Damage 10；Ranger HP 80→70，Confirmed Impact 與 Floating Damage 顯示一致，無新增 Blocking Error。
- **Status**：M4-3 **IN DEVELOPMENT / PENDING ACCEPTANCE**；TD-019 PENDING REVIEW；Product Owner Acceptance 未完成。

## 2026-11-19 — M4-3 Patch 1 — Enemy Attack Lifecycle Fix

> 歷史快照：以下「未 Commit／未 Push」與當時 Acceptance 狀態僅描述 Patch 1 的驗證階段；最新提交基準見最上方 DOC-M4-3-01。

- **Fixed / BUG-M4-3-001**：Direct Attack Controller Intent 可獨立驗證，合法 Active Enemy 不落入 Standby。
- **Fixed / BUG-M4-3-002**：Movement Finish 明確轉換 `MOVING → MOVE_COMPLETED`；Controller 使用最新 State 提交同 Turn Attack。
- **Fixed**：Move 後原目標失效時執行一次合法 Direct Target Re-decision，無目標則安全 Standby。
- **Preserved**：Capability、Turn Context、Movement Initiation Lock、Action Economy、Reservation、Impact、Death Barrier、PAS 與 Replay Guard。
- **Verification**：`npm test` 208/208 PASS；`npm run lint` PASS；`npm run build` PASS；`git -c core.whitespace=cr-at-eol diff --check` PASS。Build 保留既有 Battle Chunk warning。
- **Browser**：Ranger 於 Goblin Move-to-Attack 後 HP 80→70；多敵人後續 Direct／Move Attack 循環持續正確扣血，Turn 無重複／卡死，無新增 Blocking Console Error。
- **Status**：M4-3 **IN DEVELOPMENT / PENDING ACCEPTANCE**；M4 50%、Overall 35.0%；TD-019 PENDING REVIEW；未 Commit／Push。

## 2026-11-19 — M4-2 Final Verification Addendum

> 歷史快照：以下記錄 M4-2 完成時的 50%／35.0% 進度與 M4-3 尚未開始狀態；目前 Roadmap 與正式結案狀態以本文件最上方的 M4-3 Formal Closure 為準。

- **Added / FV-01**：同一 Scheduler 連續排程 10,000 個 Near-tie Event，驗證 Turn ID、Battle Time、Round、Remaining Distance 及獨立 Arrival Queue Oracle；不重建 Turn State。
- **Added / FV-02**：直接呼叫 `battleReducer()` 驗證缺少 Turn ID、缺少 Unit ID、過期 Turn ID、錯誤 Unit ID、舊 Standby Replay 及過期 Confirm Attack。
- **Verification**：`npm run lint` PASS；`npm test` 181/181 PASS；`npm run build` PASS。`git diff --check` 在 repository 既有 CRLF tracked files 下將 CR 判為 trailing whitespace；`git -c core.whitespace=cr-at-eol diff --check` PASS，未發現真實 trailing whitespace。
- **Formal Acceptance**：Architecture Review、Code Review、Final Verification 與 Product Owner Browser Acceptance 均 PASS。
- **Status**：M4-2 **COMPLETED — Formal Acceptance Approved**；Patch 1 **COMPLETED**。M4 50%、Overall 35.0%；TD-016／017／020 CLOSED；M4-3 UP NEXT — Enemy AI。
- **Git / CI**：Formal Gameplay Commit `f18f7aab2768e6fa5fcb1620243bf61c3a1779cf`；GitHub Actions Run `44472015253` COMPLETED / SUCCESS（Head SHA 相符）。

## 2026-11-19 — M4-2 Patch 1 — Review Hardening — IMPLEMENTED — Review / Acceptance Pending

- **Fixed / CR-01**：`canUndoLastMove()` 顯式檢查 Movement Initiation Lock；Lock 建立後即使異常保留 `lastMove` 仍不可 Undo。
- **Changed / CR-02**：Confirm Attack 的 UI 與 Reducer 共用 `canConfirmAttack()`；非法 Context、已消耗 Combat Action 或非法目標不建立 Reservation。
- **Added / CR-03**：10,000 次 Near-tie × Round Boundary stress、Epsilon 內外邊界及 1,000 次 Preview／正式排程一致性；Epsilon 未放大。
- **Reconciled / CR-04**：建立 32 項 Planned Scenario Coverage Mapping；既有測試已涵蓋項目以 Test Name／Assertion 對應，未新增空測試。
- **Browser / CR-05**：已實際驗證普通攻擊、23 點傷害、後續 Turn、致命攻擊與實扣 14 HP、死亡阻擋、Timeline 移除、攻擊中離場重入、非 Active Unit 拒絕及多次重入。
- **Verification**：`npm test` 179/179 PASS；`npm run lint` PASS；`npm run build` PASS。既有 Battle Chunk > 500 kB warning 保留。Patch 1 未 Commit、未 Push、無新 CI，未提前宣告正式結案。
- **Closure**：後續 Final Verification 及 Product Owner Acceptance PASS；本 Patch 現更新為 **COMPLETED**。

## 2026-11-19 — M4-2 Individual Action Economy — IMPLEMENTED — Review / Acceptance Pending

- **Added**：Turn-scoped `TurnActionState`、Movement／Combat Action lifecycle、Turn-bound Command Context、Combat Reservation／Consumption、Movement Initiation Lock 與原子 Turn Reset。
- **Fixed**：玩家 `standby` 及 Set Mode、Movement Request、Undo、Target Selection、Confirm／Cancel 等指令不再被下一個 Turn 的 Active Unit 自動重新綁定；同 Context 重複事件為安全 no-op。
- **Fixed**：PAS 先使用全域最小 AV 作為 `deltaTime`，再以獨立 Time Epsilon 建立 Tie Candidate；Time／Distance Epsilon 分離，保留非 Tie Candidate 的正剩餘距離。
- **Added Tests**：Action Economy、Pre-/Post-impact Abort、Turn Reset、Context Replay 與 10,000 次固定速度獨立理論 Oracle；Patch 1 後總測試由 154 增至 179。
- **Verification**：`npm run lint` PASS；`npm run build` PASS。既有 Battle Chunk > 500 kB 警告保留。
- **Browser Verification**：PARTIAL；已驗證 Development／Production 戰場進入、HUD／Timeline、Move 隱藏、Undo、Attack Mode Cancel 保留 Undo、Standby 切換、同步重複 Standby 防跳 Turn、Development Enemy Standby、Production 無 Dev Control、移動中離場重入及 Camera 操作。Three.js 既有兩項 Warning；攻擊／傷害／死亡尚未於本次完整操作。
- **Documentation**：README、Architecture、Game Design、Combat System、Development Status、Roadmap、Technical Debt 與 Changelog 已同步；M4 完成度維持 25%，Project Completion 維持 32.5%。
- **Known Limitations**：M4-3 Enemy AI、M4-4 勝敗、M7 Effect／Skill、正式 Product Owner Acceptance 及 Formal Closure 尚未完成。
- **Git / CI**：Starting HEAD `818cc6634bce89eaeffb4de13c98e9c9c05737fa`；Formal Gameplay Commit `f18f7aab2768e6fa5fcb1620243bf61c3a1779cf`；Run `44472015253` SUCCESS。
- **Closure**：M4-2 後續通過 Final Verification、Formal Acceptance、TD-016／017／020 Closure；正式 Git／CI Baseline 由本次 Closure 提交後補充。

## 2026-11-19 — M4-1 & Patch 1 Milestone Closure — Conditional

- **Closure**：M4-1 標記為 **COMPLETED — Conditional Closure**；M4-1 Patch 1 標記為 **COMPLETED**。
- **Acceptance**：M4-1 原始 BV 24/24 PASS；Patch 1 BV 10/10 PASS；兩項 User Acceptance 均 PASS。M4-1 原始 Agent Verification 的 PARTIAL／NOT VERIFIED 歷史保留，使用者後續驗收作為追加證據。
- **Verification**：最終 Automated Baseline 154/154、ESLint、TypeScript／Production Build 及 Git Diff Check PASS。Reference Scenarios 5/5 PASS。本 Closure 文件任務未重跑上述命令。
- **Git / CI**：Gameplay Commit `db30869e528f2aed95787d4cfdd1db3aca988c09`；GitHub Actions Run `44385223281` SUCCESS。
- **Code Review**：使用者核准延後 CR-01 至 CR-05，登錄為 OPEN 的 TD-016 至 TD-020；條件式結案不表示所有風險已修復。
- **Handover**：M4-2 `Individual Action Economy & Turn State Reset` 為 UP NEXT；TD-017 是 Entry Requirement。
- **Progress**：M4 完成度 25%；完整結案主要里程碑 3/10；等權重進度 32.5%，不代表工時比例。
- **Documentation Git / CI**：本 Closure 文件異動未 Commit、未 Push，無新 Closure Commit 或 CI；不得預填。

## 2026-11-19 — M4-1 Patch 1 — IMPLEMENTED — Acceptance Pending

- **Fixed**：移除玩家「確認移動」按鈕與獨立 Commit 入口；移動完成後 COMMAND 選單只提供攻擊、取消、待命。
- **Changed**：加入 `movementUsedTurnId`，由 Reducer 及共用 `canEnterMoveMode` 同步限制同一 Turn 再次移動。
- **Preserved**：合法 Undo 恢復移動權；取消 ATTACK Mode 保留 Move Record；攻擊確認與待命隱式確認移動；下一個 Individual Turn 重置限制。
- **Fixed**：合法攻擊確認後即使發生 Pre-impact Abort，已使用移動仍不可於同一 Turn 再次執行。
- **Verification**：`npm test` 154/154 PASS；`npm run lint` PASS；`npm run build` PASS；Git Diff Check PASS。既有 500 kB Chunk warning 保留。
- **Browser Verification**：PARTIAL；實際確認初始／移動後選單、Undo 後重新移動、Attack Cancel、Standby 及同角色下一 Turn。合法 Move & Attack、Selection Bypass 與 Abort Browser Fixture 尚未完整實測。
- **Acceptance / Git**：Patch 1 尚待使用者驗收；原 M4-1 原始 BV 24/24 已由使用者確認。M4-1 與 Patch 1 均仍在工作樹，無新 Commit 或 CI。

## 2026-11-19 — M4-1 — IMPLEMENTED — Acceptance Pending

- **Added**：PAS Remaining Distance Model、AGI Velocity、DES 排程、確定性排序、Battle Time、Round、Turn ID 與 Individual Turn Lifecycle。
- **Added**：Active Unit Authorization、Pending Turn Completion、唯讀未來 10 次 Preview、Turn HUD、Timeline、Active Highlight 與 Development-only Enemy Standby。
- **Changed**：六種職業 AGI 調整為劍士 10、刺客 15、法師 10、牧師 12、遊俠 12、哥布林 10；其他屬性維持不變。
- **Changed**：Attack Complete／Post-impact Abort 在所有阻擋 Motion 結束後完成 Turn；致命 Impact 立即移除排程資格，但死亡動畫期間保留佔位。
- **Verification**：原 M4-1 實作基準為 `npm test` 150/150 PASS（含 10,000 次排程穩定性與 RS-01／RS-02）；`npm run lint` PASS；`npm run build` PASS。Build 保留既有 Chunk Size warning。
- **Browser Verification / Acceptance**：原 M4-1 BV 24/24 已由使用者確認，PAS 核心功能已通過使用者驗收。
- **Status / Git**：**IMPLEMENTED**；目前只存在工作樹，無新 Commit、Remote CI 或 GitHub Actions 證據。
- **Known Limitation**：尚未實作 M4-2 Action Economy、正式敵方 AI、勝敗或 M7 效果；Production Build 的敵方回合等待 M4-3。

## 2026-11-18 — DOC-01 Patch 1 — Persistent Instructions & Context Synchronization

- **Added**：新 Session 的唯讀初始化流程，依文件索引回復上下文、核對 Git 與測試基準，並區分初始化與實作授權。
- **Changed**：在 [Copilot Instructions](../.github/copilot-instructions.md) 補充戰鬥事件、渲染與資源生命週期，以及分層驗證與版本基準管理規範。
- **Baseline**：M3 結案文件已納入 `main` 的 `9c8e623` 並通過 Repository CI Run `44279206269`；遊戲基準仍為 `d201b06`。完整基準見 [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md)；既有 Roadmap 不變。
- **Verification**：Markdown 相對連結及文件一致性檢查 PASS；137/137 為既有測試基準，本次未重跑遊戲測試、Lint 或 Build。
- **Commit Reference / CI**：已提交為 `69fc9be39351ea2531163a95f9d1561827b42190`；GitHub Actions Run `44280854293` 已確認 SUCCESS。

## 2026-11-18 — M3 正式結案（Closure Documentation — Git Push Pending）

- **Status**：M3、M3-4、M3-4 Patch 1（Revision 2）均為 **COMPLETED**。以下兩筆 M3-4 實作紀錄保留當時的待驗收狀態。
- **Acceptance**：M3-4 的 BV-01 至 BV-20 全部 PASS，AC 52/52 PASS；Patch 1 Revision 2 的 BV 8/8 PASS，AC 12/12 PASS。Revision 1 未通過使用者視覺驗收，已由 Revision 2 取代。
- **Fixed**：TD-015 以 Confirmed Impact Event Queue 結案；M3-4-BUG-001 以 Single CanvasTexture／Single Sprite 結案。
- **Verification**：沿用 Revision 2 實作報告的 137/137 測試、ESLint、Production Build PASS；本次未重跑。本次結案文件 Markdown 相對連結檢查 PASS。
- **遊戲功能 Commit / CI**：`d201b06e838a6b33dbfbf1fc329c4f7ac97a91d9`（`main`）；[GitHub Actions Run 44277295361](https://github.com/uNaXiG/sword-of-sealing/actions/runs/44277295361) — SUCCESS。本次文件異動尚未提交，不在該 Run 內。

## 2026-11-18 — M3-4 Patch 1 Revision 2（IMPLEMENTED — Acceptance Pending）

- **Revision 1 結果**：使用者視覺驗收失敗；未受擊角色的 Fill 位於資訊面板錯誤位置，滿血寬度與背景血槽未對齊。Revision 1 不得標記為 Accepted。
- **Root Cause**：資訊面板背景由一張 CanvasTexture Sprite 繪製，但血槽與 Fill 是另外兩張 Sprite，以世界座標定位且使用不同尺寸；它們並未共用面板畫布座標，造成視覺對齊依賴獨立 Sprite 的 billboard 與尺寸轉換。
- **Changed**：改為每個 Unit Label 一張 Canvas、一張 CanvasTexture 與一張 Sprite；同一 Canvas 繪製背景、外框、名稱、血槽、HP Fill 及數值。HP 動畫只更新 Canvas 內容中的 Fill 寬度，左側及垂直座標固定；每次重繪重置 Context Transform，Texture 在元件生命週期內重用並於 Cleanup dispose。
- **Verification**：保留原 3 項 Unit Label 測試意圖並新增 2 項 Canvas 繪製 regression tests（共 5 項）；`npm test` 137/137 PASS；`npm run lint` PASS；`npm run build` PASS；`git diff --check`（`cr-at-eol`）PASS。Production Build 的既有 Chunk Size warning 保留。
- **Browser Verification**：尚未執行 BV-01 至 BV-08 實際視覺驗收；等待使用者驗收，不以自動化／啟動成功替代。
- **Commit Reference / CI**：無；本次未 Commit、Push 或執行新 CI。

## 2026-11-18 — M3-4（IMPLEMENTED — Acceptance Pending）

- **Added**：DeathMotion、DefeatedUnitRecord、死亡 Life State Selector、Death ID、Death Complete／Abort。
- **Added**：1,200 ms Death Profile、倒地、淡出、24 顆粒子及多 DeathMotion 支援。
- **Added**：Confirmed Impact Event Queue，修正 TD-015 的視覺回饋時序。
- **Changed**：致命 Impact 先建立死亡事件，動畫期間保留佔位，完成後原子移除並保存死亡紀錄。
- **Verification**：`npm test` 132/132 PASS；`npm run lint` PASS；`npm run build` PASS；Chunk Size warning 保留。
- **Status**：未經使用者 M3-4 瀏覽器驗收、未提交、未納入新 GitHub Actions。
- **Technical Debt**：新增 TD-014；TD-015 = IMPLEMENTED — Acceptance Pending。
- **Commit Reference**：無。

## 2026-11-18 — M3-3（COMPLETED）

- **Added**：AttackMotion、唯一 Attack ID、PENDING_IMPACT／IMPACTED、Impact／Complete／Abort 事件及操作鎖定。
- **Added**：六種 Attack Animation Profile、單一動畫時鐘、近戰突進、魔法／聖光／箭矢投射物。
- **Added**：Hit Flash、Hit Shake、Impact Effect、Floating Applied Damage 與平滑 HP Transition。
- **Changed**：HP 由確認攻擊時結算改為合法 Impact Event 結算。
- **Verification**：`npm test` 100/100 PASS；`npm run lint` PASS；`npm run build` PASS；AC 40/40 PASS；BV 01–15 全部 PASS。Chunk Size warning 保留。
- **Profiles**：劍士 150/300/550 ms、突進 0.45；刺客 100/200/400 ms、0.60；法師 450/500/450 ms、0；牧師 450/300/550 ms、0；遊俠 300/400/400 ms、0；哥布林 150/250/500 ms、0.40（依序為 Wind-up/Attack/Recovery 與棋格突進上限）。
- **Lifecycle Verification**：應用由 React StrictMode 啟動；使用者於 BV-15 攻擊期間返回主選單觸發 Canvas Unmount，再重入戰場，確認無永久鎖定、投射物殘留、舊事件影響或 Console Error。
- **Goblin Verification**：未開放玩家操作敵方。自動化測試以集中 Registry Fixture 驗證 `MELEE_BASH` Mapping、時間參數與 0.40 突進值；使用者 BV-07 另於不改正式玩家流程的外部驗收 Fixture 驗證演出，該暫時 Fixture 未納入產品入口。
- **Known Limitation**：沒有長時間大量 Attack ID 的獨立資源壓力測試，emitted Impact／Complete ID 集合仍留待後續生命週期追蹤。
- **Status**：已使用者驗收並完成 Git／CI 同步。
- **CI/CD**：GitHub Actions Run `44226768648` SUCCESS。
- **Commit Reference**：`5fba4ed88cf8efad946dfd6de9e6d9730f77bd3d`

## 2026-11-18 — DOC-01（Completed & Accepted）

- **Milestone**：獨立專案文件管理任務，不影響 M1–M10。
- **Added**：Copilot Instructions、Development Status、Roadmap、Architecture、Game Design、Combat System、Art Guidelines、UX Backlog、Technical Debt 與本 Changelog。
- **Changed**：README 新增 Project Documentation 索引；修正過時攻擊範圍敘述。
- **Verification**：`npm test` 79/79 PASS；`npm run lint` PASS；`npm run build` PASS；使用者驗收及 ChatGPT GitHub 文件審查 PASS；相對連結及 Markdown-only Diff 檢查 PASS。Build 保留既知 Chunk Size warning。
- **CI/CD**：GitHub Actions Run `44220401050` SUCCESS。
- **Commit Reference**：`1626daf07fd81a47c365614c1d65d7c335d1d3da`

## 2026-11-18 — M3-2 Patch

- **Added**：職業型別、`CLASS_DEFINITIONS`、`createBattleUnit()`、職業與攻擊屬性驗證。
- **Added**：SQUARE、CROSS、DIAMOND、DIAMOND_RING。
- **Changed**：初始戰場統一由 Factory 建立，六種職業具有獨立 HP／SP／座標狀態。
- **Verification**：79/79 tests；ESLint、Production Build、GitHub Actions SUCCESS；使用者驗收完成。
- **Commit Reference**：`e307df4bb81025571dd910330d7ffc533898c536`

## 2026-11-17 — M3-2

- **Added**：普通攻擊傷害、Applied Damage、AttackResult、目標 HP 更新與 Overkill。
- **Added**：UnitLabel HP 血條與數值；HP 歸零不可操作。
- **Verification**：已確認為 M3-2 已驗收基準的一部分；測試總數演進至 66。
- **Commit Reference**：`627b748e6c0f55e0920ff3550d1e4f92c788fd9f`

## 2026-11-17 — M3-1 Patch 2

- **Added**：Standby Action，確認移動、清除暫時攻擊與選取。
- **Fixed**：待命後仍可 Undo、移動確認語意與操作限制。
- **Verification**：測試總數 55。
- **Commit Reference**：`2b1dc304696abc4558f260d05d722ca49db61b5c`

## 2026-11-17 — M3-1 / Patch 1

- **Added**：ATTACK Mode、合法目標選取、攻擊確認資料。
- **Added**：COMMAND 行動選單與移動／攻擊操作流程。
- **Changed**：UI 攻擊與核心目標驗證整合。
- **Verification**：測試總數 48；Patch 1 後達 50。
- **Commit Reference**：`0e8c80e4eaab0f3a48c20c70f1e21b3d4ca81a94`

## 2026-11-17 — M2-5

- **Added**：單次移動 Undo、`BattleMoveRecord`、撤銷合法性驗證。
- **Fixed**：確認與取消移動狀態、過期事件。
- **Verification**：測試總數 36。
- **Commit Reference**：`f247114082f0e671776dbaf9a6677685dce75cfa`

## 2026-11-17 — M2-4 / M2-4 Patch

- **Added**：Dijkstra 最低成本、地形移動成本、路徑預覽與移動動畫。
- **Changed**：處理拖曳與點擊的事件識別，避免誤觸棋格操作。
- **Verification**：測試總數 29；Patch 後達 30。
- **Commit Reference**：`d4dd27eca3eff07a682bc26f92f5a22b008c93b3`

## 2026-11-16–17 — M2 Core

- **Added**：多角色配置、棋格佔位、障礙物與基礎單位移動。
- **Changed**：Battle 邏輯重整並加入可測試的移動模組。
- **Commit References**：
  - `d577ffeedb64b2d5cb33be19c1c11903b99409ab`
  - `976bf1b4fcb5b8c02fd663f68238507483befe18`
  - `804f5d486698df9cf1aec3da00e391c293709ddb`
  - `31ffac616adeb2329939bc235bb3c32827063426`

## 2026-11-16 — M1 / Project Bootstrap

- **Added**：React、TypeScript、Vite、React Three Fiber 原型與主選單。
- **Added**：8×8 3D 戰場、Orthographic Camera、基礎角色與鏡頭操作。
- **Added**：README 與 GitHub Pages Workflow。
- **Commit References**：
  - `29941a18bb35a3c11f9ac210c3f5cd714e140c14`
  - `495114389a2621f9b08e2fcea4b95997e19f6a33`
