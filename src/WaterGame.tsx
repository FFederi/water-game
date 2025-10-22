import { Physics, CuboidCollider } from '@react-three/rapier'
import { RigidBody } from '@react-three/rapier'
import { OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'
import type { Euler } from '@react-three/fiber'

export function Container() {

  const wallLength = 6
  const wallHeight = 0.2
  const wallWidth = 1

  return <>

    {/* bottom wall */}
    <RigidBody
      type="kinematicPosition"
    >
      <mesh
        scale={[wallLength, wallHeight, wallWidth]}
        position={[0, -3, 0]}
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
        scale={[wallHeight, wallLength, wallWidth]}
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
    />
    <CuboidCollider
      args={[4, 4, 0.5]}
      position={[0, 0, wallWidth]}
    />
  </>
}

type RingProps = {
  position: Vector3
  rotation: Euler
}

export function Ring({ position, rotation }: RingProps) {

  return <>
    <RigidBody
      colliders="hull"
      position={position}
      rotation={rotation}
      linearDamping={5}
      angularDamping={3}
      gravityScale={0.5}
    >
      <mesh
        scale={0.1}
      >
        <torusGeometry />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </RigidBody>
  </>
}

export default function WaterGame({ ringsNumber = 20 }) {

  const ringPositions = Array.from(
    { length: ringsNumber },
    (_, i) => new Vector3(Math.random() * 2, Math.random() * 4 + 2, Math.random() / 2));

  return <>
    <OrbitControls />
    <Physics
    >
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

      {ringPositions.map((pos, i) => (
        <Ring key={i} position={pos} rotation={[1, Math.random(), Math.random()]} />
      ))}

      <Container />

    </Physics>

  </>
}