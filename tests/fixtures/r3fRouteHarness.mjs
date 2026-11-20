import { Children, createElement, useEffect } from 'react'
import { useFrame as useFrameHarness } from './r3fFrameHarness.mjs'

let activeCanvases = 0
let canvasMounts = 0
let canvasCleanups = 0

export function Canvas({ children, onPointerMissed }) {
  useEffect(() => {
    activeCanvases += 1
    canvasMounts += 1
    return () => {
      activeCanvases -= 1
      canvasCleanups += 1
    }
  }, [])

  const sceneComponents = Children.toArray(children)
    .filter((child) => typeof child.type !== 'string')
  return createElement('div', {
    'data-testid': 'route-canvas',
    onClick: (event) => {
      if (event.target === event.currentTarget) onPointerMissed?.(event)
    },
  }, sceneComponents)
}

export function useThree(selector) {
  const state = { size: { width: 1024, height: 768 } }
  return selector ? selector(state) : state
}

export const useFrame = useFrameHarness

export function getCanvasHarnessStats() {
  return { activeCanvases, canvasMounts, canvasCleanups }
}
