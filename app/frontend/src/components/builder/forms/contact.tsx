// src/components/builder/forms/contact.tsx
'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Twitter, Instagram } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { usePortfolioStore } from '@/store/portfolio-store'
import { useDebounce } from '@/hooks/use-debounce'

interface ContactFormData {
  email: string
  phone?: string
  website?: string
  location?: string
  linkedin?: string
  github?: string
  twitter?: string
  instagram?: string
}

const socialPlatforms = [
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/username' },
  { key: 'github', label: 'GitHub', icon: Github, placeholder: 'https://github.com/username' },
  { key: 'twitter', label: 'Twitter', icon: Twitter, placeholder: 'https://twitter.com/username' },
  { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/username' }
]

export const ContactForm: React.FC = () => {
  const { personalInfo, setPersonalInfo } = usePortfolioStore()
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue
  } = useForm<ContactFormData>({
    defaultValues: {
      email: personalInfo?.email || '',
      phone: personalInfo?.phone || '',
      location: personalInfo?.location || '',
      website: '',
      linkedin: '',
      github: '',
      twitter: '',
      instagram: ''
    }
  })

  const watchedValues = watch()
  const debouncedValues = useDebounce(watchedValues, 500)

  // Auto-save on change
  useEffect(() => {
    if (debouncedValues.email) {
      setPersonalInfo({
        ...personalInfo!,
        email: debouncedValues.email,
        phone: debouncedValues.phone || personalInfo?.phone,
        location: debouncedValues.location || personalInfo?.location
      })
    }
  }, [debouncedValues, personalInfo, setPersonalInfo])

  // Set initial values
  useEffect(() => {
    if (personalInfo) {
      setValue('email', personalInfo.email)
      setValue('phone', personalInfo.phone || '')
      setValue('location', personalInfo.location || '')
    }
  }, [personalInfo, setValue])

  const onSubmit = (data: ContactFormData) => {
    // Update personal info with contact details
    setPersonalInfo({
      ...personalInfo!,
      email: data.email,
      phone: data.phone,
      location: data.location
    })
    
    // Here you could also save social links to a separate store if needed
    console.log('Contact data:', data)
  }

  const validateUrl = (url: string) => {
    if (!url) return true
    try {
      new URL(url)
      return true
    } catch {
      return 'Please enter a valid URL'
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Basic Contact Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-blue-600" />
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <Input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                  })}
                  type="email"
                  placeholder="john@example.com"
                  error={!!errors.email}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <Input
                  {...register('phone')}
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <Input
                  {...register('location')}
                  placeholder="San Francisco, CA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <Input
                  {...register('website', { validate: validateUrl })}
                  type="url"
                  placeholder="https://yourwebsite.com"
                  error={!!errors.website}
                />
                {errors.website && (
                  <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-blue-600" />
              Social Media & Professional Links
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon
                return (
                  <div key={platform.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Icon className="h-4 w-4 mr-2" />
                      {platform.label}
                    </label>
                    <Input
                      {...register(platform.key as keyof ContactFormData, { validate: validateUrl })}
                      type="url"
                      placeholder={platform.placeholder}
                      error={!!errors[platform.key as keyof ContactFormData]}
                    />
                    {errors[platform.key as keyof ContactFormData] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[platform.key as keyof ContactFormData]?.message}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {watchedValues.email ? (
                <span className="text-green-600">✓ Auto-saved</span>
              ) : (
                <span>Enter your contact information</span>
              )}
            </div>
            
            <Button type="submit" disabled={!watchedValues.email}>
              Update Contact Info
            </Button>
          </div>
        </form>
      </Card>

      {/* Preview Card */}
      {personalInfo?.email && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Preview</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-blue-600" />
              <span className="text-gray-700">{watchedValues.email}</span>
            </div>
            
            {watchedValues.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">{watchedValues.phone}</span>
              </div>
            )}
            
            {watchedValues.location && (
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">{watchedValues.location}</span>
              </div>
            )}
            
            {watchedValues.website && (
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-blue-600" />
                <a 
                  href={watchedValues.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {watchedValues.website}
                </a>
              </div>
            )}

            {/* Social Links */}
            <div className="flex space-x-4 pt-2">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon
                const url = watchedValues[platform.key as keyof ContactFormData]
                
                if (!url) return null
                
                return (
                  <a
                    key={platform.key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Tips Card */}
      <Card className="p-6 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 mb-3">💡 Contact Information Tips</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Use a professional email address</li>
          <li>• Include your LinkedIn profile - its essential for professional networking</li>
          <li>• Add your GitHub if youre in tech to showcase your code</li>
          <li>• Only include social media thats relevant to your profession</li>
          <li>• Make sure all links are working and profiles are up-to-date</li>
          <li>• Consider creating a personal website to stand out</li>
        </ul>
      </Card>
    </div>
  )
}