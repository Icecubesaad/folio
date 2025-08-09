import { z } from 'zod'

// Enhanced validation with better error messages and sanitization
export const personalInfoSchema = z.object({
  fullName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name can only contain letters, spaces, hyphens, apostrophes, and periods')
    .transform(name => name.trim().replace(/\s+/g, ' ')), // Normalize whitespace
  
  professionalTitle: z.string()
    .min(2, 'Professional title is required')
    .max(150, 'Professional title must be less than 150 characters')
    .transform(title => title.trim()),
  
  email: z.string()
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long')
    .toLowerCase()
    .transform(email => email.trim()),
  
  phone: z.string()
    .optional()
    .transform(phone => phone?.trim())
    .refine(
      phone => !phone || /^[\+]?[1-9][\d\-\s\(\)]{7,15}$/.test(phone),
      'Please enter a valid phone number'
    ),
  
  location: z.string()
    .optional()
    .transform(location => location?.trim())
    .refine(
      location => !location || location.length <= 100,
      'Location must be less than 100 characters'
    ),
  
  bio: z.string()
    .optional()
    .transform(bio => bio?.trim())
    .refine(
      bio => !bio || (bio.length >= 10 && bio.length <= 500),
      'Bio must be between 10 and 500 characters if provided'
    )
})

export const experienceSchema = z.object({
  id: z.string().optional(),
  company: z.string()
    .min(1, 'Company name is required')
    .max(100, 'Company name must be less than 100 characters')
    .transform(company => company.trim()),
  
  role: z.string()
    .min(1, 'Job title is required')
    .max(100, 'Job title must be less than 100 characters')
    .transform(role => role.trim()),
  
  startDate: z.string()
    .min(1, 'Start date is required')
    .regex(/^\d{4}-\d{2}$/, 'Please use YYYY-MM format'),
  
  endDate: z.string()
    .optional()
    .refine(
      date => !date || /^\d{4}-\d{2}$/.test(date),
      'Please use YYYY-MM format'
    ),
  
  current: z.boolean().optional().default(false),
  
  description: z.string()
    .optional()
    .transform(desc => desc?.trim())
    .refine(
      desc => !desc || (desc.length >= 10 && desc.length <= 1000),
      'Description must be between 10 and 1000 characters if provided'
    ),
  
  location: z.string()
    .optional()
    .transform(location => location?.trim())
    .refine(
      location => !location || location.length <= 100,
      'Location must be less than 100 characters'
    )
}).refine(
  data => {
    if (data.current) return true
    if (!data.endDate) return false
    
    const start = new Date(data.startDate + '-01')
    const end = new Date(data.endDate + '-01')
    return end >= start
  },
  {
    message: 'End date must be after start date',
    path: ['endDate']
  }
)

export const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be less than 100 characters')
    .transform(name => name.trim()),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters')
    .transform(desc => desc.trim()),
  
  technologies: z.array(z.string().min(1).transform(tech => tech.trim()))
    .min(1, 'At least one technology is required')
    .max(20, 'Maximum 20 technologies allowed'),
  
  liveUrl: z.string()
    .optional()
    .transform(url => url?.trim())
    .refine(
      url => !url || /^https?:\/\/.+\..+/.test(url),
      'Please enter a valid URL (including http:// or https://)'
    ),
  
  githubUrl: z.string()
    .optional()
    .transform(url => url?.trim())
    .refine(
      url => !url || /^https:\/\/github\.com\/.+/.test(url),
      'Please enter a valid GitHub URL'
    ),
  
  featured: z.boolean().optional().default(false),
  
  status: z.enum(['completed', 'in-progress', 'planned']).default('completed'),
  
  dateCompleted: z.string()
    .optional()
    .refine(
      date => !date || /^\d{4}-\d{2}$/.test(date),
      'Please use YYYY-MM format'
    )
})

export const skillSchema = z.object({
  id: z.string().optional(),
  category: z.string()
    .min(1, 'Category name is required')
    .max(50, 'Category name must be less than 50 characters')
    .transform(category => category.trim()),
  
  skills: z.array(
    z.object({
      name: z.string()
        .min(1, 'Skill name is required')
        .max(50, 'Skill name must be less than 50 characters')
        .transform(name => name.trim()),
      
      level: z.enum(['beginner', 'intermediate', 'advanced', 'expert'])
        .optional()
        .default('intermediate'),
      
      yearsOfExperience: z.number()
        .min(0, 'Years of experience cannot be negative')
        .max(50, 'Years of experience seems unrealistic')
        .optional()
    })
  )
  .min(1, 'At least one skill is required per category')
  .max(15, 'Maximum 15 skills per category')
})

export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string()
    .min(1, 'Institution name is required')
    .max(150, 'Institution name must be less than 150 characters')
    .transform(institution => institution.trim()),
  
  degree: z.string()
    .min(1, 'Degree is required')
    .max(100, 'Degree must be less than 100 characters')
    .transform(degree => degree.trim()),
  
  field: z.string()
    .optional()
    .transform(field => field?.trim())
    .refine(
      field => !field || field.length <= 100,
      'Field of study must be less than 100 characters'
    ),
  
  startYear: z.number()
    .min(1950, 'Start year must be 1950 or later')
    .max(new Date().getFullYear(), 'Start year cannot be in the future'),
  
  endYear: z.number()
    .optional()
    .refine(
      year => !year || (year >= 1950 && year <= new Date().getFullYear() + 10),
      'End year must be between 1950 and 10 years from now'
    ),
  
  inProgress: z.boolean().optional().default(false),
  
  gpa: z.number()
    .min(0, 'GPA cannot be negative')
    .max(4.0, 'GPA cannot exceed 4.0')
    .optional(),
  
  honors: z.string()
    .optional()
    .transform(honors => honors?.trim())
    .refine(
      honors => !honors || honors.length <= 200,
      'Honors must be less than 200 characters'
    )
}).refine(
  data => {
    if (data.inProgress) return true
    if (!data.endYear) return false
    return data.endYear >= data.startYear
  },
  {
    message: 'End year must be after start year',
    path: ['endYear']
  }
)

export const socialLinksSchema = z.object({
  linkedin: z.string()
    .optional()
    .transform(url => url?.trim())
    .refine(
      url => !url || /^https:\/\/(?:www\.)?linkedin\.com\/in\/.+/.test(url),
      'Please enter a valid LinkedIn profile URL'
    ),
  
  github: z.string()
    .optional()
    .transform(url => url?.trim())
    .refine(
      url => !url || /^https:\/\/github\.com\/.+/.test(url),
      'Please enter a valid GitHub profile URL'
    ),
  
  twitter: z.string()
    .optional()
    .transform(url => url?.trim())
    .refine(
      url => !url || /^https:\/\/(?:www\.)?twitter\.com\/.+/.test(url),
      'Please enter a valid Twitter profile URL'
    ),
  
  website: z.string()
    .optional()
    .transform(url => url?.trim())
    .refine(
      url => !url || /^https?:\/\/.+\..+/.test(url),
      'Please enter a valid website URL (including http:// or https://)'
    ),
  
  behance: z.string()
    .optional()
    .transform(url => url?.trim())
    .refine(
      url => !url || /^https:\/\/(?:www\.)?behance\.net\/.+/.test(url),
      'Please enter a valid Behance profile URL'
    ),
  
  dribbble: z.string()
    .optional()
    .transform(url => url?.trim())
    .refine(
      url => !url || /^https:\/\/dribbble\.com\/.+/.test(url),
      'Please enter a valid Dribbble profile URL'
    )
})

export const contactPreferencesSchema = z.object({
  preferredContactMethod: z.enum(['email', 'phone', 'linkedin']).default('email'),
  availableForWork: z.boolean().default(true),
  availableForFreelance: z.boolean().default(false),
  availableForMentoring: z.boolean().default(false),
  timeZone: z.string().optional(),
  responseTimeExpectation: z.enum(['same-day', 'within-24h', 'within-week']).default('within-24h')
})

// Complete portfolio schema
export const portfolioSchema = z.object({
  personalInfo: personalInfoSchema,
  experience: z.array(experienceSchema).default([]),
  projects: z.array(projectSchema).default([]),
  skills: z.array(skillSchema).default([]),
  education: z.array(educationSchema).default([]),
  socialLinks: socialLinksSchema.optional(),
  contactPreferences: contactPreferencesSchema.default({}),
  
  // Meta information
  lastUpdated: z.date().default(() => new Date()),
  version: z.string().default('1.0.0'),
  template: z.string().optional()
})

// Utility functions for validation
export const validatePortfolioSection = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  sectionName: string
): { success: boolean; data?: T; errors?: string[] } => {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      )
      console.warn(`Validation failed for ${sectionName}:`, errors)
      return { success: false, errors }
    }
    return { 
      success: false, 
      errors: [`Unknown validation error in ${sectionName}`] 
    }
  }
}

// Safe parsing with fallbacks
export const safeParsePortfolioData = (data: unknown) => {
  const result = portfolioSchema.safeParse(data)
  
  if (result.success) {
    return result.data
  }
  
  // Return partial data with defaults for failed validations
  const fallbackData = {
    personalInfo: {
      fullName: '',
      professionalTitle: '',
      email: ''
    },
    experience: [],
    projects: [],
    skills: [],
    education: [],
    socialLinks: {},
    contactPreferences: {
      preferredContactMethod: 'email' as const,
      availableForWork: true,
      availableForFreelance: false,
      availableForMentoring: false,
      responseTimeExpectation: 'within-24h' as const
    },
    lastUpdated: new Date(),
    version: '1.0.0'
  }
  
  console.warn('Portfolio validation failed, using fallback data:', result.error)
  return fallbackData
}