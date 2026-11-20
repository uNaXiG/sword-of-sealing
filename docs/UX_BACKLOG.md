# UI / UX Backlog

以下需求目前均為 **PENDING**，Target Milestone 為 M5-3；M5-1 只實作既有操作的 HUD 呈現與 callback 接線，不提前實作這些快捷操作。所有新快捷操作都須保留 UI 按鈕以支援手機與觸控。

## UX-001：移動撤銷後自動進入 MOVE

- **ID**：UX-001
- **Background**：重選移動目的地時，目前撤銷後還需重新點擊「移動」。
- **Current Behavior**：移動完成 → 取消移動 → 回到原位／COMMAND → 手動選擇移動。
- **Expected Behavior**：移動完成 → 取消移動 → 回到原位 → 自動進入 MOVE Mode → 顯示可移動範圍。
- **Target Milestone**：M5-3
- **Dependencies**：有效 Undo；沿用 Reducer 移動合法性。
- **Status**：PENDING

## UX-002：滑鼠右鍵撤銷移動

- **ID**：UX-002
- **Background**：需要更快速撤銷尚未確認的單次移動。
- **Current Behavior**：只能點擊現有 UI「取消」按鈕。
- **Expected Behavior**：有效 Undo 期間，滑鼠右鍵單擊可共用相同撤銷邏輯；之後依 UX-001 自動進入 MOVE。
- **Target Milestone**：M5-3
- **Dependencies**：UX-001、UX-005、仍須保留 UI 按鈕。
- **Status**：PENDING

## UX-003：選取合法目標後直接攻擊

- **ID**：UX-003
- **Background**：目前合法目標選取後仍需額外確認。
- **Current Behavior**：選角 → ATTACK → 選合法目標 → 確認攻擊。
- **Expected Behavior**：選角 → ATTACK → 選合法目標 → 直接執行攻擊。
- **Target Milestone**：M5-3
- **Dependencies**：M3-3 動畫事件與鎖定、核心攻擊驗證、未來回合限制。
- **Status**：PENDING

## UX-004：滑鼠右鍵取消 ATTACK

- **ID**：UX-004
- **Background**：提供不離開戰場的快捷取消。
- **Current Behavior**：透過「取消攻擊」按鈕返回 COMMAND。
- **Expected Behavior**：進入 ATTACK Mode 後，若尚未選取合法攻擊目標並發動攻擊，可透過右鍵單擊取消攻擊模式，返回 COMMAND 並保留尚未確認移動紀錄。此需求不包含攻擊已發動後的動畫中途取消。
- **Target Milestone**：M5-3
- **Dependencies**：UX-005、現有 `cancel-attack` 狀態轉換。
- **Status**：PENDING

## UX-005：右鍵單擊與拖曳識別

- **ID**：UX-005
- **Background**：右鍵快捷命令會與既有鏡頭旋轉衝突。
- **Current Behavior**：左鍵單擊操作、左鍵拖曳平移、右鍵拖曳旋轉、滾輪縮放。
- **Expected Behavior**：右鍵單擊觸發目前操作的取消／撤銷；右鍵拖曳仍只旋轉鏡頭，不得誤觸單擊。
- **Target Milestone**：M5-3
- **Dependencies**：統一指標事件與拖曳閾值；支援 UX-002／UX-004。
- **Status**：PENDING
