import { Canvas } from '@react-three/fiber'
import WaterGame from './WaterGame.tsx'
import { KeyboardControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'

export default function App() {
  return (
    <>
      <KeyboardControls
        map={[
          { name: 'leftpump', keys: ['ArrowLeft', 'KeyA'] },
          { name: 'rightpump', keys: ['ArrowRight', 'KeyD'] },
        ]}
      >

        <Canvas
          shadows
          camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [0, 0, 10]
          }}
        >
          <Physics >
            <WaterGame />
          </Physics>
        </Canvas>
      </KeyboardControls>
    </>
  )
}