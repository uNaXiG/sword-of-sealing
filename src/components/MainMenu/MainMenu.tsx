import { useEffect, useRef, useState } from 'react'
import './MainMenu.css'

type Panel = 'new' | 'continue' | 'load' | 'settings'

const menuItems: { id: Panel; label: string; caption: string }[] = [
  { id: 'new', label: '開始新遊戲', caption: '踏上嶄新的旅程' },
  { id: 'continue', label: '繼續遊戲', caption: '回到你的故事' },
  { id: 'load', label: '讀取遊戲', caption: '重拾冒險的回憶' },
  { id: 'settings', label: '設定', caption: '調整你的冒險體驗' },
]

const messages: Record<Exclude<Panel, 'settings'>, { title: string; text: string }> = {
  new: {
    title: '嶄新的旅程正等待著你',
    text: '正式冒險仍在準備中，你可以先探索 3D 戰場測試場景。',
  },
  continue: {
    title: '繼續你的旅程',
    text: '目前尚無可繼續的冒險。此預覽版本尚未提供存檔系統。',
  },
  load: {
    title: '讀取冒險回憶',
    text: '目前尚無冒險存檔。此預覽版本尚未提供存檔系統。',
  },
}

function MenuDialog({
  panel,
  onClose,
  effects,
  onEffectsChange,
}: {
  panel: Panel
  onClose: () => void
  effects: boolean
  onEffectsChange: (enabled: boolean) => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  const title = panel === 'settings' ? '設定' : messages[panel].title

  return (
    <dialog
      ref={dialogRef}
      className="menu-dialog"
      onClose={onClose}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          onClose()
        }
      }}
      aria-labelledby="dialog-title"
    >
      <div className="dialog-inner">
        <span className="dialog-ornament" aria-hidden="true">✦</span>
        <p className="eyebrow">封印之劍</p>
        <h2 id="dialog-title">{title}</h2>
        {panel === 'settings' ? (
          <>
            <p>調整主選單畫面的氛圍。</p>
            <label className="setting-row">
              <span>
                <strong>魔法特效</strong>
                <small>顯示天空中飄浮的光點</small>
              </span>
              <input
                type="checkbox"
                checked={effects}
                onChange={(event) => onEffectsChange(event.target.checked)}
              />
            </label>
          </>
        ) : (
          <p>{messages[panel].text}</p>
        )}
        {panel === 'new' && <a className="dialog-link" href="#battle">進入 3D 測試場景</a>}
        <button className="dialog-close" type="button" onClick={onClose}>返回主選單</button>
      </div>
    </dialog>
  )
}

function Scenery({ effects }: { effects: boolean }) {
  return (
    <div className="scenery" aria-hidden="true">
      {effects && <div className="magic-lights"><i /><i /><i /><i /><i /><i /></div>}
      <div className="scenery-wash" />
    </div>
  )
}

function MainMenu() {
  const [panel, setPanel] = useState<Panel | null>(null)
  const [effects, setEffects] = useState(true)

  return (
    <main className="title-screen">
      <Scenery effects={effects} />
      <div className="screen-frame" aria-hidden="true" />
      <header className="topline">
        <span className="topline-mark" aria-hidden="true">✧</span>
        <span>封印彼方的冒險</span>
        <span className="topline-mark" aria-hidden="true">✧</span>
      </header>

      <div className="screen-content">
        <section className="menu-area" aria-labelledby="game-title">
          <div className="title-block">
            <div className="title-emblem" aria-hidden="true">
              <svg viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="27" />
                <circle cx="32" cy="32" r="22" />
                <path d="M32 6v52M6 32h52M32 12l4 24-4 5-4-5 4-24ZM23 38l9 3 9-3M32 41v9m-3 3h6" />
              </svg>
            </div>
            <p className="title-overline">劍與魔法的傳說</p>
            <h1 id="game-title">封印之劍</h1>
            <div className="title-divider" aria-hidden="true"><span>✧</span></div>
            <p className="title-subtitle">一段等待譜寫的傳奇。</p>
          </div>

          <div className="menu-heading" aria-hidden="true"><span>冒險之書</span><i /></div>
          <nav className="menu" aria-label="主選單">
            {menuItems.map((item, index) => (
              <button key={item.id} className="menu-item" type="button" onClick={() => setPanel(item.id)}>
                <span className="menu-number">0{index + 1}</span>
                <span className="menu-copy"><strong>{item.label}</strong><small>{item.caption}</small></span>
                <span className="menu-arrow" aria-hidden="true">◇</span>
              </button>
            ))}
          </nav>
          <p className="menu-footnote"><span aria-hidden="true">✦</span> 你的故事由此展開 <span aria-hidden="true">✦</span></p>
        </section>

        <aside className="world-caption" aria-label="世界介紹">
          <span className="caption-line" />
          <p>王國</p>
          <strong>艾凡諾爾</strong>
          <span>超越平凡的奇幻世界</span>
        </aside>
      </div>
      <footer className="screen-footer"><span>✧ &nbsp; 奇幻角色扮演遊戲</span><span>傳奇的起點 &nbsp; ✧</span></footer>
      {panel && <MenuDialog panel={panel} onClose={() => setPanel(null)} effects={effects} onEffectsChange={setEffects} />}
    </main>
  )
}

export default MainMenu
