import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { UserProfile, PlanetId, AppState } from '../types';

interface AppContextType {
  state: AppState;
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  navigateTo: (view: AppState['currentView']) => void;
  startTravel: (planet: PlanetId) => void;
  finishTravel: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useLocalStorage<UserProfile | null>('profile', null);
  const [currentView, setCurrentView] = useLocalStorage<AppState['currentView']>(
    'currentView',
    profile ? 'universe' : 'welcome'
  );
  const [travelingTo, setTravelingTo] = useLocalStorage<PlanetId | null>('travelingTo', null);

  const state: AppState = { profile, currentView, travelingTo };

  const navigateTo = (view: AppState['currentView']) => {
    setTravelingTo(null);
    setCurrentView(view);
  };

  const startTravel = (planet: PlanetId) => {
    setTravelingTo(planet);
    setTimeout(() => {
      setTravelingTo(null);
      setCurrentView(planet);
    }, 1500);
  };

  const finishTravel = () => {
    if (travelingTo) {
      setCurrentView(travelingTo);
      setTravelingTo(null);
    }
  };

  return (
    <AppContext.Provider value={{ state, profile, setProfile, navigateTo, startTravel, finishTravel }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
