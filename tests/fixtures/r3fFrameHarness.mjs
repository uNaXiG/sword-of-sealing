import { useLayoutEffect, useRef } from 'react'

const callbacks = new Set()
let registrations = 0
let cleanups = 0
let preEffectFrames = 0
let frameOnSubscribe = false

export function useFrame(callback) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useLayoutEffect(() => {
    const registeredCallback = (_state, delta) => callbackRef.current(_state, delta)
    callbacks.add(registeredCallback)
    registrations += 1
    if (frameOnSubscribe) {
      preEffectFrames += 1
      registeredCallback({}, 0)
    }
    return () => {
      callbacks.delete(registeredCallback)
      cleanups += 1
    }
  }, [])
}

export function advanceFrame(delta) {
  for (const callback of [...callbacks]) callback({}, delta)
}

export function getFrameHarnessStats() {
  return {
    activeCallbacks: callbacks.size,
    registrations,
    cleanups,
    preEffectFrames,
  }
}

export function setFrameOnSubscribe(enabled) {
  frameOnSubscribe = enabled
}
