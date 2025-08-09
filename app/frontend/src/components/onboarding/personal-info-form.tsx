'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, MapPin, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  location: z.string().optional(),
  professionalTitle: z.string().min(1, 'Professional title is required'),
  bio: z.string().optional()
})

type PersonalInfoData = z.infer<typeof personalInfoSchema>

interface PersonalInfoFormProps {
  onSubmit: (data: PersonalInfoData) => void
  initialData?: Partial<PersonalInfoData>
  isLoading?: boolean
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: initialData,
    mode: 'onChange'
  })

  const watchedValues = watch()
  const completionPercentage = Math.round((Object.values(watchedValues).filter(Boolean).length / 6) * 100)

  return (
    <Card className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about yourself</h2>
        <p className="text-gray-600">
          We'll use this information to personalize your portfolio
        </p>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 mr-2" />
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
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Mail className="h-4 w-4 mr-2" />
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
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FileText className="h-4 w-4 mr-2" />
            Professional Title *
          </label>
          <Input
            {...register('professionalTitle')}
            placeholder="Frontend Developer, UX Designer, etc."
            error={!!errors.professionalTitle}
          />
          {errors.professionalTitle && (
            <p className="text-red-500 text-xs mt-1">{errors.professionalTitle.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 mr-2" />
              Location
            </label>
            <Input
              {...register('location')}
              placeholder="San Francisco, CA"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio (Optional)
          </label>
          <Textarea
            {...register('bio')}
            rows={4}
            placeholder="Tell us about yourself, your passion, and what makes you unique in your field..."
            className="resize-none"
          />
          <p className="text-gray-500 text-xs mt-1">
            This will be used to generate your portfolio's about section
          </p>
        </div>

        <Button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full py-3"
          loading={isLoading}
        >
          Continue to Field Selection
        </Button>
      </form>
    </Card>
  )
}