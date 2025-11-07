import { CuboidCollider, interactionGroups } from '@react-three/rapier'
import { RigidBody, useRapier } from '@react-three/rapier'
import { OrbitControls, useKeyboardControls } from '@react-three/drei'
import { Vector3 } from 'three'
import type { Euler } from '@react-three/fiber'
import { useMemo } from 'react'
import WaterPump from './WaterPump.tsx'

//TODO: remove the test container
export function Container() {

  const wallLength = 6
  const wallHeight = 0.2
  const wallWidth = 1

  return <>

    {/* bottom wall */}
    <RigidBody
      type="kinematicPosition"
      restitution={1}
      friction={0.1}
      linearDamping={0}
      angularDamping={0}
      collisionGroups={interactionGroups([0], [0])}
    >
      <mesh
        scale={[wallLength * 1.2, wallHeight, wallWidth]}
        position={[0, -3, 0]}
        rotation={[0, 0, -Math.PI * 0.14]}
      >
        <boxGeometry />
        <meshStandardMaterial color="yellow" />
      </mesh>
    </RigidBody>

    {/* left wall */}
    <RigidBody
      type="kinematicPosition"
    >
      <mesh
        scale={[wallHeight, wallLength, wallWidth]}
        position={[-2.9, 0, 0]}
      >
        <boxGeometry />
        <meshStandardMaterial color="yellow" />
      </mesh>
    </RigidBody>

    {/* right wall */}
    <RigidBody
      type="kinematicPosition"
    >
      <mesh
        scale={[wallHeight, wallLength * 1.5, wallWidth]}
        position={[2.9, 0, 0]}
      >
        <boxGeometry />
        <meshStandardMaterial color="yellow" />
      </mesh>
    </RigidBody>

    {/* simulating glass panes */}
    <CuboidCollider
      args={[4, 4, 0.5]}
      position={[0, 0, -wallWidth]}
      collisionGroups={interactionGroups([0], [0])}
    />
    <CuboidCollider
      args={[4, 4, 0.5]}
      position={[0, 0, wallWidth]}
      collisionGroups={interactionGroups([0], [0])}
    />
  </>
}

type RingProps = {
  position: Vector3
  rotation: Euler
}

export default function WaterGame({ ringsNumber = 20 }) {
  const rings = useMemo(() => {

    const rings: RingProps[] = Array.from(
      { length: ringsNumber },
      (_) => ({
        position: new Vector3(Math.random() * 4 - 2, Math.random() * 4 + 2, Math.random() / 2),
        rotation: [1, Math.random(), Math.random()] as Euler
      })
    )

    return rings.map((ring, i) => (
      <RigidBody
        key={i}
        colliders="hull"
        position={ring.position}
        rotation={ring.rotation}
        linearDamping={5}
        angularDamping={10}
        gravityScale={0.5}
        restitution={0}
        friction={0.1}
        canSleep={false}
        collisionGroups={interactionGroups([0, 1], [0, 1])}
      >
        <mesh
          scale={0.1}
        >
          <torusGeometry />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      </RigidBody>
    ))

  }, [])

  return <>
    <OrbitControls />
    <directionalLight
      castShadow
      position={[4, 4, 1]}
      intensity={1.5}
      shadow-mapSize={[1024, 1024]}
      shadow-camera-near={1}
      shadow-camera-far={10}
      shadow-camera-top={10}
      shadow-camera-right={10}
      shadow-camera-bottom={- 10}
      shadow-camera-left={- 10}
    />
    <ambientLight intensity={1.5} />

    {rings}
    <WaterPump debug={false} />

    <Container />
  </>
}