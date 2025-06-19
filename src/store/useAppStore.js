import { create } from 'zustand';

export const useAppStore = create((set) => ({
  // Authentication
  isAuthenticated: false,
  user: null,
  
  // Navigation
  currentView: 'landing',
  
  // 3D Scene
  currentModel: null,
  sceneState: null,
  
  // AI Assistant
  aiChatOpen: false,
  aiContext: null,
  
  // Hand Tracking
  handTrackingEnabled: true,
  gestureData: null,
  
  // Voice
  voiceEnabled: true,
  isListening: false,
  
  // Subscription
  subscriptionTier: 'free',
  subscriptionStatus: null,
  
  // Actions
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
  setCurrentView: (view) => set({ currentView: view }),
  setCurrentModel: (model) => set({ currentModel: model }),
  setAiChatOpen: (open) => set({ aiChatOpen: open }),
  setHandTrackingEnabled: (enabled) => set({ handTrackingEnabled: enabled }),
  setVoiceEnabled: (enabled) => set({ voiceEnabled: enabled }),
  setGestureData: (data) => set({ gestureData: data }),
  setIsListening: (listening) => set({ isListening: listening }),
  setSubscriptionTier: (tier) => set({ subscriptionTier: tier }),
  setSubscriptionStatus: (status) => set({ subscriptionStatus: status }),
}));