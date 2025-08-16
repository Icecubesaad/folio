// src/components/builder/forms/skills.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Code2, Plus, Edit, Trash2, Star, TrendingUp, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { usePortfolioStore } from '@/store/portfolio-store'

// Updated to match your actual store interface
interface SkillFormData {
  category: string
  items: string[]
  proficiency?: number
}

interface IndividualSkillData {
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
}

const skillLevels = [
  { value: 'Beginner', label: 'Beginner', color: 'bg-red-100 text-red-800', num: 1 },
  { value: 'Intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800', num: 2 },
  { value: 'Advanced', label: 'Advanced', color: 'bg-blue-100 text-blue-800', num: 3 },
  { value: 'Expert', label: 'Expert', color: 'bg-green-100 text-green-800', num: 4 }
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
  const [currentCategory, setCurrentCategory] = useState<string>('')

  // For individual skill input
  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<SkillFormData>({
    defaultValues: {
      category: 'Programming Languages',
      items: [],
      proficiency: 2
    }
  })

  const watchedCategory = watch('category')

  const openAddModal = () => {
    reset({
      category: 'Programming Languages',
      items: [],
      proficiency: 2
    })
    setCurrentCategory('Programming Languages')
    setEditingId(null)
    setIsModalOpen(true)
  }

  const openEditModal = (id: string) => {
    const skill = skills.find(s => s.id === id)
    if (skill) {
      setValue('category', skill.category)
      setValue('items', skill.items)
      setValue('proficiency', skill.proficiency || 2)
      setCurrentCategory(skill.category)
      setEditingId(id)
      setIsModalOpen(true)
    }
  }

  const addIndividualSkill = () => {
    if (!newSkillName.trim()) return

    const skillLevel = skillLevels.find(level => level.value === newSkillLevel)
    const formattedSkill = `${newSkillName.trim()} (${newSkillLevel})`
    
    // Check if we're editing an existing skill group
    if (editingId) {
      const currentItems = watch('items') || []
      setValue('items', [...currentItems, formattedSkill])
    } else {
      // Check if category already exists
      const existingCategorySkill = skills.find(s => s.category === currentCategory)
      if (existingCategorySkill) {
        // Update existing category
        updateSkill(existingCategorySkill.id, {
          items: [...existingCategorySkill.items, formattedSkill]
        })
      } else {
        // Create new category
        addSkill({
          category: currentCategory,
          items: [formattedSkill],
          proficiency: skillLevel?.num || 2
        })
      }
    }

    setNewSkillName('')
    setNewSkillLevel('Intermediate')
  }

  const removeIndividualSkill = (skillToRemove: string, categoryId?: string) => {
    if (categoryId) {
      const skill = skills.find(s => s.id === categoryId)
      if (skill) {
        const updatedItems = skill.items.filter(item => item !== skillToRemove)
        if (updatedItems.length === 0) {
          removeSkill(categoryId)
        } else {
          updateSkill(categoryId, { items: updatedItems })
        }
      }
    } else if (editingId) {
      const currentItems = watch('items') || []
      setValue('items', currentItems.filter(item => item !== skillToRemove))
    }
  }

  const onSubmit = async (data: SkillFormData) => {
    try {
      if (editingId) {
        await updateSkill(editingId, {
          ...data,
          id: editingId
        })
      } else {
        await addSkill({
          ...data,
          id: Date.now().toString()
        })
      }
      
      setIsModalOpen(false)
      setEditingId(null)
      setCurrentCategory('')
      reset({
        category: 'Programming Languages',
        items: [],
        proficiency: 2
      })
      
      console.log('Skill category saved successfully')
    } catch (error) {
      console.error('Error saving skill category:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await removeSkill(id)
      console.log('Skill category deleted successfully')
    } catch (error) {
      console.error('Error deleting skill category:', error)
    }
  }

  const getLevelFromString = (skillString: string) => {
    const match = skillString.match(/\((Beginner|Intermediate|Advanced|Expert)\)$/)
    return match ? match[1] : 'Intermediate'
  }

  const getSkillName = (skillString: string) => {
    return skillString.replace(/\s*\((Beginner|Intermediate|Advanced|Expert)\)$/, '')
  }

  const getLevelColor = (level: string) => {
    return skillLevels.find(l => l.value === level)?.color || 'bg-gray-100 text-gray-800'
  }

  // Debug log to check if component re-renders when skills change
  useEffect(() => {
    console.log('Skills updated:', skills.length, skills)
  }, [skills])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Skills & Expertise</h3>
          <p className="text-sm text-gray-600">Add your technical skills organized by categories</p>
        </div>
        <Button
          onClick={openAddModal}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </Button>
      </div>

      {/* Skills List */}
      <div className="space-y-6">
        {skills.length === 0 ? (
          <Card className="p-8 text-center bg-gray-50">
            <Code2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Skills Added Yet</h3>
            <p className="text-gray-600 mb-4">
              Add your technical skills organized by categories to showcase your expertise
            </p>
            <Button onClick={openAddModal} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Skill Category
            </Button>
          </Card>
        ) : (
          skills.map((skillGroup) => (
            <Card key={skillGroup.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  {skillGroup.category}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({skillGroup.items.length} skills)
                  </span>
                </h4>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(skillGroup.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(skillGroup.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {skillGroup.items.map((skillItem, index) => {
                  const skillName = getSkillName(skillItem)
                  const skillLevel = getLevelFromString(skillItem)
                  
                  return (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-gray-900 text-sm leading-tight">{skillName}</h5>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeIndividualSkill(skillItem, skillGroup.id)}
                          className="h-5 w-5 p-0 text-red-600 hover:text-red-700 ml-2 flex-shrink-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(skillLevel)}`}>
                          {skillLevel}
                        </span>
                        
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: 4 }).map((_, starIndex) => {
                            const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
                            const currentLevelIndex = levels.indexOf(skillLevel)
                            const isActive = starIndex <= currentLevelIndex
                            
                            return (
                              <Star
                                key={starIndex}
                                className={`h-3 w-3 ${
                                  isActive ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Quick add for existing categories */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Input
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="Add skill to this category..."
                    className="flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        setCurrentCategory(skillGroup.category)
                        addIndividualSkill()
                      }
                    }}
                  />
                  <select
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(e.target.value as any)}
                    className="px-2 py-1 text-sm border border-gray-300 rounded-md"
                  >
                    {skillLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      setCurrentCategory(skillGroup.category)
                      addIndividualSkill()
                    }}
                    disabled={!newSkillName.trim()}
                  >
                    <Plus className="h-3 w-3" />
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
          setEditingId(null)
          setCurrentCategory('')
          reset({
            category: 'Programming Languages',
            items: [],
            proficiency: 2
          })
        }}
        title={editingId ? 'Edit Skill Category' : 'Add Skill Category'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setCurrentCategory(e.target.value)}
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

          {/* Add individual skills within the modal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Skills
            </label>
            <div className="flex items-center space-x-2 mb-3">
              <Input
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Skill name (e.g., JavaScript, React)"
                className="flex-1"
              />
              <select
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value as any)}
                className="px-2 py-1 border border-gray-300 rounded-md"
              >
                {skillLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                onClick={addIndividualSkill}
                disabled={!newSkillName.trim()}
                className="px-3 py-1"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Display current skills in this category */}
            {watch('items') && watch('items').length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {watch('items').map((skillItem, index) => {
                  const skillName = getSkillName(skillItem)
                  const skillLevel = getLevelFromString(skillItem)
                  
                  return (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{skillName}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(skillLevel)}`}>
                          {skillLevel}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeIndividualSkill(skillItem)}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false)
                setEditingId(null)
                setCurrentCategory('')
                reset()
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!watch('items') || watch('items').length === 0}>
              {editingId ? 'Update Category' : 'Add Category'}
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