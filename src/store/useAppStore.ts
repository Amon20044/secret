import { create } from 'zustand';

interface AppState {
  // Authentication
  isAuthenticated: boolean;
  user: any | null;
  
  // Navigation
  currentView: 'landing' | 'dashboard' | 'scene';
  
  // 3D Scene
  currentModel: any | null;
  sceneState: any | null;
  
  // AI Assistant
  aiChatOpen: boolean;
  aiContext: any | null;
  
  // Hand Tracking
  handTrackingEnabled: boolean;
  gestureData: any | null;
  
  // Voice
  voiceEnabled: boolean;
  isListening: boolean;
  
  // Actions
  setAuthenticated: (auth: boolean) => void;
  setCurrentView: (view: 'landing' | 'dashboard' | 'scene') => void;
  setCurrentModel: (model: any) => void;
  setAiChatOpen: (open: boolean) => void;
  setHandTrackingEnabled: (enabled: boolean) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  setGestureData: (data: any) => void;
  setIsListening: (listening: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  isAuthenticated: false,
  user: null,
  currentView: 'landing',
  currentModel: null,
  sceneState: null,
  aiChatOpen: false,
  aiContext: null,
  handTrackingEnabled: true,
  gestureData: null,
  voiceEnabled: true,
  isListening: false,
  
  // Actions
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
  setCurrentView: (view) => set({ currentView: view }),
  setCurrentModel: (model) => set({ currentModel: model }),
  setAiChatOpen: (open) => set({ aiChatOpen: open }),
  setHandTrackingEnabled: (enabled) => set({ handTrackingEnabled: enabled }),
  setVoiceEnabled: (enabled) => set({ voiceEnabled: enabled }),
  setGestureData: (data) => set({ gestureData: data }),
  setIsListening: (listening) => set({ isListening: listening }),
}));