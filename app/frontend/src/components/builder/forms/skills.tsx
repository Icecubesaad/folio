// src/components/builder/forms/skills.tsx
'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Code2, Plus, Edit, Trash2, Star, TrendingUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { usePortfolioStore } from '@/store/portfolio-store'

interface SkillFormData {
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  category: string
}

const skillLevels = [
  { value: 'Beginner', label: 'Beginner', color: 'bg-red-100 text-red-800' },
  { value: 'Intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'Advanced', label: 'Advanced', color: 'bg-blue-100 text-blue-800' },
  { value: 'Expert', label: 'Expert', color: 'bg-green-100 text-green-800' }
]

const skillCategories = [
  'Programming Languages',
  'Frontend Technologies',
  'Backend Technologies',
  'Databases',
  'Cloud & DevOps',
  'Tools & Software',
  'Design & UI/UX',
  'Soft Skills',
  'Other'
]

export const SkillsForm: React.FC = () => {
  const { skills, addSkill, updateSkill, removeSkill } = usePortfolioStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<SkillFormData>({
    defaultValues: {
      level: 'Intermediate',
      category: 'Programming Languages'
    }
  })

  const watchedLevel = watch('level')

  const openAddModal = () => {
    reset({
      name: '',
      level: 'Intermediate',
      category: 'Programming Languages'
    })
    setEditingId(null)
    setIsModalOpen(true)
  }

  const openEditModal = (id: string) => {
    const skill = skills.find(s => s.id === id)
    if (skill) {
      setValue('name', skill.name)
      setValue('level', skill.level as any)
      setValue('category', skill.category || 'Programming Languages')
      setEditingId(id)
      setIsModalOpen(true)
    }
  }

  const onSubmit = (data: SkillFormData) => {
    if (editingId) {
      updateSkill(editingId, data)
    } else {
      addSkill(data)
    }
    setIsModalOpen(false)
    reset()
  }

  const handleDelete = (id: string) => {
    removeSkill(id)
  }

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(skill)
    return acc
  }, {} as Record<string, typeof skills>)

  const getLevelColor = (level: string) => {
    return skillLevels.find(l => l.value === level)?.color || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Skills & Expertise</h3>
          <p className="text-sm text-gray-600">Add your technical skills and areas of expertise</p>
        </div>
        <Button
          onClick={openAddModal}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Skill</span>
        </Button>
      </div>

      {/* Skills List */}
      <div className="space-y-6">
        {Object.keys(skillsByCategory).length === 0 ? (
          <Card className="p-8 text-center bg-gray-50">
            <Code2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Skills Added Yet</h3>
            <p className="text-gray-600 mb-4">
              Add your technical skills to showcase your expertise
            </p>
            <Button onClick={openAddModal} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Skill
            </Button>
          </Card>
        ) : (
          Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <Card key={category} className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                {category}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({categorySkills.length} skills)
                </span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{skill.name}</h5>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(skill.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(skill.id)}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(skill.level)}`}>
                        {skill.level}
                      </span>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 4 }).map((_, index) => {
                          const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
                          const currentLevelIndex = levels.indexOf(skill.level)
                          const isActive = index <= currentLevelIndex
                          
                          return (
                            <Star
                              key={index}
                              className={`h-3 w-3 ${
                                isActive ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))}
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
        title={editingId ? 'Edit Skill' : 'Add Skill'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skill Name *
            </label>
            <Input
              {...register('name', { required: 'Skill name is required' })}
              placeholder="JavaScript, React, Python, etc."
              error={!!errors.name}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proficiency Level *
              </label>
              <select
                {...register('level', { required: 'Level is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {skillLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              {errors.level && (
                <p className="text-red-500 text-xs mt-1">{errors.level.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {skillCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
              )}
            </div>
          </div>

          {/* Level indicator */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Proficiency Level:</span>
              <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(watchedLevel)}`}>
                {watchedLevel}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              {Array.from({ length: 4 }).map((_, index) => {
                const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
                const currentLevelIndex = levels.indexOf(watchedLevel)
                const isActive = index <= currentLevelIndex
                
                return (
                  <Star
                    key={index}
                    className={`h-4 w-4 ${
                      isActive ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                )
              })}
            </div>
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
              {editingId ? 'Update Skill' : 'Add Skill'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Tips */}
      {skills.length > 0 && (
        <Card className="p-4 bg-purple-50 border-purple-200">
          <h4 className="font-medium text-purple-900 mb-2">💡 Tips for Skills Section</h4>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Be honest about your skill levels</li>
            <li>• Focus on skills relevant to your target roles</li>
            <li>• Group similar skills in appropriate categories</li>
            <li>• Include both technical and soft skills</li>
            <li>• Keep your skills list updated with new learning</li>
          </ul>
        </Card>
      )}
    </div>
  )
}