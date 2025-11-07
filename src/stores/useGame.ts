import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export default create(subscribeWithSelector((set) => ({
  pumpPhase: "ready",
  start: () => {
    set((state) => {
      if (state.pumpPhase === 'ready')
        return { pumpPhase: 'pumping', startTime: Date.now() }
      //if its not ready then dont update the store
      return {}
    })
  },
  end: () => {
    set((state) => {
      if (state.pumpPhase === 'pumping')
        return { pumpPhase: 'ready', endTime: Date.now(), startTime: 0 }
      return {}
    })
  },
})))