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