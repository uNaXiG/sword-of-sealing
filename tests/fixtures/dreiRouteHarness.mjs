import { createElement } from 'react'

export function OrbitControls({ enablePan }) {
  return createElement('div', { 'data-testid': 'orbit-controls', 'data-enable-pan': enablePan })
}

export function OrthographicCamera() {
  return null
}
