import useGame from './stores/useGame.ts'

export default function Interface() {

  const startPump = useGame((state) => state.start)

  const push = () => {
    startPump()
  }

  return <div className="interface">
    <button onClick={push}>PUSH</button>
  </div>
}