// src/components/builder/forms/skills.tsx
'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Code2, Plus, Edit, Trash2, Star, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { usePortfolioStore } from '@/store/portfolio-store'
import { cn } from '@/lib/utils'

interface SkillFormData {
  category: string
  items: string[]
  proficiency?: number
}

const skillCategories = [
  'Programming Languages',
  'Frontend Technologies',
  'Backend Technologies',
  'Databases',
  'Cloud & DevOps',
  'Design Tools',
  'Frameworks & Libraries',
  'Mobile Development',
  'Data Science & ML',
  'Other Skills'
]

const commonSkills = {
  'Programming Languages': ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'PHP'],
  'Frontend Technologies': ['React', 'Vue.js', 'Angular', 'Next.js', 'Svelte', 'HTML5', 'CSS3', 'Sass'],
  'Backend Technologies': ['Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'FastAPI', 'Rails'],
  'Databases': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Firebase', 'Supabase'],
  'Cloud & DevOps': ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD', 'Git'],
  'Design Tools': ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'Canva'],
}

export const SkillsForm: React.FC = () => {
  const { skills, addSkill, updateSkill, removeSkill } = usePortfolioStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newSkillInput, setNewSkillInput] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<SkillFormData>()

  const watchedCategory = watch('category')

  const openAddModal = () => {
    reset()
    setEditingId(null)
    setSelectedCategory('')
    setIsModalOpen(true)
  }

  const openEditModal = (id: string) => {
    const skill = skills.find(s => s.id === id)
    if (skill) {
      setValue('category', skill.category)
      setValue('items', skill.items)
      setValue('proficiency', skill.proficiency || 3)
      setSelectedCategory(skill.category)
      setEditingId(id)
      setIsModalOpen(true)
    }
  }

  const onSubmit = (data: SkillFormData) => {
    if (data.items.length === 0) return

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

  const addSkillToList = (skillName: string, currentItems: string[]) => {
    if (!skillName.trim() || currentItems.includes(skillName.trim())) return currentItems
    
    const newItems = [...currentItems, skillName.trim()]
    setValue('items', newItems)
    setNewSkillInput('')
    return newItems
  }

  const removeSkillFromList = (skillToRemove: string, currentItems: string[]) => {
    const newItems = currentItems.filter(skill => skill !== skillToRemove)
    setValue('items', newItems)
    return newItems
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Skills & Expertise</h3>
          <p className="text-sm text-gray-600">Organize your skills by category</p>
        </div>
        <Button
          onClick={openAddModal}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Skill Category</span>
        </Button>
      </div>

      {/* Skills List */}
      <div className="space-y-4">
        {skills.length === 0 ? (
          <Card className="p-8 text-center bg-gray-50">
            <Code2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Skills Added Yet</h3>
            <p className="text-gray-600 mb-4">
              Add your technical skills and expertise organized by category
            </p>
            <Button onClick={openAddModal} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Skill Category
            </Button>
          </Card>
        ) : (
          skills.map((skillCategory) => (
            <Card key={skillCategory.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Code2 className="h-5 w-5 text-blue-600" />
                  <h4 className="text-lg font-semibold text-gray-900">{skillCategory.category}</h4>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {skillCategory.items.length} skills
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(skillCategory.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(skillCategory.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Proficiency Level */}
              {skillCategory.proficiency && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-gray-600">Proficiency:</span>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <Star
                          key={level}
                          className={cn(
                            'h-4 w-4',
                            level <= skillCategory.proficiency!
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-2">
                {skillCategory.items.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full border"
                  >
                    {skill}
                  </span>
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
        title={editingId ? 'Edit Skill Category' : 'Add Skill Category'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select a category</option>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proficiency Level
            </label>
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4, 5].map((level) => (
                <label key={level} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    {...register('proficiency')}
                    value={level}
                    defaultChecked={level === 3}
                    className="text-blue-600"
                  />
                  <div className="flex items-center space-x-1">
                    {[...Array(level)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'][level - 1]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills *
            </label>
            
            {/* Add skill input */}
            <div className="flex space-x-2 mb-4">
              <Input
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Type a skill and press Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const currentItems = watch('items') || []
                    addSkillToList(newSkillInput, currentItems)
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => {
                  const currentItems = watch('items') || []
                  addSkillToList(newSkillInput, currentItems)
                }}
                disabled={!newSkillInput.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Common skills suggestions */}
            {selectedCategory && commonSkills[selectedCategory as keyof typeof commonSkills] && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Common {selectedCategory}:</p>
                <div className="flex flex-wrap gap-2">
                  {commonSkills[selectedCategory as keyof typeof commonSkills].map((skill) => {
                    const currentItems = watch('items') || []
                    const isAdded = currentItems.includes(skill)
                    
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => {
                          if (!isAdded) {
                            addSkillToList(skill, currentItems)
                          }
                        }}
                        disabled={isAdded}
                        className={cn(
                          'text-xs px-2 py-1 rounded-full border transition-colors',
                          isAdded
                            ? 'bg-blue-100 text-blue-800 border-blue-200 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300 cursor-pointer'
                        )}
                      >
                        {skill} {isAdded && '✓'}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Selected skills */}
            <div className="flex flex-wrap gap-2">
              {(watch('items') || []).map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full border border-blue-200 flex items-center space-x-2"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const currentItems = watch('items') || []
                      removeSkillFromList(skill, currentItems)
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            
            {(!watch('items') || watch('items')?.length === 0) && (
              <p className="text-gray-500 text-sm mt-2">Add skills to this category</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!watch('category') || !watch('items')?.length}>
              {editingId ? 'Update Skills' : 'Add Skills'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Tips */}
      {skills.length > 0 && (
        <Card className="p-4 bg-purple-50 border-purple-200">
          <h4 className="font-medium text-purple-900 mb-2">💡 Tips for Organizing Skills</h4>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Group related skills into logical categories</li>
            <li>• Be honest about your proficiency levels</li>
            <li>• Include both technical and soft skills</li>
            <li>• Keep the list focused on job-relevant skills</li>
            <li>• Update regularly as you learn new technologies</li>
          </ul>
        </Card>
      )}
    </div>
  )
}