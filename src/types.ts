export type Vec3 = { x: number; y: number; z: number }

export type Rotation3 = [number, number, number]

export interface RingData {
  position: Vec3
  rotation: Rotation3
}

export interface ContainerProps {
  wallHeight: number
  wallLength: number
  wallThickness: number
}

export interface WaterPumpProps {
  debug?: boolean
  nozzlePosition: Vec3
  force?: number
  duration?: number
  zoneWidth?: number
  zoneHeight?: number
  zoneDepth?: number
}

export interface DebugControls {
  wireframe: boolean
  showPumpZone: boolean
  physicsDebug: boolean
  count: number
  size: number
  linearDamping: number
  angularDamping: number
  gravityScale: number
  force: number
  duration: number
  pumpZoneWidth: number
  pumpZoneHeight: number
}

export type PumpPhase = 'ready' | 'pumping'

export interface GameState {
  pumpPhase: PumpPhase
  start: () => void
  end: () => void
}
