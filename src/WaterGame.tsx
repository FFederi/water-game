import { CuboidCollider, interactionGroups, RigidBody, useRapier } from '@react-three/rapier'
import { OrbitControls, useKeyboardControls } from '@react-three/drei'
import { Vector3 } from 'three'
import type { Euler } from '@react-three/fiber'
import { useThree } from '@react-three/fiber'
import { useMemo } from 'react'
import WaterPump from './WaterPump.tsx'

export function Container() {
  const { viewport } = useThree()

  const wallLength = viewport.width
  const wallHeight = viewport.height
  const wallThickness = 2

  return <>

    {/* bottom wall */}
    <RigidBody
      type="kinematicPosition"
      position={[0, -wallHeight / 2 - wallThickness / 2, -wallThickness / 2]}
      restitution={1}
      friction={0.1}
      linearDamping={0}
      angularDamping={0}
      collisionGroups={interactionGroups([0], [0])}
    >
      <mesh
        scale={[wallLength, wallThickness, wallThickness]}
      >
        <boxGeometry />
        <meshStandardMaterial color="yellow" />
      </mesh>
    </RigidBody>

    <RigidBody
      type="kinematicPosition"
      position={[-wallLength / 20, -wallHeight / 2 - wallThickness / 2, -wallThickness / 2]}
      rotation={[0, 0, Math.PI * -0.2]}
      restitution={1}
      friction={0.1}
      linearDamping={0}
      angularDamping={0}
      collisionGroups={interactionGroups([0], [0])}
    >
      <mesh
        scale={[wallLength * 2, wallThickness, wallThickness]}
      >
        <boxGeometry />
        <meshStandardMaterial color="yellow" />
      </mesh>
    </RigidBody>
    {/* left wall */}
    <RigidBody
      type="kinematicPosition"
      position={[-wallLength / 2 - wallThickness / 2, 0, -wallThickness / 2]}
      collisionGroups={interactionGroups([0], [0])}
    >
      <mesh
        scale={[wallThickness, wallHeight, wallThickness]}
      >
        <boxGeometry />
        <meshStandardMaterial color="yellow" />
      </mesh>
    </RigidBody>

    {/* right wall */}
    <RigidBody
      type="kinematicPosition"
      position={[wallLength / 2 + wallThickness / 2, 0, -wallThickness / 2]}
      collisionGroups={interactionGroups([0], [0])}
    >
      <mesh
        scale={[wallThickness, wallHeight, wallThickness]}
      >
        <boxGeometry />
        <meshStandardMaterial color="yellow" />
      </mesh>
    </RigidBody>

    {/* back glass pane */}
    <RigidBody
      type="kinematicPosition"
      position={[0, 0, -wallThickness - 0.5]}
      collisionGroups={interactionGroups([0], [0])}
    >
      <mesh
        scale={[wallLength, wallHeight, 1]}
      >
        <boxGeometry />
        <meshStandardMaterial
          transparent={true}
          opacity={0.0}
        />
      </mesh>
    </RigidBody>
    {/* front glass pane */}
    <RigidBody
      type="kinematicPosition"
      position={[0, 0, 0.5]}
      collisionGroups={interactionGroups([0], [0])}
    >
      <mesh
        scale={[wallLength, wallHeight, 1]}
      >
        <boxGeometry />
        <meshStandardMaterial
          transparent={true}
          opacity={0.0}
        />
      </mesh>
    </RigidBody>
  </>
}

type RingProps = {
  position: Vector3
  rotation: Euler
}

export default function WaterGame({ ringsNumber = 20 }) {

  //TODO: scale rings size and spawn position based on viewport
  const rings = useMemo(() => {

    const rings: RingProps[] = Array.from(
      { length: ringsNumber },
      (_) => ({
        position: new Vector3(Math.random() * 4 - 2, Math.random() * 4 + 2, Math.random() - 1),
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
    <WaterPump debug={true} />

    <Container />
  </>
}