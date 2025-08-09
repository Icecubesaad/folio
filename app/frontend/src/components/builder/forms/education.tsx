// src/components/builder/forms/education.tsx
'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { GraduationCap, Plus, Edit, Trash2, Calendar, School } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { usePortfolioStore } from '@/store/portfolio-store'

interface EducationFormData {
  school: string
  degree: string
  year: string
  details?: string
}

export const EducationForm: React.FC = () => {
  const { education, addEducation, updateEducation, removeEducation } = usePortfolioStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<EducationFormData>()

  const openAddModal = () => {
    reset()
    setEditingId(null)
    setIsModalOpen(true)
  }

  const openEditModal = (id: string) => {
    const edu = education.find(e => e.id === id)
    if (edu) {
      setValue('school', edu.school)
      setValue('degree', edu.degree)
      setValue('year', edu.year)
      setValue('details', edu.details || '')
      setEditingId(id)
      setIsModalOpen(true)
    }
  }

  const onSubmit = (data: EducationFormData) => {
    if (editingId) {
      updateEducation(editingId, data)
    } else {
      addEducation(data)
    }
    setIsModalOpen(false)
    reset()
  }

  const handleDelete = (id: string) => {
    removeEducation(id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Education</h3>
          <p className="text-sm text-gray-600">Add your educational background and qualifications</p>
        </div>
        <Button
          onClick={openAddModal}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Education</span>
        </Button>
      </div>

      {/* Education List */}
      <div className="space-y-4">
        {education.length === 0 ? (
          <Card className="p-8 text-center bg-gray-50">
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Education Added Yet</h3>
            <p className="text-gray-600 mb-4">
              Add your educational background, degrees, and certifications
            </p>
            <Button onClick={openAddModal} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your Education
            </Button>
          </Card>
        ) : (
          education.map((edu) => (
            <Card key={edu.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <School className="h-5 w-5 text-gray-400" />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{edu.degree}</h4>
                      <p className="text-blue-600 font-medium">{edu.school}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{edu.year}</span>
                  </div>
                  
                  {edu.details && (
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {edu.details}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(edu.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(edu.id)}
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
        title={editingId ? 'Edit Education' : 'Add Education'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Degree/Qualification *
              </label>
              <Input
                {...register('degree', { required: 'Degree is required' })}
                placeholder="Bachelor of Science in Computer Science"
                error={!!errors.degree}
              />
              {errors.degree && (
                <p className="text-red-500 text-xs mt-1">{errors.degree.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Institution *
              </label>
              <Input
                {...register('school', { required: 'Institution is required' })}
                placeholder="University of California, Berkeley"
                error={!!errors.school}
              />
              {errors.school && (
                <p className="text-red-500 text-xs mt-1">{errors.school.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year of Graduation *
            </label>
            <Input
              {...register('year', { required: 'Year is required' })}
              placeholder="2023"
              error={!!errors.year}
            />
            {errors.year && (
              <p className="text-red-500 text-xs mt-1">{errors.year.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Details
            </label>
            <Textarea
              {...register('details')}
              rows={3}
              placeholder="GPA, honors, relevant coursework, thesis topic, etc."
              className="resize-none"
            />
            <p className="text-gray-500 text-xs mt-1">
              Include any relevant details like GPA, honors, or coursework
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
              {editingId ? 'Update Education' : 'Add Education'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Tips */}
      {education.length > 0 && (
        <Card className="p-4 bg-indigo-50 border-indigo-200">
          <h4 className="font-medium text-indigo-900 mb-2">💡 Tips for Education Entries</h4>
          <ul className="text-sm text-indigo-800 space-y-1">
            <li>• List education in reverse chronological order</li>
            <li>• Include relevant certifications and online courses</li>
            <li>• Mention honors, awards, or high GPA if relevant</li>
            <li>• For recent graduates, include relevant coursework</li>
          </ul>
        </Card>
      )}
    </div>
  )
}