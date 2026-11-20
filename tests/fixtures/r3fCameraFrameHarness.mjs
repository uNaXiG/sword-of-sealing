import { useEffect, useRef } from 'react'

const callbacks = new Set()

export function useFrame(callback) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    const registered = (state, delta) => callbackRef.current(state, delta)
    callbacks.add(registered)
    return () => callbacks.delete(registered)
  }, [])
}

export function advanceFrame(state, delta) {
  for (const callback of [...callbacks]) callback(state, delta)
}

export function getFrameStats() {
  return { activeCallbacks: callbacks.size }
}
