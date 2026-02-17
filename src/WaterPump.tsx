import { useKeyboardControls } from '@react-three/drei'
import { CuboidCollider, interactionGroups, RigidBody } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import useGame from './stores/useGame.ts'
import type { WaterPumpProps } from './types'

export default function WaterPump({
  debug = false,
  nozzlePosition,
  force = 4,
  duration = 800,
  zoneWidth = 0.7,
  zoneHeight = 4,
  zoneDepth = 0.7,
}: WaterPumpProps) {
  const [subscribeKeys] = useKeyboardControls()
  const startPump = useGame((state) => state.start)
  const endPump = useGame((state) => state.end)

  const [active, setActive] = useState(false)
  const elapsedRef = useRef(0)
  const overlappingBodies = useRef<Set<RapierRigidBody>>(new Set())

  const halfWidth = zoneWidth / 2
  const halfHeight = zoneHeight / 2
  const halfDepth = zoneDepth / 2

  const zoneCenter = {
    x: nozzlePosition.x,
    y: nozzlePosition.y + halfHeight,
    z: nozzlePosition.z,
  }

  useEffect(() => {
    const unsubscribePumpKey = subscribeKeys(
      (state) => state.leftpump,
      (value) => {
        if (value) {
          startPump()
        }
      }
    )

    const unsubscribePumpButton = useGame.subscribe(
      (state) => state.pumpPhase,
      (phase) => {
        if (phase === 'pumping') {
          setActive(true)
        }
      }
    )

    return () => {
      unsubscribePumpKey()
      unsubscribePumpButton()
    }
  }, [subscribeKeys, startPump])

  useFrame((_state, delta) => {
    if (active) {
      elapsedRef.current += delta * 1000
      if (elapsedRef.current > duration) {
        endPump()
        setActive(false)
        elapsedRef.current = 0
        return
      }

      const nozzleY = nozzlePosition.y
      overlappingBodies.current.forEach((body) => {
        if (!body.isValid()) {
          overlappingBodies.current.delete(body)
          return
        }
        const bodyPos = body.translation()
        const normalizedHeight = Math.max(0, Math.min(1, (bodyPos.y - nozzleY) / zoneHeight))
        const verticalFalloff = Math.pow(1 - normalizedHeight, 3)
        const horizontalDist = Math.abs(bodyPos.x - nozzlePosition.x) / halfWidth
        const lateralFalloff = Math.pow(1 - Math.min(1, horizontalDist), 2)
        const attenuatedForce = force * verticalFalloff * lateralFalloff
        const normalizedX = (bodyPos.x - nozzlePosition.x) / halfWidth
        const jitter = Math.random() < 0.5 ? 0 : 0.8 + Math.random() * 0.4
        const horizontalForce = -attenuatedForce * 0.3 * (1 - normalizedX) * jitter
        body.applyImpulse({ x: horizontalForce * delta, y: attenuatedForce * delta, z: 0 }, true)
      })
    }
  })

  return (
    <RigidBody
      type="fixed"
      position={[zoneCenter.x, zoneCenter.y, zoneCenter.z]}
      collisionGroups={interactionGroups([1], [1])}
    >
      <CuboidCollider
        args={[halfWidth, halfHeight, halfDepth]}
        sensor
        onIntersectionEnter={(payload) => {
          if (payload.other.rigidBody) {
            overlappingBodies.current.add(payload.other.rigidBody)
          }
        }}
        onIntersectionExit={(payload) => {
          if (payload.other.rigidBody) {
            overlappingBodies.current.delete(payload.other.rigidBody)
          }
        }}
      />
      {debug && (
        <mesh>
          <boxGeometry args={[zoneWidth, zoneHeight, zoneDepth]} />
          <meshStandardMaterial
            transparent
            opacity={0.3}
            wireframe
            color="cyan"
          />
        </mesh>
      )}
    </RigidBody>
  )
}