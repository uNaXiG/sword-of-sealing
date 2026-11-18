# Technical Debt

狀態只反映已確認事實。Proposed 解法不代表已核准實作；未確認目標標為 TBD。

**技術債統計（TD-001 至 TD-015）**：共 15 項；CLOSED 8、OPEN 6、PARTIALLY RESOLVED 1。下列獨立 Bug 不計入。

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
| TD-010 | CanvasTexture 資源生命週期 | UnitLabel 及 Floating Damage Texture 不當清理可能造成資源洩漏 | Low | PARTIALLY RESOLVED | M3-3 已處理新增 Texture 的 Unmount 清理並通過 BV-15；M3-4 Patch 1 Revision 2 改為每個 UnitLabel 重用單一 CanvasTexture，於 Effect Cleanup dispose；Floating Damage 長時間資源壓力仍待觀察 | TBD |
| TD-011 | 職業平衡數值與測試耦合 | 調整 Registry 必須同步固定 `expectedStats` | Low | OPEN | Proposed：分離平衡值測試與資料結構合法性測試 | TBD |
| TD-012 | 攻擊屬性驗證模組耦合 | `validateAttackProperties()` 位於 `class.data.ts`，未來武器／技能也可能使用 | Low | OPEN | Proposed：規格確認後抽成中性攻擊驗證模組 | M7 Candidate |
| TD-013 | README 舊攻擊範圍敘述殘留 | 文件仍稱曼哈頓範圍，與四種模式不符 | Low | CLOSED | README 已改為依職業攻擊模式描述，並完成使用者驗收 | DOC-01 |
| TD-014 | Attack Animation Controller 的 emitted Attack ID 集合持續增長 | 長時間重複攻擊可能累積記憶體與 ID Set Entries | Low | OPEN | Proposed：在不破壞 StrictMode 防護下設計受限生命週期或清理窗口 | M10-3 Candidate |
| TD-015 | 命中視覺回饋可能早於 Reducer 確認 | 浮動傷害、受擊與死亡可能依預計結果誤顯示 | Medium | CLOSED | 改用 Confirmed Impact Event Queue；依據為無效／重複 Impact、Complete、Abort 等[回歸測試](../tests/battle.impact-feedback.test.mjs)及使用者 M3-4 瀏覽器驗收（BV-01 至 BV-20 全部 PASS） | M3-4 |

## 已結案 Bug

- **M3-4-BUG-001 — CLOSED**：Revision 1 的固定 Sprite Anchor 未通過使用者視覺驗收。Revision 2 改用 Single CanvasTexture／Single Sprite，血槽與填充共用畫布座標。結案依據：[Revision 2 自動化回歸測試](../tests/unitLabel.test.mjs)及使用者瀏覽器驗收 8/8 PASS。

## Code Review 待追蹤風險

- **TD-010 · Unit Label Draw Cache**：[UnitLabel](../src/features/battle/components/UnitLabel.tsx) 的 Effect 建立新 CanvasTexture 時未明確重置 `lastDrawn`；若特殊 Effect 重建情境保留上一張 Texture 的快取，且內容與比例未變，可能跳過首次繪製。尚無使用者回報，未確認為實際缺陷。
- **Confirmed Impact Queue**：正常流程已通過使用者驗收（TD-015 CLOSED）。異常卸載／重新掛載時的事件清理、重播以及長時間資源累積，留待後續生命週期壓力測試；未確認為實際缺陷。

## 已知非阻擋性警告

- Three.js 的 `Clock` deprecated 與 `PCFSoftShadowMap` compatibility 警告。
- Vite Battle Chunk 超過 500 kB。

M3-3 已依使用者 BV-15 關閉 TD-004。TD-010 的直接相關 Texture Cleanup 已實作及通過場景重入驗收，但缺少長時間資源壓力與記憶體測量，因此保持 PARTIALLY RESOLVED。其餘技術債維持既有狀態。

TD-014 維持 OPEN，本次結案不進行重構。
