import { create } from 'zustand'

interface Template {
  id: string
  name: string
  category: string
  style: string
  description: string
}

interface TemplateState {
  selectedTemplate: Template | null
  setSelectedTemplate: (template: Template) => void
  clearTemplate: () => void
}

export const useTemplateStore = create<TemplateState>((set) => ({
  selectedTemplate: null,
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  clearTemplate: () => set({ selectedTemplate: null })
}))
