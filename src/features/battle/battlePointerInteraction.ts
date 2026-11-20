const RIGHT_CLICK_DRAG_THRESHOLD = 5

type PointerGesture = {
  pointerId: number
  startX: number
  startY: number
  moved: boolean
}

export function attachBattleContextShortcut(
  canvas: HTMLElement,
  onRightClick: () => void,
): () => void {
  let gesture: PointerGesture | null = null

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 2) return
    gesture = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    }
  }
  const onPointerMove = (event: PointerEvent) => {
    if (!gesture || event.pointerId !== gesture.pointerId) return
    if (Math.hypot(event.clientX - gesture.startX, event.clientY - gesture.startY) > RIGHT_CLICK_DRAG_THRESHOLD) {
      gesture.moved = true
    }
  }
  const onPointerUp = (event: PointerEvent) => {
    if (!gesture || event.pointerId !== gesture.pointerId || event.button !== 2) return
    if (!gesture.moved) onRightClick()
    gesture = null
  }
  const onPointerCancel = (event: PointerEvent) => {
    if (gesture?.pointerId === event.pointerId) gesture = null
  }
  const onContextMenu = (event: MouseEvent) => event.preventDefault()

  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerup', onPointerUp)
  canvas.addEventListener('pointercancel', onPointerCancel)
  canvas.addEventListener('contextmenu', onContextMenu)

  return () => {
    canvas.removeEventListener('pointerdown', onPointerDown)
    canvas.removeEventListener('pointermove', onPointerMove)
    canvas.removeEventListener('pointerup', onPointerUp)
    canvas.removeEventListener('pointercancel', onPointerCancel)
    canvas.removeEventListener('contextmenu', onContextMenu)
    gesture = null
  }
}
