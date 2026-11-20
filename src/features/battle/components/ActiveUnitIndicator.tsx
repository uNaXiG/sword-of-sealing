import type { RefObject } from 'react'
import { Html } from '@react-three/drei'
import { getBattleAssetUrl } from '../battleHud'

const INDICATOR_URL = getBattleAssetUrl(import.meta.env.BASE_URL, 'assets/images/ui/down.png')

export default function ActiveUnitIndicator({ portal }: { portal: RefObject<HTMLElement> }) {
  return (
    <Html
      center
      pointerEvents="none"
      portal={portal}
      position={[0, 1.88, 0]}
      zIndexRange={[4, 4]}
    >
      <img className="active-unit-indicator" src={INDICATOR_URL} alt="" aria-hidden="true" draggable={false} />
    </Html>
  )
}
