import { creativeTemplate } from './creative/template'
import { developerTemplate } from './developer/template'
import { businessTemplate } from './business/template'
import { modernTemplate } from './modern/template'
import { freelancerTemplate } from './freelancer/template'

import { creativePrompt } from './creative/prompt'
import { developerPrompt } from './developer/prompt'
import { businessPrompt } from './business/prompt'
import { modernPrompt } from './modern/prompt'
import { freelancerPrompt } from './freelancer/prompt'

export const templates = [
  creativeTemplate,
  developerTemplate,
  businessTemplate,
  modernTemplate,
  freelancerTemplate
]

export const allTemplatePrompts = {
	'creative-portfolio': creativePrompt,
	'developer-showcase': developerPrompt,
	'professional-corporate': businessPrompt,
	'modern-minimal': modernPrompt,
	'freelancer-hub': freelancerPrompt
  }

export const getTemplateById = (id: string) => {
  return templates.find(template => template.id === id)
}

export const getPromptById = (id: string) => {
  return allTemplatePrompts[id as keyof typeof allTemplatePrompts]
}

export const getTemplatesByCategory = (category: string) => {
  if (category === 'all') return templates
  return templates.filter(template => template.category === category)
}

export const getTemplatesByStyle = (style: string) => {
  return templates.filter(template => template.style === style)
}


export const allTemplates = [
	creativeTemplate,
	developerTemplate,
	businessTemplate,
	modernTemplate,
	freelancerTemplate
  ]