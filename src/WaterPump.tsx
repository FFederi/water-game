import { useKeyboardControls } from '@react-three/drei'
import { interactionGroups } from '@react-three/rapier'
import { RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import useGame from './stores/useGame.ts'

type WaterPumpProps = {
  debug: boolean;
}

function PulseBox({ position, rotation, radius, debug }) {

  const sphere = useRef(null)
  const [subscribeKeys, getKeys] = useKeyboardControls()
  const startPump = useGame((state) => state.start)
  const endPump = useGame((state) => state.end)

  const [active, setActive] = useState(false)

  const applyImpulseSphere = () => {
    sphere.current.setTranslation({ x: position.x, y: position.y - 2, z: position.z }, true)

    if (sphere.current) {
      sphere.current.setLinvel({ x: 0, y: 4, z: 0 })
    }
  }

  useEffect(() => {

    const unsubscribePump = subscribeKeys(
      // selector
      (state) =>
        state.leftpump,
      (value) => {
        if (value) {
          startPump()
          setActive(true)
          setTimeout(() => {
            if (sphere.current) applyImpulseSphere()
          }, 50)
        }
      })

    return () => {
      unsubscribePump()
    }
  }, [])

  useFrame((state, delta) => {

    const gameState = useGame.getState()
    const elapsedTime = Date.now() - gameState.startTime

    // stop the pump after 1 second
    if (elapsedTime > 1000) {
      endPump()
      setActive(false)
    }

    if (!active && sphere.current) {
      //move the sphere out of sight
      sphere.current.setTranslation({ x: position.x, y: position.y - 4, z: position.z }, true)
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

export default function WaterPump({ debug = false }: WaterPumpProps) {

  return <>

    <PulseBox
      position={{ x: 1.5, y: -2.3, z: 0 }}
      rotation={{ x: Math.PI, y: 0, z: 0 }}
      radius={0.5}
      debug={debug}
    />
  </>
}