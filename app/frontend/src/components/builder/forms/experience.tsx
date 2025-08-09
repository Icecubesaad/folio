// src/components/builder/forms/experience.tsx
'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Briefcase, Plus, Edit, Trash2, Calendar, Building, MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { usePortfolioStore } from '@/store/portfolio-store'
import { experienceSchema } from '@/lib/validation'

type ExperienceFormData = z.infer<typeof experienceSchema>

export const ExperienceForm: React.FC = () => {
  const { experience, addExperience, updateExperience, removeExperience } = usePortfolioStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema)
  })

  const isCurrentRole = watch('current')

  const openAddModal = () => {
    reset()
    setEditingId(null)
    setIsModalOpen(true)
  }

  const openEditModal = (id: string) => {
    const exp = experience.find(e => e.id === id)
    if (exp) {
      setValue('company', exp.company)
      setValue('position', exp.position)
      setValue('location', exp.location || '')
      setValue('startDate', exp.startDate)
      setValue('endDate', exp.endDate || '')
      setValue('current', exp.current || false)
      setValue('description', exp.description)
      setEditingId(id)
      setIsModalOpen(true)
    }
  }

  const onSubmit = (data: ExperienceFormData) => {
    const processedData = {
      ...data,
      endDate: data.current ? undefined : data.endDate
    }

    if (editingId) {
      updateExperience(editingId, processedData)
    } else {
      addExperience(processedData)
    }
    setIsModalOpen(false)
    reset()
  }

  const handleDelete = (id: string) => {
    removeExperience(id)
  }

  const formatDateRange = (startDate: string, endDate?: string, current?: boolean) => {
    const start = new Date(startDate).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    })
    
    if (current) {
      return `${start} - Present`
    }
    
    if (endDate) {
      const end = new Date(endDate).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      })
      return `${start} - ${end}`
    }
    
    return start
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
          <p className="text-sm text-gray-600">Add your professional work history</p>
        </div>
        <Button
          onClick={openAddModal}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Experience</span>
        </Button>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {experience.length === 0 ? (
          <Card className="p-8 text-center bg-gray-50">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Experience Added Yet</h3>
            <p className="text-gray-600 mb-4">
              Add your work experience to showcase your professional background
            </p>
            <Button onClick={openAddModal} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Experience
            </Button>
          </Card>
        ) : (
          experience.map((exp) => (
            <Card key={exp.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Building className="h-5 w-5 text-gray-400" />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{exp.position}</h4>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                    </div>
                    {exp.current && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        Current
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
                    </div>
                    {exp.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{exp.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    {exp.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="text-gray-700 text-sm leading-relaxed mb-2">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(exp.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(exp.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          reset()
        }}
        title={editingId ? 'Edit Experience' : 'Add Experience'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <Input
                {...register('position')}
                placeholder="Software Engineer"
                error={!!errors.position}
              />
              {errors.position && (
                <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <Input
                {...register('company')}
                placeholder="Tech Company Inc."
                error={!!errors.company}
              />
              {errors.company && (
                <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <Input
              {...register('location')}
              placeholder="San Francisco, CA or Remote"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <Input
                {...register('startDate')}
                type="month"
                error={!!errors.startDate}
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    {...register('current')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Current position</span>
                </label>
              </div>
              <Input
                {...register('endDate')}
                type="month"
                disabled={isCurrentRole}
                className={isCurrentRole ? 'bg-gray-100' : ''}
                error={!!errors.endDate}
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs mt-1">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <Textarea
              {...register('description')}
              rows={5}
              placeholder="Describe your role, responsibilities, and key achievements. Use bullet points or paragraphs to highlight your impact and accomplishments."
              className="resize-none"
              error={!!errors.description}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Focus on achievements and quantifiable results where possible
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingId ? 'Update Experience' : 'Add Experience'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Tips */}
      {experience.length > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">💡 Tips for Strong Experience Entries</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Start with action verbs (Led, Developed, Implemented, Managed)</li>
            <li>• Include quantifiable achievements (increased sales by 25%)</li>
            <li>• Focus on impact and results, not just responsibilities</li>
            <li>• Use keywords relevant to your target roles</li>
            <li>• Keep descriptions concise but informative</li>
          </ul>
        </Card>
      )}
    </div>
  )
}