import { useState } from 'react'

export default function BattleUnitPortrait({
  src,
  label,
}: {
  src: string | null
  label: string
}) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <span className="battle-unit-portrait-fallback" aria-hidden="true">
        {label.slice(0, 1)}
      </span>
    )
  }

  return (
    <img
      className="battle-unit-portrait-image"
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      onError={() => setFailed(true)}
    />
  )
}
