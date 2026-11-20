import { useEffect, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrthographicCamera, Vector3, type Object3D } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import {
  calculateCameraTargetForAnchor,
  calculateDampingAlpha,
  calculateSafeFocusAnchor,
  translateCameraAndTarget,
  type CameraScreenPoint,
} from '../battleCameraMath'
import { BATTLE_CAMERA_CONFIG } from '../battleCameraConfig'

const RESERVED_UI = '.battle-hud__portrait, .battle-hud__status, .turn-timeline'

export default function BattleCameraController({
  controlsRef,
  unitGroupsRef,
  safeAreaRootRef,
  focusUnitId,
}: {
  controlsRef: RefObject<OrbitControlsImpl | null>
  unitGroupsRef: RefObject<Map<string, Object3D>>
  safeAreaRootRef: RefObject<HTMLElement | null>
  focusUnitId: string | null
}) {
  const locked = focusUnitId !== null
  const anchor = useRef<CameraScreenPoint | null>(null)
  const updateSafeArea = useRef<(() => void) | null>(null)
  const viewport = useRef({ width: 0, height: 0 })
  const previousUnitId = useRef<string | null>(null)
  const initialized = useRef(false)
  const transitioning = useRef(false)
  const reducedMotion = useRef(false)
  const focus = useRef(new Vector3())
  const destination = useRef(new Vector3())
  const nextTarget = useRef(new Vector3())
  const translation = useRef(new Vector3())
  const right = useRef(new Vector3())
  const up = useRef(new Vector3())

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => { reducedMotion.current = preference.matches }
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const root = safeAreaRootRef.current
    const canvas = root?.querySelector('canvas')
    if (!locked || !root || !canvas) return
    const elements = [...root.querySelectorAll(RESERVED_UI)]
    const measure = () => {
      const bounds = canvas.getBoundingClientRect()
      anchor.current = calculateSafeFocusAnchor(bounds, elements
        .map((element) => element.getBoundingClientRect())
        .filter((rect) => rect.width > 0 && rect.height > 0)
        .map((rect) => ({
          left: rect.left - bounds.left,
          top: rect.top - bounds.top,
          right: rect.right - bounds.left,
          bottom: rect.bottom - bounds.top,
        })))
    }

    updateSafeArea.current = measure
    measure()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    for (const element of [root, canvas, ...elements]) observer?.observe(element)
    window.addEventListener('resize', measure)
    window.visualViewport?.addEventListener('resize', measure)
    return () => {
      anchor.current = null
      updateSafeArea.current = null
      observer?.disconnect()
      window.removeEventListener('resize', measure)
      window.visualViewport?.removeEventListener('resize', measure)
    }
  }, [locked, safeAreaRootRef])

  useFrame(({ camera, size }, delta) => {
    if (focusUnitId === null) {
      previousUnitId.current = null
      return
    }
    const controls = controlsRef.current
    const group = unitGroupsRef.current.get(focusUnitId)
    if (!controls || !group || !(camera instanceof OrthographicCamera) || size.width <= 0 || size.height <= 0) return

    if (viewport.current.width !== size.width || viewport.current.height !== size.height) {
      viewport.current.width = size.width
      viewport.current.height = size.height
      if (updateSafeArea.current) updateSafeArea.current()
      else anchor.current = calculateSafeFocusAnchor(size, [])
    }
    if (previousUnitId.current !== focusUnitId) {
      previousUnitId.current = focusUnitId
      transitioning.current = initialized.current
    }

    group.getWorldPosition(focus.current)
    focus.current.y += BATTLE_CAMERA_CONFIG.focusHeight
    // OrbitControls has already applied rotation and zoom; translate without changing either.
    calculateCameraTargetForAnchor(
      focus.current, camera, size, anchor.current ?? calculateSafeFocusAnchor(size, []),
      destination.current, right.current, up.current,
    )
    if (transitioning.current && !reducedMotion.current) {
      const alpha = calculateDampingAlpha(delta, BATTLE_CAMERA_CONFIG.transitionDamping)
      nextTarget.current.copy(controls.target).lerp(destination.current, alpha)
      if (nextTarget.current.distanceToSquared(destination.current) >= 0.0001) {
        translateCameraAndTarget(camera, controls.target, nextTarget.current, translation.current)
        return
      }
    }

    translateCameraAndTarget(camera, controls.target, destination.current, translation.current)
    initialized.current = true
    transitioning.current = false
  })

  return null
}
