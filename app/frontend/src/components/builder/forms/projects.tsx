import React, { useState } from 'react'
import { 
  FolderOpen, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Github, 
  X 
} from 'lucide-react'

import { ImageUploader } from '../lib/ImageUploader'
const ProjectsForm = ({ projects, addProject, updateProject, removeProject }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tech: '',
    link: '',
    github: '',
    images: [],
    thumbnail: ''
  })

  const openModal = (project = null) => {
    if (project) {
      setFormData({
        ...project,
        images: project.images?.map((url, index) => ({ id: index, url, name: `image-${index}` })) || []
      })
      setEditingId(project.id)
    } else {
      setFormData({
        name: '',
        description: '',
        tech: '',
        link: '',
        github: '',
        images: [],
        thumbnail: ''
      })
      setEditingId(null)
    }
    setIsModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const projectData = {
      ...formData,
      images: formData.images.map(img => img.url),
      thumbnail: formData.images[0]?.url || ''
    }
    
    if (editingId) {
      updateProject(editingId, projectData)
    } else {
      addProject(projectData)
    }
    setIsModalOpen(false)
  }

  const nextImage = (projectId) => {
    const project = projects.find(p => p.id === projectId)
    if (!project?.images?.length) return
    
    setCurrentImageIndex(prev => ({
      ...prev,
      [projectId]: ((prev[projectId] || 0) + 1) % project.images.length
    }))
  }

  const prevImage = (projectId) => {
    const project = projects.find(p => p.id === projectId)
    if (!project?.images?.length) return
    
    setCurrentImageIndex(prev => ({
      ...prev,
      [projectId]: ((prev[projectId] || 0) - 1 + project.images.length) % project.images.length
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FolderOpen className="h-5 w-5 mr-2 text-blue-600" />
          Projects
        </h3>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Image Section */}
            {project.images && project.images.length > 0 && (
              <div className="relative h-48 bg-gray-100">
                <img
                  src={project.images[currentImageIndex[project.id] || 0]}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
                
                {project.images.length > 1 && (
                  <>
                    <button
                      onClick={() => prevImage(project.id)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => nextImage(project.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                      {project.images.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === (currentImageIndex[project.id] || 0) 
                              ? 'bg-white' 
                              : 'bg-white bg-opacity-50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                
                <div className="absolute top-2 right-2 flex items-center space-x-2">
                  <button
                    onClick={() => openModal(project)}
                    className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeProject(project.id)}
                    className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Content Section */}
            <div className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h4>
              <p className="text-gray-700 text-sm mb-4 leading-relaxed line-clamp-3">{project.description}</p>

              <div className="mb-4">
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
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  {editingId ? 'Edit Project' : 'Add Project'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Form Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="My Awesome Project"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Describe what this project does, the problem it solves..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Technologies *</label>
                      <input
                        type="text"
                        value={formData.tech}
                        onChange={(e) => setFormData({...formData, tech: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="React, Node.js, TypeScript..."
                        required
                      />
                      <p className="text-gray-500 text-xs mt-1">Separate with commas</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Live Demo URL</label>
                        <input
                          type="url"
                          value={formData.link}
                          onChange={(e) => setFormData({...formData, link: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://myproject.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Repository</label>
                        <input
                          type="url"
                          value={formData.github}
                          onChange={(e) => setFormData({...formData, github: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://github.com/username/project"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Image Upload */}
                  <div>
                    <ImageUploader 
                      images={formData.images}
                      onImagesChange={(images) => setFormData({...formData, images})}
                      maxImages={4}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingId ? 'Update' : 'Add'} Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectsForm