export type RocketType = 'rocket-girl' | 'rocket-boy' | 'rocket-star' | 'rocket-cosmic';

export type PlanetId = 'cards' | 'dreamboard' | 'subject' | 'antistress' | 'future-self' | 'inventions' | 'giving' | 'heroes';

export type TimeOfDay = 'morning' | 'evening';

export type DreamTimeframe = '6months' | '1year' | '1-3years' | 'beyond';

export type PersonalityType = 'sangvinik' | 'cholerik' | 'flegmatik' | 'melancholik';

export interface Planet {
  id: PlanetId;
  name: string;
  description: string;
  color: string;
  icon: string;
  orbitRadius: number;
  size: number;
  speed: number;
}

export interface Card {
  id: string;
  text: string;
  type: TimeOfDay;
}

export interface Dream {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  timeframe: DreamTimeframe;
  completed: boolean;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  whatToLearn: string;
  howTeaching: string;
  tools: string;
  goalOneYear: string;
  goalFourYears: string;
  logo: string;
  createdAt: string;
}

export interface Invention {
  id: string;
  answers: Record<string, string>;
  plan: string[];
  createdAt: string;
}

export interface GivingEntry {
  id: string;
  type: 'regular' | 'oneTime';
  whatToGive: string;
  whoToHelp: string;
  volunteerWork: string;
  strengths: string;
  createdAt: string;
}

export interface DiaryEntry {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  rocketType: RocketType;
  createdAt: string;
}

export interface AppState {
  profile: UserProfile | null;
  currentView: 'welcome' | 'universe' | PlanetId;
  travelingTo: PlanetId | null;
}
