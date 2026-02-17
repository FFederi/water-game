import { RigidBody } from '@react-three/rapier'
import { interactionGroups } from '@react-three/rapier'
import type { RingData } from './types'

interface RingProps extends RingData {
  wireframe?: boolean
  size?: number
  linearDamping?: number
  angularDamping?: number
  gravityScale?: number
}

export default function Ring({
  position,
  rotation,
  wireframe = false,
  size = 0.25,
  linearDamping = 5,
  angularDamping = 10,
  gravityScale = 0.5,
}: RingProps) {
  return (
    <RigidBody
      colliders="hull"
      position={[position.x, position.y, position.z]}
      rotation={rotation}
      linearDamping={linearDamping}
      angularDamping={angularDamping}
      gravityScale={gravityScale}
      restitution={0}
      friction={0.1}
      canSleep={false}
      collisionGroups={interactionGroups([0, 1], [0, 1])}
    >
      <mesh scale={size}>
        <torusGeometry />
        <meshStandardMaterial color="hotpink" wireframe={wireframe} />
      </mesh>
    </RigidBody>
  )
}
