export function calculateTimelineCapacity(
  containerWidth: number,
  itemSize: number,
  gap: number,
  maximum = 8,
): number {
  const safeMaximum = Number.isFinite(maximum) ? Math.min(8, Math.max(0, Math.floor(maximum))) : 8
  if (
    safeMaximum === 0 ||
    !Number.isFinite(containerWidth) ||
    !Number.isFinite(itemSize) ||
    !Number.isFinite(gap) ||
    itemSize <= 0 ||
    gap < 0
  ) return 0
  return Math.min(
    safeMaximum,
    Math.max(0, Math.floor((Math.max(0, containerWidth) + gap) / (itemSize + gap))),
  )
}

type ResizeObserverLike = Pick<ResizeObserver, 'observe' | 'disconnect'>

export function observeTimelineCapacity(
  element: HTMLElement,
  onCapacityChange: (capacity: number) => void,
  createObserver?: (callback: ResizeObserverCallback) => ResizeObserverLike,
): () => void {
  const update = () => {
    const view = element.ownerDocument.defaultView
    if (!view) return
    const styles = view.getComputedStyle(element)
    const itemSize = Number.parseFloat(styles.getPropertyValue('--turn-card-size')) || 72
    const gap = Number.parseFloat(styles.getPropertyValue('--turn-card-gap')) || 0
    onCapacityChange(calculateTimelineCapacity(element.clientWidth, itemSize, gap))
  }
  update()
  const view = element.ownerDocument.defaultView
  if (!createObserver && (typeof ResizeObserver === 'undefined' || !view)) {
    view?.addEventListener('resize', update)
    return () => view?.removeEventListener('resize', update)
  }
  const observer = createObserver ? createObserver(update) : new ResizeObserver(update)
  observer.observe(element)
  return () => observer.disconnect()
}
