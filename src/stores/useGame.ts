import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { GameState } from '../types'

export default create<GameState>()(subscribeWithSelector((set) => ({
  pumpPhase: 'ready',
  start: () => {
    set((state) => {
      if (state.pumpPhase === 'ready')
        return { pumpPhase: 'pumping' }
      return {}
    })
  },
  end: () => {
    set((state) => {
      if (state.pumpPhase === 'pumping')
        return { pumpPhase: 'ready' }
      return {}
    })
  },
})))
