import { create } from 'zustand';

interface UIState {
    isHoveringButton: boolean;
    setHoveringButton: (hover: boolean) => void;
    hasInteracted: boolean;
    setInteracted: (interacted: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
    isHoveringButton: false,
    setHoveringButton: (hover) => set({ isHoveringButton: hover }),
    hasInteracted: false,
    setInteracted: (interacted) => set({ hasInteracted: interacted }),
}));
