
import { create } from 'zustand';
// Removed Quiz import as it does not exist in types.ts
import { UserState, Mission, Knowledge } from './types';
import { MISSIONS_DATA, KNOWLEDGE_DATA } from './data/mock_data';

interface AppStore {
  user: UserState;
  missions: Mission[];
  knowledge: Knowledge[];
  currentMissionId: string | null;
  currentKnowledgeId: string | null;
  
  // Actions
  completeMission: (id: string) => void;
  unlockKnowledge: (id: string) => void;
  addXP: (amount: number) => void;
  setCurrentMission: (id: string | null) => void;
  setCurrentKnowledge: (id: string | null) => void;
}

const INITIAL_USER: UserState = {
  xp: 0,
  level: 1,
  streak: 0,
  completedMissionIds: [],
  unlockedKnowledgeIds: ['k1', 'k2', 'k3'], // Default starter knowledge
  badges: [],
  // Added missing photos property to satisfy UserState interface
  photos: [],
};

export const useStore = create<AppStore>((set) => ({
  user: INITIAL_USER,
  missions: MISSIONS_DATA,
  knowledge: KNOWLEDGE_DATA.map(k => ({
    ...k,
    isLocked: !INITIAL_USER.unlockedKnowledgeIds.includes(k.id)
  })),
  currentMissionId: null,
  currentKnowledgeId: null,

  completeMission: (id) => set((state) => {
    if (state.user.completedMissionIds.includes(id)) return state;
    const mission = state.missions.find(m => m.id === id);
    if (!mission) return state;

    const newCompleted = [...state.user.completedMissionIds, id];
    const newUnlockedKnowledge = [...state.user.unlockedKnowledgeIds, ...mission.rewards.unlockKnowledgeIds];
    
    return {
      user: {
        ...state.user,
        completedMissionIds: newCompleted,
        unlockedKnowledgeIds: Array.from(new Set(newUnlockedKnowledge)),
        xp: state.user.xp + mission.rewards.xp,
      },
      knowledge: state.knowledge.map(k => ({
        ...k,
        isLocked: !newUnlockedKnowledge.includes(k.id)
      }))
    };
  }),

  unlockKnowledge: (id) => set((state) => {
    const newUnlocked = Array.from(new Set([...state.user.unlockedKnowledgeIds, id]));
    return {
      user: { ...state.user, unlockedKnowledgeIds: newUnlocked },
      knowledge: state.knowledge.map(k => ({
        ...k,
        isLocked: !newUnlocked.includes(k.id)
      }))
    };
  }),

  addXP: (amount) => set((state) => ({
    user: { ...state.user, xp: state.user.xp + amount }
  })),

  setCurrentMission: (id) => set({ currentMissionId: id }),
  setCurrentKnowledge: (id) => set({ currentKnowledgeId: id }),
}));