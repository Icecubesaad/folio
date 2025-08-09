import { useState, useEffect } from 'react'
import { usePortfolioStore } from '@/store/portfolio-store'

interface Template {
  id: string
  name: string
  category: string
  style: string
  description: string
}

export const useTemplate = () => {
  const { preferences } = usePortfolioStore()
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([])
  
  const templates: Template[] = [
    { id: 'modern-minimal', name: 'Modern Minimal', category: 'developer', style: 'modern', description: 'Clean, focused design' },
    { id: 'creative-portfolio', name: 'Creative Portfolio', category: 'designer', style: 'creative', description: 'Bold, artistic design' },
    { id: 'professional-corporate', name: 'Professional Corporate', category: 'business', style: 'professional', description: 'Traditional, trustworthy' },
    { id: 'developer-showcase', name: 'Developer Showcase', category: 'developer', style: 'tech', description: 'Code-inspired design' }
  ]

  useEffect(() => {
    if (preferences?.field) {
      const fieldMapping: Record<string, string> = {
        'Frontend Developer': 'developer',
        'Backend Developer': 'developer',
        'UI/UX Designer': 'designer',
        'Marketing Manager': 'business'
      }
      
      const category = fieldMapping[preferences.field] || 'all'
      const filtered = category === 'all' 
        ? templates 
        : templates.filter(t => t.category === category)
      
      setFilteredTemplates(filtered)
    } else {
      setFilteredTemplates(templates)
    }
  }, [preferences])

  return { templates: filteredTemplates, allTemplates: templates }
}
