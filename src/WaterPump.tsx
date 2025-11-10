import { useKeyboardControls } from '@react-three/drei'
import { interactionGroups } from '@react-three/rapier'
import { RigidBody } from '@react-three/rapier'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import useGame from './stores/useGame.ts'

function PulseBox({ position, rotation, radius, debug }) {

  const sphere = useRef(null)
  const [subscribeKeys, getKeys] = useKeyboardControls()
  const startPump = useGame((state) => state.start)
  const endPump = useGame((state) => state.end)

  const [active, setActive] = useState(false)

  const applyImpulseSphere = () => {
    sphere.current.setTranslation({ x: position.x, y: position.y + 0.5, z: position.z }, true)

    if (sphere.current) {
      sphere.current.setLinvel({ x: 0, y: 4, z: 0 })
    }
  }

  useEffect(() => {

    const unsubscribePumpKey = subscribeKeys(
      // selector
      (state) =>
        state.leftpump,
      (value) => {
        if (value) {
          startPump()
        }
      })

    const unsubscribePumpButton = useGame.subscribe((state) => state.pumpPhase,
      (phase) => {
        if (phase === 'pumping')
          setActive(true)
        setTimeout(() => {
          if (sphere.current) applyImpulseSphere()
        }, 50)
      }
    )

    return () => {
      unsubscribePumpKey()
      unsubscribePumpButton()
    }
  }, [])

  useFrame((state, delta) => {

    if (active) {
      const gameState = useGame.getState()
      const elapsedTime = Date.now() - gameState.startTime

      // stop the pump after 0.8 seconds
      if (elapsedTime > 800) {
        endPump()
        setActive(false)
      }
    }

    if (!active && sphere.current) {
      //move the sphere out of sight
      sphere.current.setTranslation({ x: position.x, y: position.y, z: position.z }, true)
    }

  })

  return <>
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
      <mesh >
        <sphereGeometry args={[radius]} />
        <meshStandardMaterial
          transparent={!debug}
          opacity={0.0}
          wireframe />
      </mesh>
    </RigidBody>
  </>
}

type WaterPumpProps = {
  debug: boolean;
  spherePosition: { x: number, y: number, z: number }
}

export default function WaterPump({ debug = false, spherePosition }: WaterPumpProps) {

  return <>

    <PulseBox
      position={spherePosition}
      rotation={{ x: Math.PI, y: 0, z: 0 }}
      radius={-spherePosition.z * 0.7}
      debug={debug}
    />
  </>
}