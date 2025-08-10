'use client'

import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { usePortfolioStore } from '@/store/portfolio-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Briefcase, Plus, Trash2, Calendar, Building } from 'lucide-react'

const experienceSchema = z.object({
  experiences: z.array(z.object({
    id: z.string().optional(),
    company: z.string().min(1, 'Company name is required'),
    role: z.string().min(1, 'Job title is required'),
    duration: z.string().min(1, 'Duration is required'),
    description: z.string().optional(),
    current: z.boolean().default(false)
  }))
})

type ExperienceFormData = z.infer<typeof experienceSchema>

export const ExperienceForm: React.FC = () => {
  const { experience, addExperience, updateExperience, removeExperience } = usePortfolioStore()

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      experiences: experience.length > 0 ? experience : [{
        id: '',
        company: '',
        role: '',
        duration: '',
        description: '',
        current: false
      }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experiences'
  })

  const watchedExperiences = watch('experiences')

  // Auto-save when form changes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      watchedExperiences.forEach((exp, index) => {
        if (exp.company && exp.role && exp.duration) {
          if (exp.id) {
            updateExperience(exp.id, exp)
          } else {
            // Add new experience
            const newId = Date.now().toString() + index
            addExperience({ ...exp, id: newId })
          }
        }
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [watchedExperiences, addExperience, updateExperience])

  const addNewExperience = () => {
    append({
      id: '',
      company: '',
      role: '',
      duration: '',
      description: '',
      current: false
    })
  }

  const removeExperienceItem = (index: number) => {
    const exp = watchedExperiences[index]
    if (exp.id) {
      removeExperience(exp.id)
    }
    remove(index)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
          <Briefcase className="h-6 w-6 text-blue-600 mr-3" />
          Work Experience
        </h2>
        <p className="text-gray-600 mt-2">
          Add your professional work experience. Start with your most recent position.
        </p>
      </div>

      {/* Experience Items */}
      <div className="space-y-4">
        {fields.map((field, index) => (
          <Card key={field.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <Building className="h-5 w-5 text-gray-500 mr-2" />
                  Experience {index + 1}
                </CardTitle>
                {fields.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeExperienceItem(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Company and Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <Input
                    {...register(`experiences.${index}.company`)}
                    placeholder="Google, Microsoft, etc."
                    error={errors.experiences?.[index]?.company?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title *
                  </label>
                  <Input
                    {...register(`experiences.${index}.role`)}
                    placeholder="Senior Software Engineer"
                    error={errors.experiences?.[index]?.role?.message}
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration *
                </label>
                <div className="flex items-center space-x-3">
                  <Input
                    {...register(`experiences.${index}.duration`)}
                    placeholder="Jan 2020 - Present"
                    error={errors.experiences?.[index]?.duration?.message}
                    className="flex-1"
                  />
                  <label className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      {...register(`experiences.${index}.current`)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Current Position</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description & Achievements
                </label>
                <Textarea
                  {...register(`experiences.${index}.description`)}
                  placeholder="Describe your key responsibilities, achievements, and impact in this role..."
                  rows={3}
                  error={errors.experiences?.[index]?.description?.message}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Include specific achievements, technologies used, and quantifiable results when possible.
                </p>
              </div>

              {/* Preview */}
              {watchedExperiences[index]?.company && watchedExperiences[index]?.role && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {watchedExperiences[index].role}
                      </h4>
                      <p className="text-blue-600 font-medium">
                        {watchedExperiences[index].company}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {watchedExperiences[index].duration}
                        {watchedExperiences[index].current && (
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            Current
                          </span>
                        )}
                      </p>
                      {watchedExperiences[index].description && (
                        <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                          {watchedExperiences[index].description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Experience Button */}
      <Button
        type="button"
        variant="outline"
        onClick={addNewExperience}
        className="w-full border-dashed border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 py-8"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Another Experience
      </Button>

      {/* Section Summary */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {watchedExperiences.filter(exp => exp.company && exp.role).length}
              </div>
              <div className="text-sm text-gray-600">Positions Added</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {watchedExperiences.filter(exp => exp.current).length}
              </div>
              <div className="text-sm text-gray-600">Current Positions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="border-l-4 border-l-blue-500 bg-blue-50">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tips for Work Experience</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use action verbs: "Led," "Developed," "Increased," "Implemented"</li>
            <li>• Include quantifiable achievements: "Increased sales by 25%"</li>
            <li>• Mention relevant technologies and tools you used</li>
            <li>• Focus on impact and results, not just responsibilities</li>
            <li>• Keep descriptions concise but informative</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}