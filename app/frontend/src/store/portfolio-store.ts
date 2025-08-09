import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PersonalInfo {
  fullName: string
  professionalTitle: string
  email: string
  phone?: string
  location?: string
  bio?: string
}

interface Experience {
  id: string
  company: string
  role: string
  duration: string
  description?: string
  current?: boolean
}

interface Project {
  id: string
  name: string
  description: string
  tech: string
  link?: string
  github?: string
}

interface Skill {
  id: string
  category: string
  items: string[]
  proficiency?: number
}

interface Education {
  id: string
  school: string
  degree: string
  year: string
  details?: string
}

interface Preferences {
  field: string
  experienceLevel: string
  preferredStyle: string
  colorScheme?: string
  specializations?: string[]
}

interface PortfolioState {
  personalInfo: PersonalInfo | null
  experience: Experience[]
  projects: Project[]
  skills: Skill[]
  education: Education[]
  preferences: Preferences | null
  
  // Actions
  setPersonalInfo: (info: PersonalInfo) => void
  setPreferences: (prefs: Preferences) => void
  addExperience: (exp: Omit<Experience, 'id'>) => void
  updateExperience: (id: string, exp: Partial<Experience>) => void
  removeExperience: (id: string) => void
  addProject: (proj: Omit<Project, 'id'>) => void
  updateProject: (id: string, proj: Partial<Project>) => void
  removeProject: (id: string) => void
  addSkill: (skill: Omit<Skill, 'id'>) => void
  updateSkill: (id: string, skill: Partial<Skill>) => void
  removeSkill: (id: string) => void
  addEducation: (edu: Omit<Education, 'id'>) => void
  updateEducation: (id: string, edu: Partial<Education>) => void
  removeEducation: (id: string) => void
  reset: () => void
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      personalInfo: null,
      experience: [],
      projects: [],
      skills: [],
      education: [],
      preferences: null,

      setPersonalInfo: (info) => set({ personalInfo: info }),
      setPreferences: (prefs) => set({ preferences: prefs }),

      addExperience: (exp) => set((state) => ({
        experience: [...state.experience, { ...exp, id: Date.now().toString() }]
      })),
      updateExperience: (id, exp) => set((state) => ({
        experience: state.experience.map(item => item.id === id ? { ...item, ...exp } : item)
      })),
      removeExperience: (id) => set((state) => ({
        experience: state.experience.filter(item => item.id !== id)
      })),

      addProject: (proj) => set((state) => ({
        projects: [...state.projects, { ...proj, id: Date.now().toString() }]
      })),
      updateProject: (id, proj) => set((state) => ({
        projects: state.projects.map(item => item.id === id ? { ...item, ...proj } : item)
      })),
      removeProject: (id) => set((state) => ({
        projects: state.projects.filter(item => item.id !== id)
      })),

      addSkill: (skill) => set((state) => ({
        skills: [...state.skills, { ...skill, id: Date.now().toString() }]
      })),
      updateSkill: (id, skill) => set((state) => ({
        skills: state.skills.map(item => item.id === id ? { ...item, ...skill } : item)
      })),
      removeSkill: (id) => set((state) => ({
        skills: state.skills.filter(item => item.id !== id)
      })),

      addEducation: (edu) => set((state) => ({
        education: [...state.education, { ...edu, id: Date.now().toString() }]
      })),
      updateEducation: (id, edu) => set((state) => ({
        education: state.education.map(item => item.id === id ? { ...item, ...edu } : item)
      })),
      removeEducation: (id) => set((state) => ({
        education: state.education.filter(item => item.id !== id)
      })),

      reset: () => set({
        personalInfo: null,
        experience: [],
        projects: [],
        skills: [],
        education: [],
        preferences: null
      })
    }),
    { name: 'portfolio-data' }
  )
)
