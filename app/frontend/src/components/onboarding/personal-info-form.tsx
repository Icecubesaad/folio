'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { personalInfoSchema } from '@/lib/validation'
import { usePortfolioStore } from '@/store/portfolio-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { User, Mail, Phone, MapPin } from 'lucide-react'

interface PersonalInfoFormData {
  fullName: string
  professionalTitle: string
  email: string
  phone?: string
  location?: string
  bio?: string
}

export const PersonalInfoForm: React.FC = () => {
  const { personalInfo, setPersonalInfo } = usePortfolioStore()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: personalInfo || {
      fullName: '',
      professionalTitle: '',
      email: '',
      phone: '',
      location: '',
      bio: ''
    },
    mode: 'onChange'
  })

  // Watch for changes and auto-save
  const watchedData = watch()
  React.useEffect(() => {
    if (isValid && watchedData.fullName && watchedData.email && watchedData.professionalTitle) {
      const timer = setTimeout(() => {
        setPersonalInfo(watchedData)
      }, 500) // Debounce updates

      return () => clearTimeout(timer)
    }
  }, [watchedData, isValid, setPersonalInfo])

  return (
    <div className="space-y-6">
      {/* Basic Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <span>Basic Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <Input
                {...register('fullName')}
                placeholder="John Doe"
                error={errors.fullName?.message}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professional Title *
              </label>
              <Input
                {...register('professionalTitle')}
                placeholder="Full Stack Developer"
                error={errors.professionalTitle?.message}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Professional Bio
            </label>
            <Textarea
              {...register('bio')}
              placeholder="Write a brief description about yourself, your expertise, and what makes you unique..."
              rows={4}
              error={errors.bio?.message}
            />
            <p className="text-xs text-gray-500 mt-1">
              {watchedData.bio?.length || 0} / 500 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-blue-600" />
            <span>Contact Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <Input
                {...register('email')}
                type="email"
                placeholder="john@example.com"
                error={errors.email?.message}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <Input
                {...register('phone')}
                type="tel"
                placeholder="+1 (555) 123-4567"
                error={errors.phone?.message}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <Input
              {...register('location')}
              placeholder="San Francisco, CA"
              error={errors.location?.message}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview Card */}
      {isValid && watchedData.fullName && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">
                {watchedData.fullName}
              </h3>
              <p className="text-blue-600 font-medium">
                {watchedData.professionalTitle}
              </p>
              {watchedData.location && (
                <p className="text-sm text-gray-600 flex items-center justify-center mt-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {watchedData.location}
                </p>
              )}
              {watchedData.bio && (
                <p className="text-sm text-gray-700 mt-3 max-w-md mx-auto">
                  {watchedData.bio.length > 100 
                    ? `${watchedData.bio.slice(0, 100)}...` 
                    : watchedData.bio
                  }
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Status */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Section Completion
          </span>
          <span className={`text-sm font-semibold ${
            isValid ? 'text-green-600' : 'text-orange-600'
          }`}>
            {isValid ? '✓ Complete' : 'Incomplete'}
          </span>
        </div>
        <div className="mt-2 bg-white rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isValid ? 'bg-green-500' : 'bg-orange-400'
            }`}
            style={{ 
              width: `${Math.round(
                (Object.keys(watchedData).filter(key => 
                  watchedData[key as keyof PersonalInfoFormData]
                ).length / 6) * 100
              )}%` 
            }}
          />
        </div>
      </div>
    </div>
  )
}