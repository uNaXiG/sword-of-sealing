# Game Design

本文件只記錄已確認設計與已規劃方向。標示為「規劃中／未定稿」的內容不得視為已核准實作。

## 確認：遊戲定位

- 名稱：Sword of Sealing（封印之劍）。
- 類型：單人 Tactical RPG / SRPG。
- 平台：Web／PWA。
- 核心：3D、Orthographic Camera、格子回合制戰棋。
- 美術：日系異世界輕小說與古典歐洲中世紀奇幻。

## 確認：已實作核心玩法

- 8 × 8 戰場。
- 多角色選取、地形成本、障礙與佔位。
- 移動路徑預覽、動畫、取消與撤銷。
- COMMAND / MOVE / ATTACK 與待命。
- 四種攻擊模式、單目標普通攻擊、HP／傷害。
- 六種基礎職業資料。
- 物理競速式個體行動排序（PAS）。

## M4-1：Physics-inspired Action System

- PAS 使用等速競速與 Discrete Event Simulation，不使用現實時間或加速度。
- Action Distance 為 1000 BU，角色速度等於 AGI。
- Remaining Distance 是 PAS 的主要資料來源；Action Value 為 `remainingDistance / velocity`。
- 戰鬥採個體回合；一名角色抵達終點時取得唯一行動權。
- Battle Time 以 BTU 累積；每 200 BTU 為一個 Round。
- 同時抵達依 AGI 較高、Initial Order 較小排序。
- 攻擊完成及待命會完成目前個體回合；移動完成後只提供攻擊、取消移動及待命。
- 最終設計為每回合一次移動加一次戰鬥行動；M4-1 僅具最小 Turn-scoped Movement Commitment，不代表完整 Action Economy 已完成。
- M4-1 已實作最小 Turn-scoped 移動限制：每個個體 Turn 最多移動一次；合法 Undo 可解除限制。完整 Action Economy 仍由 M4-2 處理。
- M4-2 已實作完整個體 Action Economy：每個 Turn 最多一次有效移動及一次成功結算的普通攻擊；允許先移動再攻擊，不允許先確認攻擊再移動。
- M4-2 與 Patch 1 已正式驗收；M4-3 Enemy AI、Patch 1／2／3 與 TEST-M4-3-01 已正式驗收，狀態為 COMPLETED — FORMALLY ACCEPTED。M4-4 勝敗仍為下一階段，尚未開始。
- 合法 Undo 只可在攻擊確認前復原移動並恢復 Movement Action。確認攻擊會清除 Undo、鎖定後續移動，系統 Impact 才消耗 Combat Action。
- Pre-impact Abort 是系統異常復原：不扣血、不完成 Turn，Combat Action 回到 AVAILABLE，但既有移動不恢復、Movement Initiation Lock 不解除。玩家沒有主動 Abort 入口。
- 合法 Impact、攻擊完成或待命後完成目前 Turn；單純移動、Undo、Cancel Mode 或 Pre-impact Abort 不推進 PAS。新 Turn 依 `turnId/unitId` 重新初始化全部行動權。
- 拉條、推條、加速及緩速留待 M7 規劃；PAS 不引入物理加速度。
- M4-3 Rule-based Tactical AI 已正式驗收：敵人可直接攻擊、移動後攻擊、以路徑成本接近或安全待命；Development-only Standby 已移除。M4 目前進度為 75%，下一階段 M4-4 勝敗系統仍為 PENDING DEVELOPMENT。
- Action Advance、Action Delay、Speed Up／Down 屬 M7 規劃，M4-1 不提供這些效果 API。

## 規劃中：未來系統

- M4-4 戰鬥結束與勝敗。
- 多角色完整行動限制。
- 技能、裝備、經驗值、等級與成長。
- 戰鬥勝負與關卡。
- 劇情、對話、人物 CG、分支與結局。
- 存檔、PWA、離線與正式發布。

## 確認：世界觀與主角

- 主角具有魔族與人族血統。
- 母親為魔族；父親為失落皇室後裔。
- 父母因結合遭皇室追緝。
- 主角幼年時一家逃亡，遭盜賊襲擊。
- 母親引開追兵；父親帶主角逃入森林。
- 父親在魔物戰鬥後重傷，將主角放入河流。
- 正式故事於十六年後展開；主角 16 歲。
- 玩家可選男性或女性主角並自訂姓名。
- 主角形象包含銀白色頭髮與紅色眼睛。
- 世界觀包含五百年輪迴概念。

## 確認：物品與技能名稱

- 初始武器：「信念」。
- 初始技能：「天風斬」。

名稱已確認；其數值、演出、取得方式與演化仍屬 M7 後續設計。

## 規劃中：劇情分支

1. 魔族路線：顛覆既有世界秩序。
2. 皇室路線：復興失落皇室。

實際事件、選項、旗標、羈絆與結局尚未定稿。

## 確認：職業設計方向

基礎職業目前為劍士、刺客、法師、牧師、遊俠與哥布林。職業與陣營彼此獨立，未來進階職業的特殊名稱與規則仍未確認。當前數值與攻擊模式見 [COMBAT_SYSTEM.md](./COMBAT_SYSTEM.md)。

## 尚未定稿

- 完整劇情、角色關係與五百年輪迴的運作方式。
- 武器、技能與職業成長公式。
- 裝備欄位、資源消耗與屬性系統。
- 戰役章節、關卡條件與最終結局細節。
- SP 的未來取得與消耗方式。
- 完整個體行動資源與重置規則。

不得依本文件自行推論或補完上述內容。
