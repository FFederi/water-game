import useGame from './stores/useGame.ts'

export default function Interface() {
  const startPump = useGame((state) => state.start)

  return (
    <div className="interface">
      <button onClick={startPump}>PUSH</button>
    </div>
  )
}
