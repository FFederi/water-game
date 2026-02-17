import { useControls, folder } from 'leva'

export const isDebugMode = window.location.pathname.includes('/debug')

const DEFAULTS = {
  wireframe: false,
  showPumpSphere: false,
  physicsDebug: false,
  count: 20,
  linearDamping: 5,
  angularDamping: 10,
  gravityScale: 0.5,
  velocity: 4,
  duration: 800,
} as const

export default function useDebugControls() {
  const controls = useControls({
    Rendering: folder({
      wireframe: false,
      showPumpSphere: false,
      physicsDebug: false,
    }),
    Rings: folder({
      count: { value: 20, min: 1, max: 50, step: 1 },
      linearDamping: { value: 5, min: 0, max: 20 },
      angularDamping: { value: 10, min: 0, max: 20 },
      gravityScale: { value: 0.5, min: 0, max: 2 },
    }),
    Pump: folder({
      velocity: { value: 4, min: 0, max: 20 },
      duration: { value: 800, min: 100, max: 2000, step: 50 },
    }),
  })

  if (!isDebugMode) return DEFAULTS

  return controls
}
