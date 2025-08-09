// src/components/builder/forms/personal-info.tsx
'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Phone, MapPin, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { usePortfolioStore } from '@/store/portfolio-store'
import { useDebounce } from '@/hooks/use-debounce'
import { personalInfoSchema } from '@/lib/validation'

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>

export const PersonalInfoForm: React.FC = () => {
  const { personalInfo, setPersonalInfo } = usePortfolioStore()
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: personalInfo || {}
  })

  const watchedValues = watch()
  const debouncedValues = useDebounce(watchedValues, 500)

  // Auto-save on change
  useEffect(() => {
    if (debouncedValues.fullName && debouncedValues.email && debouncedValues.professionalTitle) {
      setPersonalInfo(debouncedValues)
    }
  }, [debouncedValues, setPersonalInfo])

  // Set initial values when personalInfo exists
  useEffect(() => {
    if (personalInfo) {
      Object.entries(personalInfo).forEach(([key, value]) => {
        setValue(key as keyof PersonalInfoFormData, value || '')
      })
    }
  }, [personalInfo, setValue])

  const onSubmit = (data: PersonalInfoFormData) => {
    setPersonalInfo(data)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <Input
                  {...register('fullName')}
                  placeholder="John Doe"
                  error={!!errors.fullName}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Title *
                </label>
                <Input
                  {...register('professionalTitle')}
                  placeholder="Frontend Developer"
                  error={!!errors.professionalTitle}
                />
                {errors.professionalTitle && (
                  <p className="text-red-500 text-xs mt-1">{errors.professionalTitle.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
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
                  {...register('email')}
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <Input
                  {...register('location')}
                  placeholder="San Francisco, CA"
                />
                <p className="text-gray-500 text-xs mt-1">
                  City, State/Country or Remote
                </p>
              </div>
            </div>
          </div>

          {/* Professional Bio */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Professional Bio
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About You
              </label>
              <Textarea
                {...register('bio')}
                rows={4}
                placeholder="Tell potential employers or clients about yourself. What drives you? What are your key strengths? What makes you unique in your field?"
                className="resize-none"
              />
              <p className="text-gray-500 text-xs mt-1">
                This will appear in your portfolio's about section. Keep it engaging and professional.
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {watchedValues.fullName && watchedValues.email && watchedValues.professionalTitle ? (
                <span className="text-green-600">✓ Auto-saved</span>
              ) : (
                <span>Fill required fields to auto-save</span>
              )}
            </div>
            
            <Button type="submit" disabled={!watchedValues.fullName || !watchedValues.email}>
              Update Information
            </Button>
          </div>
        </form>
      </Card>

      {/* Preview Card */}
      {personalInfo?.fullName && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
          <div className="space-y-3">
            <div>
              <h4 className="text-xl font-bold text-gray-900">{personalInfo.fullName}</h4>
              <p className="text-blue-600 font-medium">{personalInfo.professionalTitle}</p>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {personalInfo.email && (
                <span className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {personalInfo.email}
                </span>
              )}
              {personalInfo.phone && (
                <span className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  {personalInfo.phone}
                </span>
              )}
              {personalInfo.location && (
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {personalInfo.location}
                </span>
              )}
            </div>
            
            {personalInfo.bio && (
              <p className="text-gray-700 text-sm leading-relaxed">
                {personalInfo.bio}
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Tips Card */}
      <Card className="p-6 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 mb-3">💡 Tips for a Great Profile</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Use your full professional name as it appears on LinkedIn</li>
          <li>• Your title should clearly describe what you do (e.g., Senior Frontend Developer)</li>
          <li>• Write your bio in first person and keep it concise but engaging</li>
          <li>• Include location if youre open to local opportunities, or mention Remote if applicable</li>
        </ul>
      </Card>
    </div>
  )
}