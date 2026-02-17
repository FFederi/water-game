import { useControls, folder } from 'leva'

export const isDebugMode = window.location.pathname.includes('/debug')

const DEFAULTS = {
  wireframe: false,
  showPumpZone: false,
  physicsDebug: false,
  count: 30,
  size: 0.10,
  linearDamping: 5,
  angularDamping: 10,
  gravityScale: 0.5,
  force: 1.2,
  duration: 150,
  pumpZoneWidth: 0.7,
  pumpZoneHeight: 4,
} as const

export default function useDebugControls() {
  const controls = useControls({
    Rendering: folder({
      wireframe: false,
      showPumpZone: false,
      physicsDebug: false,
    }),
    Rings: folder({
      count: { value: 30, min: 1, max: 50, step: 1 },
      size: { value: 0.10, min: 0.05, max: 1, step: 0.05 },
      linearDamping: { value: 5, min: 0, max: 20 },
      angularDamping: { value: 10, min: 0, max: 20 },
      gravityScale: { value: 0.5, min: 0, max: 2 },
    }),
    Pump: folder({
      force: { value: 1.2, min: 0, max: 20 },
      duration: { value: 150, min: 100, max: 2000, step: 50 },
      pumpZoneWidth: { value: 0.7, min: 0.1, max: 2, step: 0.05 },
      pumpZoneHeight: { value: 4, min: 0.5, max: 10, step: 0.25 },
    }),
  })

  if (!isDebugMode) return DEFAULTS

  return controls
}
