// src/components/builder/forms/projects.tsx
'use client'

import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  FolderOpen, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Github, 
  Code, 
  Upload,
  Image as ImageIcon,
  X,
  Star,
  Camera
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { usePortfolioStore } from '@/store/portfolio-store'

// Enhanced project schema with images
const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  tech: z.string().min(1, 'Technologies are required'),
  link: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal(''))
})

type ProjectFormData = z.infer<typeof projectSchema>

interface ProjectImage {
  id: string
  file: File
  url: string
  isThumbnail: boolean
}

export const ProjectsForm: React.FC = () => {
  const { projects, addProject, updateProject, removeProject } = usePortfolioStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([])
  const [thumbnailId, setThumbnailId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema)
  })

  const watchedName = watch('name')

  const openAddModal = () => {
    reset()
    setEditingId(null)
    setProjectImages([])
    setThumbnailId(null)
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
      
      // Load existing images (if any)
      if (project.images) {
        setProjectImages(project.images)
        setThumbnailId(project.thumbnailId || null)
      } else {
        setProjectImages([])
        setThumbnailId(null)
      }
      
      setIsModalOpen(true)
    }
  }

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return
    
    const newImages: ProjectImage[] = []
    const maxImages = 4
    const remainingSlots = maxImages - projectImages.length
    
    Array.from(files).slice(0, remainingSlots).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const imageId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
        const url = URL.createObjectURL(file)
        
        newImages.push({
          id: imageId,
          file,
          url,
          isThumbnail: false
        })
      }
    })
    
    setProjectImages(prev => [...prev, ...newImages])
    
    // Set first image as thumbnail if none exists
    if (!thumbnailId && newImages.length > 0) {
      setThumbnailId(newImages[0].id)
    }
  }

  const removeImage = (imageId: string) => {
    setProjectImages(prev => prev.filter(img => img.id !== imageId))
    
    // If removed image was thumbnail, set new thumbnail
    if (thumbnailId === imageId) {
      const remainingImages = projectImages.filter(img => img.id !== imageId)
      setThumbnailId(remainingImages.length > 0 ? remainingImages[0].id : null)
    }
  }

  const setImageAsThumbnail = (imageId: string) => {
    setThumbnailId(imageId)
  }

  const simulateUploadToPublic = async (images: ProjectImage[], projectName: string) => {
    // This would normally upload to your backend
    // For now, we'll simulate the process and return mock URLs
    const username = 'current-user' // This would come from auth context
    const uploadPromises = images.map(async (image, index) => {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Create a mock path
      const fileName = `${projectName.toLowerCase().replace(/\s+/g, '-')}-${index + 1}.${image.file.type.split('/')[1]}`
      const mockPath = `/projects/${username}/${fileName}`
      
      return {
        id: image.id,
        url: mockPath,
        isThumbnail: image.id === thumbnailId,
        fileName: fileName
      }
    })
    
    return Promise.all(uploadPromises)
  }

  const onSubmit = async (data: ProjectFormData) => {
    let uploadedImages: any[] = []
    
    // Upload images if any
    if (projectImages.length > 0 && watchedName) {
      try {
        uploadedImages = await simulateUploadToPublic(projectImages, watchedName)
      } catch (error) {
        console.error('Failed to upload images:', error)
        alert('Failed to upload images. Please try again.')
        return
      }
    }
    
    const projectData = {
      ...data,
      images: uploadedImages,
      thumbnailId: thumbnailId
    }

    if (editingId) {
      updateProject(editingId, projectData)
    } else {
      addProject(projectData)
    }
    
    setIsModalOpen(false)
    reset()
    setProjectImages([])
    setThumbnailId(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      removeProject(id)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    reset()
    setProjectImages([])
    setThumbnailId(null)
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
              <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow">
                {/* Project Thumbnail */}
                {project.images && project.images.length > 0 && (
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={project.images.find(img => img.id === project.thumbnailId)?.url || project.images[0].url}
                      alt={project.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                    <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    {project.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        +{project.images.length - 1} more
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6">
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
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-4 leading-relaxed line-clamp-3">
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
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
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
                        className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 text-sm font-medium"
                      >
                        <Github className="h-4 w-4" />
                        <span>Source Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? 'Edit Project' : 'Add Project'}
        size="xl"
      >
        <div className="max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Project Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
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

            {/* Project Images Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Images (Max 4)
              </label>
              
              {/* Upload Area */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-1">Click to upload images</p>
                <p className="text-gray-500 text-sm">PNG, JPG, WebP up to 5MB each</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  disabled={projectImages.length >= 4}
                />
              </div>

              {/* Image Gallery */}
              {projectImages.length > 0 && (
                <div className="mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {projectImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={image.url}
                            alt="Project preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Image Controls */}
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white hover:bg-opacity-20"
                            onClick={() => setImageAsThumbnail(image.id)}
                            title="Set as thumbnail"
                          >
                            <Star className={`h-4 w-4 ${thumbnailId === image.id ? 'fill-current' : ''}`} />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white hover:bg-opacity-20"
                            onClick={() => removeImage(image.id)}
                            title="Remove image"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Thumbnail Badge */}
                        {thumbnailId === image.id && (
                          <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-current" />
                            <span>Thumbnail</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
                    {projectImages.length}/4 images • Click the star icon to set thumbnail
                  </p>
                </div>
              )}
            </div>

            {/* Project Links */}
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

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingId ? 'Update Project' : 'Add Project'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Tips */}
      {projects.length > 0 && (
        <Card className="p-4 bg-green-50 border-green-200">
          <h4 className="font-medium text-green-900 mb-2">💡 Tips for Compelling Projects</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Focus on projects that demonstrate your key skills</li>
            <li>• Explain the problem your project solves</li>
            <li>• Include both technical and business impact</li>
            <li>• Add screenshots or demo videos when possible</li>
            <li>• Provide working links when possible</li>
            <li>• Quality over quantity - showcase your best work</li>
          </ul>
        </Card>
      )}
    </div>
  )
}