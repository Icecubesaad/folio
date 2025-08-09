import { create } from 'zustand'

interface UIState {
  sidebarCollapsed: boolean
  activeForm: string
  isGenerating: boolean
  previewMode: 'desktop' | 'tablet' | 'mobile'
  
  setSidebarCollapsed: (collapsed: boolean) => void
  setActiveForm: (form: string) => void
  setIsGenerating: (generating: boolean) => void
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  activeForm: 'personal',
  isGenerating: false,
  previewMode: 'desktop',
  
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setActiveForm: (form) => set({ activeForm: form }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setPreviewMode: (mode) => set({ previewMode: mode })
}))