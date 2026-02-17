import { Canvas } from '@react-three/fiber'
import WaterGame from './WaterGame.tsx'
import { KeyboardControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { Leva } from 'leva'
import Interface from './Interface.tsx'
import useDebugControls, { isDebugMode } from './useDebugControls.ts'

export default function App() {
  const debug = useDebugControls()

  return (
    <>
      <Leva hidden={!isDebugMode} />
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
            position: [0, 0, 4]
          }}
        >
          <Physics debug={debug.physicsDebug}>
            <WaterGame debug={debug} />
          </Physics>
        </Canvas>
        <Interface />
      </KeyboardControls>
    </>
  )
}
