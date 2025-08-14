// src/store/portfolio-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Type definitions based on your actual interfaces
export interface PersonalInfo {
  fullName: string
  professionalTitle: string
  email: string
  phone?: string
  location?: string
  bio?: string
}

export interface Experience {
  id: string
  company: string
  role: string
  duration: string
  description?: string
  current?: boolean
}

export interface Project {
  id: string
  name: string
  description: string
  tech: string
  link?: string
  github?: string
}

export interface Skill {
  id: string
  category: string
  items: string[]
  proficiency?: number
}

export interface Education {
  id: string
  school: string
  degree: string
  year: string
  details?: string
}

export interface Template {
  id: string
  name: string
  category: string
  style: string
  description: string
  features: string[]
  bestFor: string[]
  complexity: 'Simple' | 'Moderate' | 'Advanced'
  popular?: boolean
}

interface Contact {
  email: string
  phone?: string
  location?: string
  website?: string
}

interface SocialLink {
  platform: string
  url: string
  username: string
}

interface Preferences {
  field: any
  experienceLevel: any
  preferredStyle: any
  colorScheme: any
  specializations: any[]
}

interface PortfolioData {
  personalInfo: PersonalInfo | null
  experience: Experience[]
  skills: Skill[]
  projects: Project[]
  education: Education[]
  contact: Contact | null
  socialLinks: SocialLink[]
  preferences: Preferences | null
}

interface PortfolioState extends PortfolioData {
  // State management methods
  setPersonalInfo: (info: PersonalInfo) => void
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void
  setPreferences: ({field, experienceLevel, preferredStyle, colorScheme, specializations}: {
    field: any,
    experienceLevel: any,
    preferredStyle: any,
    colorScheme: any,
    specializations: any[]
  }) => void
  
  // Experience methods
  addExperience: (experience: Omit<Experience, 'id'>) => void
  updateExperience: (id: string, experience: Partial<Experience>) => void
  removeExperience: (id: string) => void
  reorderExperience: (fromIndex: number, toIndex: number) => void
  
  // Skills methods
  addSkill: (skill: Omit<Skill, 'id'>) => void
  updateSkill: (id: string, skill: Partial<Skill>) => void
  removeSkill: (id: string) => void
  addMultipleSkills: (skills: Omit<Skill, 'id'>[]) => void
  
  // Projects methods
  addProject: (project: Omit<Project, 'id'>) => void
  updateProject: (id: string, project: Partial<Project>) => void
  removeProject: (id: string) => void
  reorderProjects: (fromIndex: number, toIndex: number) => void
  
  // Education methods
  addEducation: (education: Omit<Education, 'id'>) => void
  updateEducation: (id: string, education: Partial<Education>) => void
  removeEducation: (id: string) => void
  
  // Contact methods
  setContact: (contact: Contact) => void
  updateContact: (contact: Partial<Contact>) => void
  
  // Social links methods
  addSocialLink: (link: SocialLink) => void
  updateSocialLink: (platform: string, link: Partial<SocialLink>) => void
  removeSocialLink: (platform: string) => void
  
  // Utility methods
  reset: () => void
  exportData: () => PortfolioData
  importData: (data: Partial<PortfolioData>) => void
  getCompletionPercentage: () => number
  getSectionCompletionStatus: () => Record<string, boolean>
}

// Generate unique ID
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9)

// Initial state
const initialState: PortfolioData = {
  personalInfo: null,
  experience: [],
  skills: [],
  projects: [],
  education: [],
  contact: null,
  socialLinks: [],
  preferences: null
}

// Array reorder utility
const reorderArray = (array: any[], fromIndex: number, toIndex: number): any[] => {
  const result = Array.from(array)
  const [removed] = result.splice(fromIndex, 1)
  result.splice(toIndex, 0, removed)
  return result
}

// Create the store with persistence
export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Personal Info methods
      setPersonalInfo: (info) => set({ personalInfo: info }),
      updatePersonalInfo: (info) => set((state) => ({
        personalInfo: state.personalInfo ? { ...state.personalInfo, ...info } : info as PersonalInfo
      })),

      // Preferences method
      setPreferences: ({field, experienceLevel, preferredStyle, colorScheme, specializations}) => 
        set({ preferences: {field, experienceLevel, preferredStyle, colorScheme, specializations} }),

      // Experience methods
      addExperience: (experience) => set((state) => ({
        experience: [...state.experience, { ...experience, id: generateId() }]
      })),
      updateExperience: (id, updates) => set((state) => ({
        experience: state.experience.map(exp => 
          exp.id === id ? { ...exp, ...updates } : exp
        )
      })),
      removeExperience: (id) => set((state) => ({
        experience: state.experience.filter(exp => exp.id !== id)
      })),
      reorderExperience: (fromIndex, toIndex) => set((state) => ({
        experience: reorderArray(state.experience, fromIndex, toIndex)
      })),

      // Skills methods
      addSkill: (skill) => set((state) => ({
        skills: [...state.skills, { ...skill, id: generateId() }]
      })),
      updateSkill: (id, updates) => set((state) => ({
        skills: state.skills.map(skill => 
          skill.id === id ? { ...skill, ...updates } : skill
        )
      })),
      removeSkill: (id) => set((state) => ({
        skills: state.skills.filter(skill => skill.id !== id)
      })),
      addMultipleSkills: (newSkills) => set((state) => ({
        skills: [
          ...state.skills, 
          ...newSkills.map(skill => ({ ...skill, id: generateId() }))
        ]
      })),

      // Projects methods
      addProject: (project) => set((state) => ({
        projects: [...state.projects, { ...project, id: generateId() }]
      })),
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(project => 
          project.id === id ? { ...project, ...updates } : project
        )
      })),
      removeProject: (id) => set((state) => ({
        projects: state.projects.filter(project => project.id !== id)
      })),
      reorderProjects: (fromIndex, toIndex) => set((state) => ({
        projects: reorderArray(state.projects, fromIndex, toIndex)
      })),

      // Education methods
      addEducation: (education) => set((state) => ({
        education: [...state.education, { ...education, id: generateId() }]
      })),
      updateEducation: (id, updates) => set((state) => ({
        education: state.education.map(edu => 
          edu.id === id ? { ...edu, ...updates } : edu
        )
      })),
      removeEducation: (id) => set((state) => ({
        education: state.education.filter(edu => edu.id !== id)
      })),

      // Contact methods
      setContact: (contact) => set({ contact }),
      updateContact: (updates) => set((state) => ({
        contact: state.contact ? { ...state.contact, ...updates } : updates as Contact
      })),

      // Social links methods
      addSocialLink: (link) => set((state) => ({
        socialLinks: [...state.socialLinks.filter(l => l.platform !== link.platform), link]
      })),
      updateSocialLink: (platform, updates) => set((state) => ({
        socialLinks: state.socialLinks.map(link => 
          link.platform === platform ? { ...link, ...updates } : link
        )
      })),
      removeSocialLink: (platform) => set((state) => ({
        socialLinks: state.socialLinks.filter(link => link.platform !== platform)
      })),

      // Utility methods
      reset: () => set(initialState),
      
      exportData: () => {
        const state = get()
        return {
          personalInfo: state.personalInfo,
          experience: state.experience,
          skills: state.skills,
          projects: state.projects,
          education: state.education,
          contact: state.contact,
          socialLinks: state.socialLinks,
          preferences: state.preferences
        }
      },
      
      importData: (data) => set((state) => ({
        ...state,
        ...data
      })),
      
      getCompletionPercentage: () => {
        const state = get()
        const sections = [
          !!state.personalInfo?.fullName,
          state.experience.length > 0,
          state.skills.length > 0,
          state.projects.length > 0,
          state.education.length > 0,
          !!state.contact?.email,
          state.socialLinks.length > 0
        ]
        
        const completed = sections.filter(Boolean).length
        return Math.round((completed / sections.length) * 100)
      },
      
      getSectionCompletionStatus: () => {
        const state = get()
        return {
          personal: !!state.personalInfo?.fullName && !!state.personalInfo?.professionalTitle,
          experience: state.experience.length > 0,
          skills: state.skills.length > 0,
          projects: state.projects.length > 0,
          education: state.education.length > 0,
          contact: !!state.contact?.email,
          social: state.socialLinks.length > 0
        }
      }
    }),
    {
      name: 'portfolio-builder-data',
      version: 1,
      // Only persist the data, not the methods
      partialize: (state) => ({
        personalInfo: state.personalInfo,
        experience: state.experience,
        skills: state.skills,
        projects: state.projects,
        education: state.education,
        contact: state.contact,
        socialLinks: state.socialLinks,
        preferences: state.preferences
      })
    }
  )
)

// Selectors for better performance
export const selectPersonalInfo = (state: PortfolioState) => state.personalInfo
export const selectExperience = (state: PortfolioState) => state.experience
export const selectSkills = (state: PortfolioState) => state.skills
export const selectProjects = (state: PortfolioState) => state.projects
export const selectEducation = (state: PortfolioState) => state.education
export const selectContact = (state: PortfolioState) => state.contact
export const selectSocialLinks = (state: PortfolioState) => state.socialLinks
export const selectPreferences = (state: PortfolioState) => state.preferences

// Hooks for specific sections
export const usePersonalInfo = () => usePortfolioStore(selectPersonalInfo)
export const useExperience = () => usePortfolioStore(selectExperience)
export const useSkills = () => usePortfolioStore(selectSkills)
export const useProjects = () => usePortfolioStore(selectProjects)
export const useEducation = () => usePortfolioStore(selectEducation)
export const useContact = () => usePortfolioStore(selectContact)
export const useSocialLinks = () => usePortfolioStore(selectSocialLinks)
export const usePreferences = () => usePortfolioStore(selectPreferences)

// Custom hooks for common operations
export const usePortfolioCompletion = () => {
  const completionPercentage = usePortfolioStore(state => state.getCompletionPercentage())
  const sectionStatus = usePortfolioStore(state => state.getSectionCompletionStatus())
  
  return {
    percentage: completionPercentage,
    sections: sectionStatus,
    isComplete: completionPercentage === 100
  }
}

// Skills by category hook
export const useSkillsByCategory = () => {
  const skills = usePortfolioStore(selectSkills)
  
  return skills.reduce((acc, skill) => {
    const category = skill.category || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)
}