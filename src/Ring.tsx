import { RigidBody } from '@react-three/rapier'
import { interactionGroups } from '@react-three/rapier'
import type { RingData } from './types'

export default function Ring({ position, rotation }: RingData) {
  return (
    <RigidBody
      colliders="hull"
      position={[position.x, position.y, position.z]}
      rotation={rotation}
      linearDamping={5}
      angularDamping={10}
      gravityScale={0.5}
      restitution={0}
      friction={0.1}
      canSleep={false}
      collisionGroups={interactionGroups([0, 1], [0, 1])}
    >
      <mesh scale={0.25}>
        <torusGeometry />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </RigidBody>
  )
}
