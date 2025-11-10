import { CuboidCollider, interactionGroups, RigidBody, useRapier } from '@react-three/rapier'
import { Vector3, Shape } from 'three'
import { OrbitControls, useKeyboardControls } from '@react-three/drei'
import type { Euler } from '@react-three/fiber'
import { useThree } from '@react-three/fiber'
import { useMemo } from 'react'
import WaterPump from './WaterPump.tsx'

export function Container({ wallHeight, wallLength, wallThickness }) {

  const bottomShape = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, wallHeight * 0.5);
    shape.lineTo(wallLength * 0.7, 0);
    shape.lineTo(wallLength, 0);
    shape.lineTo(0, 0);
    return shape;
  }, [wallHeight, wallLength]);

  const extrudeSettings = useMemo(() => ({
    depth: wallThickness,
    bevelEnabled: false
  }), [wallThickness]);

  return <>

    {/* bottom wall */}
    <RigidBody
      colliders="trimesh"
      type="kinematicPosition"
      position={[-wallLength / 2, -wallHeight / 2, -wallThickness]}
      restitution={1}
      friction={0.1}
      linearDamping={0}
      angularDamping={0}
      collisionGroups={interactionGroups([0], [0])}
    >
      <mesh
        scale={[1, 1, 2]}
      >
        <extrudeGeometry
          args={[bottomShape, { bevelEnabled: false }]}
        />
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

  const { viewport } = useThree()

  const wallLength = viewport.width
  const wallHeight = viewport.height
  const wallThickness = 2

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
          scale={0.25}
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
    <WaterPump
      debug={false}
      spherePosition={{
        x: wallLength / 3,
        y: -wallHeight,
        z: -wallThickness / 2
      }}

    />

    <Container
      wallHeight={wallHeight}
      wallLength={wallLength}
      wallThickness={wallThickness}
    />
  </>
}