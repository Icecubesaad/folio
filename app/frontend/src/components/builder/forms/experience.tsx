// src/components/builder/forms/experience.tsx
'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Briefcase, Plus, Edit, Trash2, Calendar, Building } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { usePortfolioStore } from '@/store/portfolio-store'

interface ExperienceFormData {
  company: string
  role: string
  duration: string
  description?: string
  current?: boolean
}

export const ExperienceForm: React.FC = () => {
  const { experience, addExperience, updateExperience, removeExperience } = usePortfolioStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<ExperienceFormData>()

  const openAddModal = () => {
    reset()
    setEditingId(null)
    setIsModalOpen(true)
  }

  const openEditModal = (id: string) => {
    const exp = experience.find(e => e.id === id)
    if (exp) {
      setValue('company', exp.company)
      setValue('role', exp.role)
      setValue('duration', exp.duration)
      setValue('description', exp.description || '')
      setValue('current', exp.current || false)
      setEditingId(id)
      setIsModalOpen(true)
    }
  }

  const onSubmit = (data: ExperienceFormData) => {
    if (editingId) {
      updateExperience(editingId, data)
    } else {
      addExperience(data)
    }
    setIsModalOpen(false)
    reset()
  }

  const handleDelete = (id: string) => {
    removeExperience(id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
          <p className="text-sm text-gray-600">Add your professional work experience</p>
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
                      <h4 className="text-lg font-semibold text-gray-900">{exp.role}</h4>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{exp.duration}</span>
                    {exp.current && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        Current Position
                      </span>
                    )}
                  </div>
                  
                  {exp.description && (
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  )}
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
                {...register('role', { required: 'Job title is required' })}
                placeholder="Senior Software Engineer"
                error={!!errors.role}
              />
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <Input
                {...register('company', { required: 'Company is required' })}
                placeholder="Google, Microsoft, etc."
                error={!!errors.company}
              />
              {errors.company && (
                <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration *
            </label>
            <div className="flex items-center space-x-3">
              <Input
                {...register('duration', { required: 'Duration is required' })}
                placeholder="Jan 2020 - Present"
                error={!!errors.duration}
                className="flex-1"
              />
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  {...register('current')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Current Position</span>
              </label>
            </div>
            {errors.duration && (
              <p className="text-red-500 text-xs mt-1">{errors.duration.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description & Achievements
            </label>
            <Textarea
              {...register('description')}
              placeholder="Describe your key responsibilities, achievements, and impact in this role..."
              rows={4}
              className="resize-none"
            />
            <p className="text-gray-500 text-xs mt-1">
              Include specific achievements, technologies used, and quantifiable results when possible.
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
        <Card className="p-4 bg-green-50 border-green-200">
          <h4 className="font-medium text-green-900 mb-2">💡 Tips for Experience Entries</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Use action verbs: "Led," "Developed," "Increased," "Implemented"</li>
            <li>• Include quantifiable achievements: "Increased sales by 25%"</li>
            <li>• Mention relevant technologies and tools you used</li>
            <li>• Focus on impact and results, not just responsibilities</li>
          </ul>
        </Card>
      )}
    </div>
  )
}