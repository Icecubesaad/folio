// src/components/builder/forms/projects.tsx
'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FolderOpen, Plus, Edit, Trash2, ExternalLink, Github, Code } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { usePortfolioStore } from '@/store/portfolio-store'
import { projectSchema } from '@/lib/validation'

type ProjectFormData = z.infer<typeof projectSchema>

export const ProjectsForm: React.FC = () => {
  const { projects, addProject, updateProject, removeProject } = usePortfolioStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema)
  })

  const openAddModal = () => {
    reset()
    setEditingId(null)
    setIsModalOpen(true)
  }

  const openEditModal = (id: string) => {
    const project = projects.find(p => p.id === id)
    if (project) {
      setValue('name', project.name)
      setValue('description', project.description)
      setValue('tech', project.tech)
      setValue('link', project.link || '')
      setValue('github', project.github || '')
      setEditingId(id)
      setIsModalOpen(true)
    }
  }

  const onSubmit = (data: ProjectFormData) => {
    if (editingId) {
      updateProject(editingId, data)
    } else {
      addProject(data)
    }
    setIsModalOpen(false)
    reset()
  }

  const handleDelete = (id: string) => {
    removeProject(id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Projects</h3>
          <p className="text-sm text-gray-600">Showcase your best work and side projects</p>
        </div>
        <Button
          onClick={openAddModal}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Project</span>
        </Button>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.length === 0 ? (
          <Card className="p-8 text-center bg-gray-50">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Added Yet</h3>
            <p className="text-gray-600 mb-4">
              Add your projects to demonstrate your skills and experience
            </p>
            <Button onClick={openAddModal} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Project
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <FolderOpen className="h-5 w-5 text-blue-600" />
                    <h4 className="text-lg font-semibold text-gray-900">{project.name}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(project.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="mb-4">
                  <div className="flex items-center space-x-1 mb-2">
                    <Code className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">Tech Stack:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.split(',').map((tech, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Live Demo</span>
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 text-sm"
                    >
                      <Github className="h-4 w-4" />
                      <span>Source Code</span>
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          reset()
        }}
        title={editingId ? 'Edit Project' : 'Add Project'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name *
            </label>
            <Input
              {...register('name')}
              placeholder="My Awesome Project"
              error={!!errors.name}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <Textarea
              {...register('description')}
              rows={4}
              placeholder="Describe what this project does, the problem it solves, and your role in building it..."
              className="resize-none"
              error={!!errors.description}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Technologies Used *
            </label>
            <Input
              {...register('tech')}
              placeholder="React, Node.js, TypeScript, PostgreSQL"
              error={!!errors.tech}
            />
            {errors.tech && (
              <p className="text-red-500 text-xs mt-1">{errors.tech.message}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Separate technologies with commas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Live Demo URL
              </label>
              <Input
                {...register('link')}
                type="url"
                placeholder="https://myproject.com"
                error={!!errors.link}
              />
              {errors.link && (
                <p className="text-red-500 text-xs mt-1">{errors.link.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Repository
              </label>
              <Input
                {...register('github')}
                type="url"
                placeholder="https://github.com/username/project"
                error={!!errors.github}
              />
              {errors.github && (
                <p className="text-red-500 text-xs mt-1">{errors.github.message}</p>
              )}
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
              {editingId ? 'Update Project' : 'Add Project'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Tips */}
      {projects.length > 0 && (
        <Card className="p-4 bg-green-50 border-green-200">
          <h4 className="font-medium text-green-900 mb-2">💡 Tips for Compelling Projects</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Focus on projects that demonstrate your key skills</li>
            <li>• Explain the problem your project solves</li>
            <li>• Include both technical and business impact</li>
            <li>• Provide working links when possible</li>
            <li>• Quality over quantity - showcase your best work</li>
          </ul>
        </Card>
      )}
    </div>
  )
}