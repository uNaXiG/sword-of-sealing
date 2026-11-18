# Combat System

本文件以目前原始碼與測試為準，記錄已實作行為。尚未實作項目明確標示。

## 棋盤與座標

- 固定 `GRID_SIZE = 8`。
- 邏輯座標為 `Cell { column, row }`，從 0 開始。
- 角色與障礙須在棋盤邊界內。
- 同一格不可容納多名角色或重疊障礙。
- 3D 世界座標由 `cellPosition()` 從邏輯座標轉換。

## 地形與移動

| 地形 | 成本 |
| --- | ---: |
| 平地 | 1 |
| 草地 | 1 |
| 森林 | 2 |
| 淺水 | 2 |
| 岩石 | 不可通行 |
| 石牆 | 不可通行 |

- 使用四方向 Dijkstra；不允許斜向移動。
- 起始格不計成本，總成本不可超過該角色 `movementPoints`。
- MOV 是單次移動預算，不是永久扣除的數值；它不是 SP。
- 同陣營可穿越，但不可停在其他角色格。
- 敵方、障礙及其他不可進入格會阻擋路徑。
- 等成本路徑依既定四方向搜尋順序選擇。
- MOVE Mode 顯示可移動格與最低成本路徑預覽。

## 佔位

`occupancy.ts` 驗證 ID 與位置唯一性。敵我單位、HP 歸零單位及障礙均依其既定規則佔格。HP 歸零單位目前不釋放佔位。

## 移動動畫生命週期

- Reducer 建立唯一 `motionId`。
- 動畫期間鎖定所有戰鬥指令。
- Renderer 沿規劃 `path` 顯示移動。
- 正式 Unit 座標只在 `finish` 且 ID 吻合時更新。
- 過期或重複 `finish` / `cancel` 不改變狀態。
- 取消時保留原座標與佔位，不建立 `lastMove`。
- React StrictMode Cleanup 使用 generation guarding，仍列為動畫生命週期技術債。

## 撤銷與確認

成功完成移動後建立單次 `BattleMoveRecord`，包含 `from`、`to`、`path`、`cost`、`unitId`、`motionId`。

可撤銷條件包含：角色仍選中且存活、無動畫、仍位於目的格、原始格合法未佔用、紀錄未確認。撤銷會還原座標與佔位、清除紀錄且不倒播動畫或消耗 MOV。

確認移動的事件：確認攻擊、待命、切換其他我方角色。未確認移動時不能直接再次 MOVE。

## 操作模式

| Mode | 主要行為 |
| --- | --- |
| COMMAND | 選擇 MOVE、ATTACK、待命；有有效 Undo 時可取消 |
| MOVE | 顯示可達格、路徑預覽、選目的格；可取消模式 |
| ATTACK | 顯示攻擊範圍、合法目標、選目標與確認攻擊；可取消 |

目前攻擊保留獨立確認步驟。

## 待命

Standby 只允許已選取、存活的玩家單位在 COMMAND 且無動畫時執行。它會確認既有移動、清除 Undo 與暫時攻擊資料、清除選取並回到 COMMAND。尚未導入回合制，因此待命後仍可重新選取。

## 職業資料結構

`ClassDefinition` 包含名稱、HP、SP、ATK、DEF、AGI、MOV、攻擊模式及距離。`CLASS_DEFINITIONS` 集中六種職業，`createBattleUnit()` 建立獨立單位。

| 職業 | HP | SP | ATK | DEF | AGI | MOV | Mode | Range |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 劍士 `knight` | 100 | 30 | 20 | 10 | 5 | 4 | SQUARE | 1 |
| 刺客 `assassin` | 75 | 35 | 28 | 5 | 10 | 6 | SQUARE | 1 |
| 法師 `mage` | 65 | 60 | 12 | 6 | 4 | 3 | CROSS | 1–2 |
| 牧師 `cleric` | 80 | 70 | 24 | 6 | 4 | 3 | CROSS | 1–2 |
| 遊俠 `ranger` | 80 | 40 | 18 | 5 | 8 | 5 | DIAMOND_RING | 3 |
| 哥布林 `goblin` | 60 | 15 | 15 | 5 | 4 | 3 | DIAMOND | 1 |

SP（Skill Points）與 MOV（Movement Points）是不同概念。

## 攻擊模式

令 `dx = abs(from.column - to.column)`、`dy = abs(from.row - to.row)`。

### SQUARE

- 距離：`max(dx, dy)`。
- 劍士、刺客使用。
- 距離 1 包含周圍 8 格。

```text
X X X
X O X
X X X
```

### CROSS

- 距離：`dx + dy`，且 `dx === 0 || dy === 0`。
- 法師、牧師使用。
- 距離 1–2 共 8 格。

```text
  X
  X
X O X X
  X
  X
```

### DIAMOND

- 距離：`dx + dy`。
- 最小距離固定 1。
- 哥布林目前使用最大距離 1，共 4 格。

```text
  X
X O X
  X
```

### DIAMOND_RING

- 使用 Manhattan 距離區間。
- `minAttackRange > 1`。
- 遊俠限定距離 3，共 12 格。

```text
      X
    X   X
  X       X
X     O     X
  X       X
    X   X
      X
```

所有攻擊模式會裁切棋盤邊界、排除攻擊者所在格，且目前不受障礙或 Line of Sight 阻擋。

## 合法目標與傷害

攻擊者與目標必須存活、ID 不同、陣營不同，且目標在模式與距離內。Reducer 最終確認會重新驗證，不依賴 UI Highlight。

```text
damage       = max(1, attacker.atk - target.def)
remainingHp  = max(0, target.hp - damage)
appliedDamage = target.hp - remainingHp
```

AttackResult 保存計算傷害、實際扣除、前後 HP 與 `isDefeated`。Overkill 時 HP 不低於 0，實際扣除不超過目標剩餘 HP。

目前 HP 在確認攻擊時立即扣除；M3-3 的動畫／命中時序尚未核准。

## SP、AGI 與 HP 歸零

- SP 目前只儲存、驗證與顯示；普通攻擊不消耗。
- AGI 目前只儲存、驗證與顯示，不影響行動順序。
- HP 歸零表示失去戰鬥能力：不可選取、移動、攻擊、成為目標、待命或撤銷。
- 失能角色保留資料、模型與佔位；死亡動畫、移除與釋放屬 M3-4。

## 初始測試戰場

| ID | 陣營 | 職業 | Column | Row |
| --- | --- | --- | ---: | ---: |
| knight | player | 劍士 | 3 | 3 |
| assassin | player | 刺客 | 1 | 5 |
| mage | player | 法師 | 2 | 4 |
| cleric | player | 牧師 | 3 | 6 |
| ranger | player | 遊俠 | 4 | 4 |
| goblin | enemy | 哥布林 A | 5 | 2 |
| goblin-b | enemy | 哥布林 B | 5 | 3 |
| goblin-c | enemy | 哥布林 C | 7 | 3 |

七個靜態障礙位於 `INITIAL_OBSTACLES`，角色皆由 Factory 建立。

## 已知限制

- 無回合、行動次數、敵方 AI、勝敗。
- 無技能、AOE、視線、魔法屬性、暴擊、閃避或隨機傷害。
- 無攻擊動畫與受擊演出。
- 無死亡移除。
- UI 目前要求選取目標後再確認攻擊。
