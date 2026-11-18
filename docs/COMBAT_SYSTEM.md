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
- React StrictMode Cleanup 使用 generation guarding；M3-3 的 Canvas Unmount／重新進入流程已通過使用者驗收。

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

## Attack Motion 與生命週期

`AttackMotion` 與移動 `motion` 互斥，包含唯一 Attack ID、攻擊者／目標座標快照、Animation Type、Phase 及預計 `AttackResult`。

```text
Confirm → PENDING_IMPACT → Impact → IMPACTED → Complete
              └─ Abort：不扣 HP
                                      └─ Abort：保留已扣 HP
```

- Confirm 驗證攻擊、計算預計結果、清除已確認的 `lastMove`，但不更新 HP。
- Impact 只接受相符 Attack ID 與 `PENDING_IMPACT`；重複、過期或資料不一致事件不會二次扣血。
- Impact 更新 HP 與 `lastAttackResult`，並保留 AttackMotion 至 Recovery 完成。
- Complete 只接受 `IMPACTED`，保留攻擊者選取並返回 COMMAND。
- Abort 在命中前清除未完成指令且不扣血；命中後保留已正式結算的 HP。
- 攻擊期間 Reducer、Hook 與 UI 均鎖定一般戰鬥操作；鏡頭操作不受影響。
- 逐幀時間不寫入 Battle State；唯一時鐘由 Attack Animation Controller 管理。

## 攻擊動畫 Profile

Animation Type 與 AttackPattern 相互獨立：

| 職業 | Animation Type | Wind-up | Attack | Recovery | 突進上限 | 特效色 |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| 劍士 | MELEE_SLASH | 150 ms | 300 ms | 550 ms | 0.45 格 | 淡藍白 |
| 刺客 | MELEE_STAB | 100 ms | 200 ms | 400 ms | 0.60 格 | 淡紫 |
| 法師 | MAGIC_PROJECTILE | 450 ms | 500 ms | 450 ms | 0 | 紫藍 |
| 牧師 | HOLY_STRIKE | 450 ms | 300 ms | 550 ms | 0 | 金白 |
| 遊俠 | RANGED_ARROW | 300 ms | 400 ms | 400 ms | 0 | 淡綠白 |
| 哥布林 | MELEE_BASH | 150 ms | 250 ms | 500 ms | 0.40 格 | 橘紅 |

視覺突進僅修改 Visual Root，不呼叫移動規則，也不改變座標、Occupancy 或建立 `BattleMoveRecord`。

## M3-3 驗收與生命週期補充

- 哥布林使用 `MELEE_BASH`，Profile 測試 Fixture 驗證 Registry Mapping、150/250/500 ms 時間及 0.40 格突進上限；正式遊戲未開放玩家控制敵方。
- 使用者 BV-07 以不改玩家操作流程的外部 Fixture 驗證哥布林渲染、命中與完成；暫時驗收方式未成為永久產品入口。
- 應用根節點在 `src/main.tsx` 使用 React StrictMode。使用者 BV-15 在該模式下執行攻擊期間返回主選單、觸發 Canvas Unmount，再重新進入戰場，確認無永久鎖定、投射物殘留、舊事件影響或新增 Console Error。
- 已知限制：目前沒有獨立長時間資源壓力或記憶體量測；Attack Controller 的 emitted Impact／Complete ID 集合仍應在未來生命週期工作中持續觀察。

## M3-4 死亡生命週期

單位狀態以 HP、DeathMotion 與所在集合推導：

- `ALIVE`：HP > 0 且存在 Active Unit。
- `DYING`：HP = 0，具有 DeathMotion，仍保留模型與棋格佔位。
- `DEAD`：已從 Active Unit 移除並保留於 `DefeatedUnitRecord`。

既有測試若直接建立初始 HP 0 Fixture，會保留在 Active Unit 且不可行動／受攻，但不產生虛構 Attack ID、DeathMotion 或死亡紀錄。

合法致命 Impact 會在同一次 Reducer transition：

1. 更新 HP 至 0。
2. 建立 Confirmed Impact Event。
3. 建立唯一且遞增的 DeathMotion。
4. 清理該死亡單位相關選取及 Move Record。

DeathMotion 保存 `deathId`、`unitId`、`killerId`、`attackId`、位置快照及攻擊來源座標。`DefeatedUnitRecord` 保存完整 HP 0 Unit snapshot。

Death Complete／Death Abort 均使用安全最終結算：原子移除 Active Unit、加入單筆紀錄、清除 DeathMotion、釋放 Occupancy；死亡後不會復活。過期、重複、錯誤 Unit ID 為 no-op。

## 死亡動畫與 TD-015

Death Profile 固定 1,200 ms：

| Stage | Duration |
| --- | ---: |
| HIT_REACTION | 200 ms |
| COLLAPSE | 350 ms |
| DISSOLVE | 650 ms |

- Hit Reaction 沿用已確認命中回饋。
- Collapse 以來源位置計算方向，最多傾倒 90°，不修改棋格座標。
- Dissolve 讓單位材質透明度由 1 降至 0。
- 24 顆穩定粒子由原位置向上／向外飄散。
- Death Label、Selection Ring 與模型於完成前依階段隱藏／移除。
- Attack Recovery 與 Death Animation 同時進行；只有所有阻擋 Motion 清除後才解鎖。

TD-015 的新流程為：

```text
Animation Timeline → attack-impact → Reducer 驗證
→ 套用 HP → 建立 Confirmed Impact Event / DeathMotion
→ Renderer 消費已確認事件 → 清除事件
```

Renderer 不再於 Dispatch 前建立 Floating Damage 或依預計結果播放受擊。Confirmed Event 使用獨立 Queue 跨越 Attack Complete、React 批次及死亡單位移除，並以冪等 `consume-impact` 清理。

## Hit Feedback 與 HP 顯示

- 合法 Impact 時播放目標 Hit Flash、約 160 ms 震動及職業色 Impact Effect。
- Floating Damage 顯示 `-${appliedDamage}`；Overkill 時只顯示實際扣除值。
- 魔法球、箭矢與聖光由共用投射物時間軸驅動。
- HP 數字在 Impact 後立即顯示權威值；血條使用純視覺平滑過渡。
- 受擊演出不變更 BattleUnit 位置；HP 歸零仍保留模型與佔位。

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
. . X . .
. . X . .
X X O X X
. . X . .
. . X . .
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

目前 HP 只在合法 Attack Impact Event 正式扣除。

## SP、AGI 與 HP 歸零

- SP 目前只儲存、驗證與顯示；普通攻擊不消耗。
- AGI 目前只儲存、驗證與顯示，不影響行動順序。
- HP 歸零表示失去戰鬥能力：不可選取、移動、攻擊、成為目標、待命或撤銷。
- 一般致命 Impact 進入 M3-4 Death Lifecycle，動畫完成後從 Active Unit 移除；僅初始 HP 0 Fixture 仍保留資料、模型與佔位且不生成虛構死亡事件。

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
- 尚未導入攻擊音效、正式骨架動畫、死亡演出或 Physics。
- 無死亡移除。
- UI 目前要求選取目標後再確認攻擊。
