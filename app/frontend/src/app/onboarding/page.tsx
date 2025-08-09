'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { ChevronLeft, ChevronRight, User, Briefcase, Palette, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { usePortfolioStore } from '@/store/portfolio-store'
import toast from 'react-hot-toast'

interface OnboardingFormData {
  // Personal Info
  fullName: string
  professionalTitle: string
  email: string
  phone: string
  location: string
  bio: string
  
  // Professional Field
  field: string
  experienceLevel: string
  specializations: string[]
  
  // Style Preferences  
  preferredStyle: string
  colorScheme: string
  layoutPreference: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<OnboardingFormData>()
  const { setPersonalInfo, setPreferences } = usePortfolioStore()
  
  const totalSteps = 3

  const professionFields = [
    'Software Developer', 'Frontend Developer', 'Backend Developer', 'Full-Stack Developer',
    'UI/UX Designer', 'Graphic Designer', 'Product Designer', 'Web Designer',
    'Marketing Manager', 'Digital Marketer', 'Content Creator', 'Social Media Manager',
    'Data Scientist', 'Data Analyst', 'Business Analyst', 'Product Manager',
    'Photographer', 'Videographer', 'Writer', 'Consultant', 'Other'
  ]

  const experienceLevels = [
    'Student/Entry Level (0-2 years)',
    'Mid-Level (3-5 years)', 
    'Senior Level (6-10 years)',
    'Lead/Principal (10+ years)',
    'Executive/C-Level'
  ]

  const styleOptions = [
    { id: 'modern', name: 'Modern & Minimal', desc: 'Clean lines, lots of white space, contemporary feel' },
    { id: 'creative', name: 'Creative & Bold', desc: 'Vibrant colors, unique layouts, artistic expression' },
    { id: 'professional', name: 'Professional & Corporate', desc: 'Traditional, trustworthy, business-focused' },
    { id: 'tech', name: 'Tech & Developer', desc: 'Code-inspired, dark themes, technical aesthetic' }
  ]

  const colorSchemes = [
    'Blue & White', 'Dark & Minimal', 'Warm & Inviting', 'Vibrant & Colorful', 'Monochrome', 'Custom'
  ]

  const onSubmit = (data: OnboardingFormData) => {
    // Save to store
    setPersonalInfo({
      fullName: data.fullName,
      professionalTitle: data.professionalTitle,
      email: data.email,
      phone: data.phone,
      location: data.location,
      bio: data.bio
    })

    setPreferences({
      field: data.field,
      experienceLevel: data.experienceLevel,
      preferredStyle: data.preferredStyle,
      colorScheme: data.colorScheme,
      specializations: data.specializations || []
    })

    toast.success('Profile created! Let\'s choose your template.')
    router.push('/templates')
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tell Us About Yourself</h1>
          <p className="text-lg text-gray-600">We'll use this info to create the perfect portfolio for you</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                {step < 3 && <div className={`w-16 h-1 mx-2 ${
                  step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`} />}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-600">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <User className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <Input 
                    {...register('fullName', { required: 'Full name is required' })}
                    placeholder="John Doe"
                    className="w-full"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title *</label>
                  <Input 
                    {...register('professionalTitle', { required: 'Professional title is required' })}
                    placeholder="Frontend Developer"
                    className="w-full"
                  />
                  {errors.professionalTitle && <p className="text-red-500 text-sm mt-1">{errors.professionalTitle.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <Input 
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                    })}
                    type="email"
                    placeholder="john@example.com"
                    className="w-full"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <Input 
                    {...register('phone')}
                    placeholder="+1 (555) 123-4567"
                    className="w-full"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <Input 
                    {...register('location')}
                    placeholder="San Francisco, CA"
                    className="w-full"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio</label>
                  <Textarea 
                    {...register('bio')}
                    placeholder="Tell us about yourself, your passion, and what makes you unique..."
                    rows={4}
                    className="w-full"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Step 2: Professional Details */}
          {currentStep === 2 && (
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <Briefcase className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900">Professional Details</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">What's your field? *</label>
                  <select 
                    {...register('field', { required: 'Please select your field' })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select your profession...</option>
                    {professionFields.map((field) => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                  {errors.field && <p className="text-red-500 text-sm mt-1">{errors.field.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level *</label>
                  <select 
                    {...register('experienceLevel', { required: 'Please select your experience level' })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select your experience level...</option>
                    {experienceLevels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                  {errors.experienceLevel && <p className="text-red-500 text-sm mt-1">{errors.experienceLevel.message}</p>}
                </div>
              </div>
            </Card>
          )}

          {/* Step 3: Style Preferences */}
          {currentStep === 3 && (
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <Palette className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900">Style Preferences</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Choose your preferred style *</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {styleOptions.map((style) => (
                      <div key={style.id} className="relative">
                        <input
                          type="radio"
                          {...register('preferredStyle', { required: 'Please select a style' })}
                          value={style.id}
                          className="sr-only peer"
                          id={style.id}
                        />
                        <label
                          htmlFor={style.id}
                          className="block p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all duration-200"
                        >
                          <div className="font-semibold text-gray-900">{style.name}</div>
                          <div className="text-sm text-gray-600 mt-1">{style.desc}</div>
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.preferredStyle && <p className="text-red-500 text-sm mt-1">{errors.preferredStyle.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Color Scheme</label>
                  <select 
                    {...register('colorScheme')}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Let AI choose for me</option>
                    {colorSchemes.map((scheme) => (
                      <option key={scheme} value={scheme}>{scheme}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>

            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <span>Continue to Templates</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}