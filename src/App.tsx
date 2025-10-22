import { Canvas } from '@react-three/fiber'
import WaterGame from './WaterGame.tsx'

export default function App() {
  return (
    <>
      <Canvas
        shadows
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [0, 0, 10]
        }}
      >
        <WaterGame />
      </Canvas>
    </>
  )
}
