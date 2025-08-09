import { z } from 'zod'

export const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  professionalTitle: z.string().min(2, 'Title is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional()
})

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company name required'),
  role: z.string().min(1, 'Role required'),
  duration: z.string().min(1, 'Duration required'),
  description: z.string().optional(),
  current: z.boolean().optional()
})

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  tech: z.string().min(1, 'Technologies required'),
  link: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal(''))
})