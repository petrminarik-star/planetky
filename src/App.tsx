import { useApp } from './context/AppContext'
import Universe from './components/Universe/Universe'
import RocketSelect from './components/Rocket/RocketSelect'
import Cards from './planets/P1_Cards/Cards'
import DreamBoard from './planets/P2_DreamBoard/DreamBoard'
import CreateSubject from './planets/P3_CreateSubject/CreateSubject'
import AntiStress from './planets/P4_AntiStress/AntiStress'
import FutureSelf from './planets/P5_FutureSelf/FutureSelf'
import Inventions from './planets/P6_Inventions/Inventions'
import Giving from './planets/P7_Giving/Giving'
import LittleHeroes from './planets/P8_LittleHeroes/LittleHeroes'
import type { PlanetId } from './types'

const PLANET_COMPONENTS: Record<PlanetId, React.ComponentType> = {
  cards: Cards,
  dreamboard: DreamBoard,
  subject: CreateSubject,
  antistress: AntiStress,
  'future-self': FutureSelf,
  inventions: Inventions,
  giving: Giving,
  heroes: LittleHeroes,
}

function App() {
  const { state } = useApp()

  if (!state.profile || state.currentView === 'welcome') {
    return <RocketSelect />
  }

  if (state.currentView === 'universe') {
    return <Universe />
  }

  const PlanetComponent = PLANET_COMPONENTS[state.currentView as PlanetId]
  if (PlanetComponent) {
    return <PlanetComponent />
  }

  return <Universe />
}

export default App
