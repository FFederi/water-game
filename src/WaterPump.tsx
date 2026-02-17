import { useKeyboardControls } from '@react-three/drei'
import { interactionGroups, RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useRef, useState, useEffect, useCallback } from 'react'
import useGame from './stores/useGame.ts'
import type { WaterPumpProps } from './types'

export default function WaterPump({ debug = false, spherePosition, velocity = 4, duration = 800 }: WaterPumpProps) {
  const sphere = useRef(null)
  const [subscribeKeys] = useKeyboardControls()
  const startPump = useGame((state) => state.start)
  const endPump = useGame((state) => state.end)

  const [active, setActive] = useState(false)
  const elapsedRef = useRef(0)

  const position = spherePosition
  const rotation = { x: Math.PI, y: 0, z: 0 }
  const radius = -spherePosition.z * 0.7

  const applyImpulseSphereRef = useRef<() => void>(() => {})
  applyImpulseSphereRef.current = useCallback(() => {
    if (!sphere.current) return
    sphere.current.setTranslation({ x: position.x, y: position.y + 0.5, z: position.z }, true)
    sphere.current.setLinvel({ x: 0, y: velocity, z: 0 })
  }, [position, velocity])

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
          setTimeout(() => {
            applyImpulseSphereRef.current()
          }, 50)
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
      }
    }

    if (!active && sphere.current) {
      sphere.current.setTranslation({ x: position.x, y: position.y, z: position.z }, true)
    }
  })

  return (
    <RigidBody
      ref={sphere}
      position={[position.x, position.y, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      colliders="ball"
      restitution={10}
      friction={0}
      linearDamping={0.5}
      angularDamping={0.5}
      gravityScale={0}
      canSleep={false}
      collisionGroups={interactionGroups([1], [1])}
    >
      <mesh>
        <sphereGeometry args={[radius]} />
        <meshStandardMaterial
          transparent={!debug}
          opacity={0.0}
          wireframe
        />
      </mesh>
    </RigidBody>
  )
}
