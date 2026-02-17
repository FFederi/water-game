import { interactionGroups, RigidBody } from '@react-three/rapier'
import { Shape } from 'three'
import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useMemo } from 'react'
import WaterPump from './WaterPump.tsx'
import Ring from './Ring.tsx'
import type { ContainerProps, DebugControls, RingData } from './types'

interface WallProps {
  position: [number, number, number]
  scale: [number, number, number]
  transparent?: boolean
  wireframe?: boolean
}

function Wall({ position, scale, transparent = false, wireframe = false }: WallProps) {
  return (
    <RigidBody
      type="kinematicPosition"
      position={position}
      collisionGroups={interactionGroups([0], [0])}
    >
      <mesh scale={scale}>
        <boxGeometry />
        <meshStandardMaterial
          color="yellow"
          transparent={transparent}
          opacity={transparent ? 0.0 : 1.0}
          wireframe={wireframe}
        />
      </mesh>
    </RigidBody>
  )
}

export function Container({ wallHeight, wallLength, wallThickness, wireframe = false }: ContainerProps & { wireframe?: boolean }) {
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

  return (
    <>
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
        <mesh>
          <extrudeGeometry args={[bottomShape, extrudeSettings]} />
          <meshStandardMaterial color="yellow" wireframe={wireframe} />
        </mesh>
      </RigidBody>

      {/* left wall */}
      <Wall
        position={[-wallLength / 2 - wallThickness / 2, 0, -wallThickness / 2]}
        scale={[wallThickness, wallHeight, wallThickness]}
        wireframe={wireframe}
      />

      {/* right wall */}
      <Wall
        position={[wallLength / 2 + wallThickness / 2, 0, -wallThickness / 2]}
        scale={[wallThickness, wallHeight, wallThickness]}
        wireframe={wireframe}
      />

      {/* back glass pane */}
      <Wall
        position={[0, 0, -wallThickness - 0.5]}
        scale={[wallLength, wallHeight, 1]}
        transparent
        wireframe={wireframe}
      />

      {/* front glass pane */}
      <Wall
        position={[0, 0, 0.5]}
        scale={[wallLength, wallHeight, 1]}
        transparent
        wireframe={wireframe}
      />
    </>
  )
}

const BASE_HEIGHT = 8
const BASE_WIDTH = BASE_HEIGHT * (9 / 16)

export default function WaterGame({ debug }: { debug: DebugControls }) {
  const { viewport } = useThree()

  const aspectRatio = 9 / 16
  const wallHeight = viewport.height
  const wallLength = wallHeight * aspectRatio
  const wallThickness = 2

  const spawnWidth = wallLength * 0.8
  const spawnDepth = wallThickness * 0.8

  const rings = useMemo(() => {
    return Array.from<unknown, RingData>(
      { length: debug.count },
      () => ({
        position: {
          x: Math.random() * spawnWidth - spawnWidth / 2,
          y: Math.random() * 4 + 2,
          z: -(Math.random() * spawnDepth),
        },
        rotation: [1, Math.random(), Math.random()],
      })
    )
  }, [debug.count, spawnWidth, spawnDepth])

  return (
    <>
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
        shadow-camera-bottom={-10}
        shadow-camera-left={-10}
      />
      <ambientLight intensity={1.5} />

      {rings.map((ring, i) => (
        <Ring
          key={`ring-${i}-${debug.size}-${debug.linearDamping}-${debug.angularDamping}-${debug.gravityScale}`}
          position={ring.position}
          rotation={ring.rotation}
          wireframe={debug.wireframe}
          size={debug.size}
          linearDamping={debug.linearDamping}
          angularDamping={debug.angularDamping}
          gravityScale={debug.gravityScale}
        />
      ))}

      <WaterPump
        key={`pump-${debug.pumpSphereSize}`}
        debug={debug.showPumpSphere}
        spherePosition={{
          x: wallLength / 3,
          y: -wallHeight,
          z: -wallThickness / 2
        }}
        velocity={debug.velocity}
        duration={debug.duration}
        sphereSize={debug.pumpSphereSize}
      />

      <Container
        wallHeight={wallHeight}
        wallLength={wallLength}
        wallThickness={wallThickness}
        wireframe={debug.wireframe}
      />
    </>
  )
}
