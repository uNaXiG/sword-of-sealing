# UI / UX Backlog

UX-001～UX-005 已實作於 M5-3，狀態為 **IMPLEMENTED — PENDING REVIEW**；Independent Code Review 與 Product Owner Acceptance 尚未完成。UX-006 已在 M5-2B 實作並正式結案。M5-1／M5-2A 的歷史紀錄維持不變；M5-3 的攻擊確認／取消入口位於角色 HUD 外，支援觸控與鍵盤。

## UX-001：移動撤銷後自動進入 MOVE

- **ID**：UX-001
- **Background**：重選移動目的地時，目前撤銷後還需重新點擊「移動」。
- **Current Behavior**：移動完成 → 取消移動 → 回到原位／COMMAND → 手動選擇移動。
- **Expected Behavior**：移動完成 → 取消移動 → 回到原位 → 自動進入 MOVE Mode → 顯示可移動範圍。
- **Target Milestone**：M5-3
- **Dependencies**：有效 Undo；沿用 Reducer 移動合法性。
- **Status**：IMPLEMENTED — PENDING REVIEW

## UX-002：滑鼠右鍵撤銷移動

- **ID**：UX-002
- **Background**：需要更快速撤銷尚未確認的單次移動。
- **Current Behavior**：只能點擊現有 UI「取消」按鈕。
- **Expected Behavior**：有效 Undo 期間，滑鼠右鍵單擊可共用相同撤銷邏輯；之後依 UX-001 自動進入 MOVE。
- **Target Milestone**：M5-3
- **Dependencies**：UX-001、UX-005、仍須保留 UI 按鈕。
- **Status**：IMPLEMENTED — PENDING REVIEW

## UX-003：重複點擊目標確認攻擊

- **ID**：UX-003
- **Background**：傷害預覽需與攻擊確認分開，避免首次點選合法目標就立即攻擊。
- **Current Behavior**：選角 → ATTACK → 選合法目標 → 確認攻擊。
- **Expected Behavior**：選角 → ATTACK → 首次點選合法目標，在目標 HUD 血條顯示預計剩餘 HP 與預計扣除區段；再次點擊同一目標確認攻擊。HUD 外保留「確認攻擊」與「取消攻擊」入口，供觸控與鍵盤操作。
- **Target Milestone**：M5-3
- **Dependencies**：M3-3 動畫事件與鎖定、核心攻擊驗證、未來回合限制；傷害預覽重用正式傷害計算。
- **Status**：IMPLEMENTED — PENDING REVIEW

## UX-004：滑鼠右鍵取消 ATTACK

- **ID**：UX-004
- **Background**：提供不離開戰場的快捷取消。
- **Current Behavior**：透過「取消攻擊」按鈕返回 COMMAND。
- **Expected Behavior**：進入 ATTACK Mode 後，確認攻擊前無論是否已選取合法目標，都可透過右鍵單擊或 HUD 外的取消入口返回 COMMAND，並保留尚未確認移動紀錄。此需求不包含攻擊已發動後的動畫中途取消。
- **Target Milestone**：M5-3
- **Dependencies**：UX-005、現有 `cancel-attack` 狀態轉換。
- **Status**：IMPLEMENTED — PENDING REVIEW

## UX-005：右鍵單擊與拖曳識別

- **ID**：UX-005
- **Background**：右鍵快捷命令會與既有鏡頭旋轉衝突。
- **Current Behavior**：左鍵單擊操作、左鍵拖曳平移、右鍵拖曳旋轉、滾輪縮放。
- **Expected Behavior**：右鍵單擊觸發目前操作的取消／撤銷；右鍵移動超過 5px 視為拖曳，仍只旋轉鏡頭，不得誤觸單擊。
- **Target Milestone**：M5-3
- **Dependencies**：統一指標事件與拖曳閾值；支援 UX-002／UX-004。
- **Status**：IMPLEMENTED — PENDING REVIEW

## UX-006：Active Unit Camera Framing

- **ID**：UX-006
- **Scope**：開場鎖定 Active Unit，焦點預設垂直位置為畫面高度約 52%，必要時避開 HUD／Timeline。鎖定時跟隨角色的實際世界位置，旋轉／縮放不解除鎖定。COMMAND 點擊棋盤外空白或無角色與障礙物的格子才解除鎖定，隱藏角色 CG、HUD 與輪盤，保留行動軸。場上角色／行動軸檢視及 PAS 換手會恢復聚焦；不改變正式選取與指令權限。支援 Reduced Motion。
- **Target Milestone**：M5-2B
- **MOVE Mode**：左鍵拖曳平移，暫停相機自動取景，但保留角色選取與 CG／HUD；單擊仍可選擇合法移動格。離開 MOVE 後恢復角色取景。
- **Dependencies**：M5-2B Presentation Focus 與世界 Group Registry。
- **Status**：COMPLETED — FORMALLY ACCEPTED WITH LIMITATIONS；既有死亡、終局 Restart 等瀏覽器限制保留，詳見 [DEVELOPMENT_STATUS.md](./DEVELOPMENT_STATUS.md)。
