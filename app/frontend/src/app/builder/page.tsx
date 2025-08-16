'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  FolderOpen, 
  Mail, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Save, 
  Download, 
  Eye, 
  ChevronRight,
  Settings,
  Palette,
  Camera,
  MapPin,
  Phone,
  Globe,
  Github,
  Linkedin,
  Twitter,
  X,
  ChevronLeft,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Building,
  School,
  Star,
  TrendingUp,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Loader
} from 'lucide-react'

// Enhanced Portfolio Store with better data structure
const usePortfolioStore = () => {
  const [data, setData] = useState({
    personalInfo: {
      fullName: "John Doe",
      professionalTitle: "Full-Stack Developer",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      website: "johndoe.dev",
      bio: "Passionate full-stack developer with 5+ years of experience creating scalable web applications. I love turning complex problems into simple, beautiful solutions that users enjoy.",
      profileImage: "/api/placeholder/200/200"
    },
    experience: [
      {
        id: "1",
        position: "Senior Full-Stack Developer",
        company: "TechCorp Solutions",
        location: "San Francisco, CA",
        startDate: "2022-01",
        endDate: null,
        current: true,
        description: "Led development of microservices architecture serving 1M+ users. Built React frontends and Node.js backends, improved performance by 40%."
      },
      {
        id: "2",
        position: "Frontend Developer",
        company: "StartupXYZ",
        location: "Remote",
        startDate: "2020-06",
        endDate: "2021-12",
        current: false,
        description: "Developed responsive web applications using React and TypeScript. Collaborated with designers to implement pixel-perfect UIs."
      }
    ],
    skills: [
      { id: "1", name: "JavaScript", level: "Expert", category: "Frontend" },
      { id: "2", name: "React", level: "Expert", category: "Frontend" },
      { id: "3", name: "TypeScript", level: "Advanced", category: "Frontend" },
      { id: "4", name: "Node.js", level: "Advanced", category: "Backend" },
      { id: "5", name: "Python", level: "Intermediate", category: "Backend" },
      { id: "6", name: "PostgreSQL", level: "Advanced", category: "Database" },
      { id: "7", name: "AWS", level: "Intermediate", category: "Cloud" },
      { id: "8", name: "Docker", level: "Intermediate", category: "DevOps" }
    ],
    projects: [
      {
        id: "1",
        name: "E-Commerce Platform",
        description: "Full-stack e-commerce solution with React frontend, Node.js backend, and Stripe integration. Features include user authentication, product management, and order processing.",
        tech: "React, Node.js, MongoDB, Stripe, AWS",
        link: "https://ecommerce-demo.com",
        github: "https://github.com/johndoe/ecommerce-platform",
        featured: true,
        images: [
          "/api/placeholder/400/300",
          "/api/placeholder/400/300",
          "/api/placeholder/400/300"
        ],
        thumbnail: "/api/placeholder/400/300"
      },
      {
        id: "2",
        name: "Task Management App",
        description: "Collaborative task management application with real-time updates, file sharing, and team collaboration features.",
        tech: "Vue.js, Express, Socket.io, PostgreSQL",
        link: "https://taskapp-demo.com",
        github: "https://github.com/johndoe/task-manager",
        images: [
          "/api/placeholder/400/300",
          "/api/placeholder/400/300"
        ],
        thumbnail: "/api/placeholder/400/300"
      },
      {
        id: "3",
        name: "Weather Analytics Dashboard",
        description: "Data visualization dashboard showing weather patterns and analytics using D3.js and external APIs.",
        tech: "React, D3.js, Python, FastAPI",
        link: "https://weather-dashboard.com",
        github: "https://github.com/johndoe/weather-dashboard",
        images: ["/api/placeholder/400/300"],
        thumbnail: "/api/placeholder/400/300"
      }
    ],
    education: [
      {
        id: "1",
        degree: "Bachelor of Science in Computer Science",
        school: "University of California, Berkeley",
        year: "2019",
        details: "Graduated Magna Cum Laude. Relevant coursework: Data Structures, Algorithms, Software Engineering."
      }
    ]
  })
  
  const [hasChanges, setHasChanges] = useState(false)

  const updatePersonalInfo = (info) => {
    setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, ...info } }))
    setHasChanges(true)
  }

  const addExperience = (experience) => {
    const newExp = { ...experience, id: Date.now().toString() }
    setData(prev => ({ ...prev, experience: [...prev.experience, newExp] }))
    setHasChanges(true)
  }

  const updateExperience = (id, updates) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, ...updates } : exp)
    }))
    setHasChanges(true)
  }

  const removeExperience = (id) => {
    setData(prev => ({ ...prev, experience: prev.experience.filter(exp => exp.id !== id) }))
    setHasChanges(true)
  }

  const addSkill = (skill) => {
    const newSkill = { ...skill, id: Date.now().toString() }
    setData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }))
    setHasChanges(true)
  }

  const updateSkill = (id, updates) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.map(skill => skill.id === id ? { ...skill, ...updates } : skill)
    }))
    setHasChanges(true)
  }

  const removeSkill = (id) => {
    setData(prev => ({ ...prev, skills: prev.skills.filter(skill => skill.id !== id) }))
    setHasChanges(true)
  }

  const addProject = (project) => {
    const newProject = { ...project, id: Date.now().toString() }
    setData(prev => ({ ...prev, projects: [...prev.projects, newProject] }))
    setHasChanges(true)
  }

  const updateProject = (id, updates) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(project => project.id === id ? { ...project, ...updates } : project)
    }))
    setHasChanges(true)
  }

  const removeProject = (id) => {
    setData(prev => ({ ...prev, projects: prev.projects.filter(project => project.id !== id) }))
    setHasChanges(true)
  }

  const addEducation = (education) => {
    const newEdu = { ...education, id: Date.now().toString() }
    setData(prev => ({ ...prev, education: [...prev.education, newEdu] }))
    setHasChanges(true)
  }

  const updateEducation = (id, updates) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, ...updates } : edu)
    }))
    setHasChanges(true)
  }

  const removeEducation = (id) => {
    setData(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id) }))
    setHasChanges(true)
  }

  const clearAll = () => {
    setData({
      personalInfo: { fullName: "", professionalTitle: "", email: "", phone: "", location: "", website: "", bio: "" },
      experience: [],
      skills: [],
      projects: [],
      education: []
    })
    setHasChanges(true)
  }

  const saveChanges = () => {
    setHasChanges(false)
    // Here you would typically save to backend
  }

  return {
    ...data,
    hasChanges,
    updatePersonalInfo,
    addExperience,
    updateExperience,
    removeExperience,
    addSkill,
    updateSkill,
    removeSkill,
    addProject,
    updateProject,
    removeProject,
    addEducation,
    updateEducation,
    removeEducation,
    clearAll,
    saveChanges
  }
}

// Personal Info Form Component
const PersonalInfoForm = ({ personalInfo, updatePersonalInfo }) => {
  const [formData, setFormData] = useState(personalInfo)

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    updatePersonalInfo({ [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-blue-600" />
          Personal Information
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title *</label>
              <input
                type="text"
                value={formData.professionalTitle}
                onChange={(e) => handleChange('professionalTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Full-Stack Developer"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="San Francisco, CA"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Experience Form Component  
const ExperienceForm = ({ experience, addExperience, updateExperience, removeExperience }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    position: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  })

  const openModal = (exp = null) => {
    if (exp) {
      setFormData(exp)
      setEditingId(exp.id)
    } else {
      setFormData({
        position: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      })
      setEditingId(null)
    }
    setIsModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      updateExperience(editingId, formData)
    } else {
      addExperience(formData)
    }
    setIsModalOpen(false)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString + '-01').toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
          Work Experience
        </h3>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Experience</span>
        </button>
      </div>

      {/* Experience Cards */}
      <div className="space-y-4">
        {experience.map((exp) => (
          <div key={exp.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Building className="h-5 w-5 text-gray-400" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{exp.position}</h4>
                    <p className="text-blue-600 font-medium">{exp.company}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{exp.location}</span>
                  </div>
                  {exp.current && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Current</span>
                  )}
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => openModal(exp)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  {editingId ? 'Edit Experience' : 'Add Experience'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                    <input
                      type="month"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="month"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={formData.current}
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="current"
                    checked={formData.current}
                    onChange={(e) => setFormData({...formData, current: e.target.checked, endDate: e.target.checked ? '' : formData.endDate})}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <label htmlFor="current" className="ml-2 text-sm text-gray-700">I currently work here</label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
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
                    {editingId ? 'Update' : 'Add'} Experience
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

// Skills Form Component
const SkillsForm = ({ skills, addSkill, updateSkill, removeSkill }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    level: 'Intermediate',
    category: 'Frontend'
  })

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
  const categories = ['Frontend', 'Backend', 'Database', 'Cloud', 'DevOps', 'Mobile', 'Other']

  const openModal = (skill = null) => {
    if (skill) {
      setFormData(skill)
      setEditingId(skill.id)
    } else {
      setFormData({
        name: '',
        level: 'Intermediate',
        category: 'Frontend'
      })
      setEditingId(null)
    }
    setIsModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      updateSkill(editingId, formData)
    } else {
      addSkill(formData)
    }
    setIsModalOpen(false)
  }

  const getLevelColor = (level) => {
    const colors = {
      'Beginner': 'bg-red-100 text-red-800',
      'Intermediate': 'bg-yellow-100 text-yellow-800',
      'Advanced': 'bg-blue-100 text-blue-800',
      'Expert': 'bg-green-100 text-green-800'
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other'
    if (!acc[category]) acc[category] = []
    acc[category].push(skill)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Code2 className="h-5 w-5 mr-2 text-blue-600" />
          Skills & Expertise
        </h3>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Skills by Category */}
      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category} className="bg-white p-6 rounded-xl border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              {category}
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({categorySkills.length} skills)
              </span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorySkills.map((skill) => (
                <div key={skill.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{skill.name}</h5>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => openModal(skill)}
                        className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeSkill(skill.id)}
                        className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
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
                            className={`h-3 w-3 ${isActive ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  {editingId ? 'Edit Skill' : 'Add Skill'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="JavaScript, React, Python..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level *</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({...formData, level: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {skillLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
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
                    {editingId ? 'Update' : 'Add'} Skill
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

// Image Upload Component
const ImageUploader = ({ images, onImagesChange, maxImages = 4 }) => {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    
    // Simulate file upload - In real app, upload to server
    const newImages = await Promise.all(
      files.slice(0, maxImages - images.length).map(async (file) => {
        return new Promise(resolve => {
          const reader = new FileReader()
          reader.onload = (e) => {
            resolve({
              id: Date.now() + Math.random(),
              url: e.target.result,
              name: file.name
            })
          }
          reader.readAsDataURL(file)
        })
      })
    )

    onImagesChange([...images, ...newImages])
    setUploading(false)
  }

  const removeImage = (imageId) => {
    onImagesChange(images.filter(img => img.id !== imageId))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Project Images ({images.length}/{maxImages})
        </label>
        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50"
          >
            {uploading ? <Loader className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            <span>{uploading ? 'Uploading...' : 'Add Images'}</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {images.map((image, index) => (
            <div key={image.id} className="relative group">
              <img
                src={image.url}
                alt={`Project image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No images uploaded yet</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Click to upload images
          </button>
        </div>
      )}
    </div>
  )
}

// Projects Form Component
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

// Education Form Component
const EducationForm = ({ education, addEducation, updateEducation, removeEducation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    degree: '',
    school: '',
    year: '',
    details: ''
  })

  const openModal = (edu = null) => {
    if (edu) {
      setFormData(edu)
      setEditingId(edu.id)
    } else {
      setFormData({
        degree: '',
        school: '',
        year: '',
        details: ''
      })
      setEditingId(null)
    }
    setIsModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      updateEducation(editingId, formData)
    } else {
      addEducation(formData)
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
          Education
        </h3>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Education</span>
        </button>
      </div>

      {/* Education Cards */}
      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
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
                  <p className="text-gray-700 text-sm leading-relaxed">{edu.details}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => openModal(edu)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  {editingId ? 'Edit Education' : 'Add Education'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Degree *</label>
                    <input
                      type="text"
                      value={formData.degree}
                      onChange={(e) => setFormData({...formData, degree: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Bachelor of Science in Computer Science"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Institution *</label>
                    <input
                      type="text"
                      value={formData.school}
                      onChange={(e) => setFormData({...formData, school: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="University of California, Berkeley"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year of Graduation *</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2023"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Details</label>
                  <textarea
                    value={formData.details}
                    onChange={(e) => setFormData({...formData, details: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="GPA, honors, relevant coursework..."
                  />
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
                    {editingId ? 'Update' : 'Add'} Education
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

// Contact Form Component
const ContactForm = ({ personalInfo, updatePersonalInfo }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Mail className="h-5 w-5 mr-2 text-blue-600" />
          Contact Information
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={personalInfo.email || ''}
              onChange={(e) => updatePersonalInfo({ email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={personalInfo.phone || ''}
              onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
            <input
              type="url"
              value={personalInfo.website || ''}
              onChange={(e) => updatePersonalInfo({ website: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const EnhancedPortfolioBuilder = () => {
  const portfolioData = usePortfolioStore()
  
  // Sidebar states
  const [iconSidebarVisible, setIconSidebarVisible] = useState(true)
  const [formSidebarVisible, setFormSidebarVisible] = useState(false)
  const [activeForm, setActiveForm] = useState('personal')
  const [formSidebarWidth, setFormSidebarWidth] = useState(420)
  
  // Preview states
  const [previewMode, setPreviewMode] = useState('desktop')
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Resize functionality
  const [isResizing, setIsResizing] = useState(false)
  const resizeRef = useRef(null)
  const containerRef = useRef(null)
  
  const MIN_FORM_WIDTH = 380
  const MAX_FORM_WIDTH = 600
  const ICON_SIDEBAR_WIDTH = 80

  // Handle resize
  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    setIsResizing(true)
    
    const startX = e.clientX
    const startWidth = formSidebarWidth
    
    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX
      const newWidth = Math.min(
        Math.max(startWidth + deltaX, MIN_FORM_WIDTH),
        MAX_FORM_WIDTH
      )
      setFormSidebarWidth(newWidth)
    }
    
    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [formSidebarWidth])

  // Form sections
  const formSections = [
    { id: 'personal', title: 'Personal Info', icon: User, color: 'bg-blue-500' },
    { id: 'experience', title: 'Experience', icon: Briefcase, color: 'bg-green-500' },
    { id: 'education', title: 'Education', icon: GraduationCap, color: 'bg-purple-500' },
    { id: 'skills', title: 'Skills', icon: Code2, color: 'bg-orange-500' },
    { id: 'projects', title: 'Projects', icon: FolderOpen, color: 'bg-red-500' },
    { id: 'contact', title: 'Contact', icon: Mail, color: 'bg-cyan-500' }
  ]

  // Handle form section click
  const handleFormSectionClick = (sectionId) => {
    if (activeForm === sectionId && formSidebarVisible) {
      setFormSidebarVisible(false)
    } else {
      setActiveForm(sectionId)
      setFormSidebarVisible(true)
    }
  }

  // Generate enhanced HTML with project images and carousel
  const generateHTML = () => {
    const { personalInfo, experience, skills, projects, education } = portfolioData
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName} - Portfolio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: #ffffff;
            min-height: 100vh;
            box-shadow: 0 0 50px rgba(0,0,0,0.1);
        }
        
        /* Header Section */
        .header {
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
            color: white;
            padding: 4rem 2rem;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><polygon fill="%23ffffff08" points="0,0 1000,300 1000,1000 0,700"/></svg>');
            background-size: cover;
        }
        
        .header-content {
            position: relative;
            z-index: 2;
        }
        
        .profile-image {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 6px solid rgba(255,255,255,0.2);
            margin: 0 auto 2rem;
            background: linear-gradient(45deg, #667eea, #764ba2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
            color: white;
        }
        
        .header h1 {
            font-size: 3.5rem;
            font-weight: 800;
            margin-bottom: 1rem;
            background: linear-gradient(45deg, #ffffff, #e0e7ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .header .title {
            font-size: 1.5rem;
            opacity: 0.9;
            margin-bottom: 1rem;
            font-weight: 300;
        }
        
        .header .bio {
            font-size: 1.1rem;
            opacity: 0.8;
            max-width: 600px;
            margin: 0 auto 2rem;
            line-height: 1.8;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            gap: 2rem;
            flex-wrap: wrap;
            margin-top: 2rem;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.95rem;
            opacity: 0.9;
        }
        
        /* Main Content */
        .main-content {
            padding: 4rem 2rem;
        }
        
        .section {
            margin-bottom: 4rem;
        }
        
        .section-title {
            font-size: 2.2rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 2rem;
            position: relative;
            padding-bottom: 0.5rem;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 60px;
            height: 4px;
            background: linear-gradient(45deg, #3b82f6, #8b5cf6);
            border-radius: 2px;
        }
        
        /* Experience Cards */
        .experience-grid {
            display: grid;
            gap: 2rem;
        }
        
        .experience-item {
            background: #ffffff;
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            border: 1px solid #e5e7eb;
            position: relative;
            transition: all 0.3s ease;
        }
        
        .experience-item:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.1);
        }
        
        .experience-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(45deg, #3b82f6, #8b5cf6);
            border-radius: 2px;
        }
        
        .experience-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 0.5rem;
        }
        
        .experience-company {
            color: #3b82f6;
            font-weight: 500;
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
        }
        
        .experience-meta {
            color: #6b7280;
            font-size: 0.9rem;
            margin-bottom: 1rem;
            display: flex;
            gap: 1rem;
            align-items: center;
        }
        
        .experience-description {
            color: #4b5563;
            line-height: 1.7;
        }
        
        /* Skills Section */
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .skill-category {
            background: #f8fafc;
            padding: 2rem;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
        }
        
        .skill-category h3 {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            color: #1e293b;
        }
        
        .skill-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 0;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .skill-item:last-child { border-bottom: none; }
        
        .skill-level {
            font-size: 0.75rem;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-weight: 500;
        }
        
        .level-expert { background: #dcfce7; color: #166534; }
        .level-advanced { background: #dbeafe; color: #1e40af; }
        .level-intermediate { background: #fef3c7; color: #92400e; }
        .level-beginner { background: #fee2e2; color: #dc2626; }
        
        /* Projects Grid with Enhanced Image Display */
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 2rem;
        }
        
        .project-card {
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            border: 1px solid #e5e7eb;
            transition: all 0.3s ease;
        }
        
        .project-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.1);
        }
        
        /* Project Image Carousel */
        .project-image-container {
            position: relative;
            height: 250px;
            overflow: hidden;
            background: #f8fafc;
        }
        
        .project-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: opacity 0.3s ease;
        }
        
        .carousel-button {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0,0,0,0.7);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transition: all 0.2s ease;
            opacity: 0;
            z-index: 2;
        }
        
        .project-image-container:hover .carousel-button {
            opacity: 1;
        }
        
        .carousel-button:hover {
            background: rgba(0,0,0,0.9);
            transform: translateY(-50%) scale(1.1);
        }
        
        .carousel-prev {
            left: 10px;
        }
        
        .carousel-next {
            right: 10px;
        }
        
        .carousel-dots {
            position: absolute;
            bottom: 15px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 8px;
            z-index: 2;
        }
        
        .carousel-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(255,255,255,0.5);
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .carousel-dot.active {
            background: white;
            transform: scale(1.2);
        }
        
        .project-content {
            padding: 2rem;
        }
        
        .project-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 1rem;
        }
        
        .project-description {
            color: #4b5563;
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }
        
        .tech-stack {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
        }
        
        .tech-tag {
            background: #e0f2fe;
            color: #0369a1;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 500;
        }
        
        .project-links {
            display: flex;
            gap: 1rem;
        }
        
        .project-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: #3b82f6;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
            padding: 0.5rem 1rem;
            border: 1px solid #3b82f6;
            border-radius: 8px;
            transition: all 0.2s;
        }
        
        .project-link:hover {
            background: #3b82f6;
            color: white;
        }
        
        /* Education */
        .education-item {
            background: #ffffff;
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            border: 1px solid #e5e7eb;
        }
        
        .education-degree {
            font-size: 1.2rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 0.5rem;
        }
        
        .education-school {
            color: #3b82f6;
            font-weight: 500;
            margin-bottom: 0.5rem;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .header {
                padding: 3rem 1rem;
            }
            
            .header h1 {
                font-size: 2.5rem;
            }
            
            .main-content {
                padding: 2rem 1rem;
            }
            
            .contact-info {
                flex-direction: column;
                gap: 1rem;
            }
            
            .skills-grid {
                grid-template-columns: 1fr;
            }
            
            .projects-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <div class="header-content">
                <div class="profile-image">
                    ${personalInfo.fullName.charAt(0)}
                </div>
                <h1>${personalInfo.fullName}</h1>
                <div class="title">${personalInfo.professionalTitle}</div>
                <div class="bio">${personalInfo.bio}</div>
                <div class="contact-info">
                    <div class="contact-item">📧 ${personalInfo.email}</div>
                    <div class="contact-item">📱 ${personalInfo.phone}</div>
                    <div class="contact-item">📍 ${personalInfo.location}</div>
                    <div class="contact-item">🌐 ${personalInfo.website}</div>
                </div>
            </div>
        </header>

        <main class="main-content">
            <section class="section">
                <h2 class="section-title">Experience</h2>
                <div class="experience-grid">
                    ${experience.map(exp => `
                        <div class="experience-item">
                            <div class="experience-title">${exp.position}</div>
                            <div class="experience-company">${exp.company}</div>
                            <div class="experience-meta">
                                <span>${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                                <span>${exp.location}</span>
                            </div>
                            <div class="experience-description">${exp.description}</div>
                        </div>
                    `).join('')}
                </div>
            </section>

            <section class="section">
                <h2 class="section-title">Skills & Expertise</h2>
                <div class="skills-grid">
                    ${Object.entries(groupSkillsByCategory(skills)).map(([category, categorySkills]) => `
                        <div class="skill-category">
                            <h3>${category}</h3>
                            ${categorySkills.map(skill => `
                                <div class="skill-item">
                                    <span>${skill.name}</span>
                                    <span class="skill-level level-${skill.level.toLowerCase()}">${skill.level}</span>
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
            </section>

            <section class="section">
                <h2 class="section-title">Featured Projects</h2>
                <div class="projects-grid">
                    ${projects.map((project, index) => `
                        <div class="project-card">
                            ${project.images && project.images.length > 0 ? `
                                <div class="project-image-container">
                                    <img src="${project.images[0]}" alt="${project.name}" class="project-image" id="project-img-${index}">
                                    
                                    ${project.images.length > 1 ? `
                                        <button class="carousel-button carousel-prev" onclick="prevImage(${index})" aria-label="Previous image">❮</button>
                                        <button class="carousel-button carousel-next" onclick="nextImage(${index})" aria-label="Next image">❯</button>
                                        
                                        <div class="carousel-dots">
                                            ${project.images.map((_, dotIndex) => `
                                                <div class="carousel-dot ${dotIndex === 0 ? 'active' : ''}" onclick="showImage(${index}, ${dotIndex})"></div>
                                            `).join('')}
                                        </div>
                                    ` : ''}
                                </div>
                            ` : ''}
                            
                            <div class="project-content">
                                <div class="project-title">${project.name}</div>
                                <div class="project-description">${project.description}</div>
                                <div class="tech-stack">
                                    ${project.tech.split(',').map(tech => `
                                        <span class="tech-tag">${tech.trim()}</span>
                                    `).join('')}
                                </div>
                                <div class="project-links">
                                    ${project.link ? `<a href="${project.link}" target="_blank" class="project-link">🔗 Live Demo</a>` : ''}
                                    ${project.github ? `<a href="${project.github}" target="_blank" class="project-link">💻 GitHub</a>` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>

            <section class="section">
                <h2 class="section-title">Education</h2>
                ${education.map(edu => `
                    <div class="education-item">
                        <div class="education-degree">${edu.degree}</div>
                        <div class="education-school">${edu.school}</div>
                        <div class="education-meta">${edu.year}</div>
                        ${edu.details ? `<div class="education-details">${edu.details}</div>` : ''}
                    </div>
                `).join('')}
            </section>
        </main>
    </div>

    <script>
        // Project image carousel functionality
        const projectImages = ${JSON.stringify(projects.map(p => p.images || []))};
        let currentImageIndices = ${JSON.stringify(projects.map(() => 0))};

        function showImage(projectIndex, imageIndex) {
            const images = projectImages[projectIndex];
            if (!images || imageIndex >= images.length) return;

            currentImageIndices[projectIndex] = imageIndex;
            const imgElement = document.getElementById('project-img-' + projectIndex);
            if (imgElement) {
                imgElement.src = images[imageIndex];
            }

            // Update dots
            const dots = document.querySelectorAll('.project-card:nth-child(' + (projectIndex + 1) + ') .carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === imageIndex);
            });
        }

        function nextImage(projectIndex) {
            const images = projectImages[projectIndex];
            if (!images || images.length <= 1) return;

            const nextIndex = (currentImageIndices[projectIndex] + 1) % images.length;
            showImage(projectIndex, nextIndex);
        }

        function prevImage(projectIndex) {
            const images = projectImages[projectIndex];
            if (!images || images.length <= 1) return;

            const prevIndex = (currentImageIndices[projectIndex] - 1 + images.length) % images.length;
            showImage(projectIndex, prevIndex);
        }

        function formatDate(dateString) {
            if (!dateString) return ''
            return new Date(dateString + '-01').toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
            })
        }

        function groupSkillsByCategory(skills) {
            return skills.reduce((acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = []
                acc[skill.category].push(skill)
                return acc
            }, {})
        }
    </script>
</body>
</html>`
  }

  // Get device dimensions
  const getPreviewDimensions = () => {
    switch (previewMode) {
      case 'mobile':
        return { width: 375, height: 812 }
      case 'tablet':
        return { width: 768, height: 1024 }
      case 'desktop':
      default:
        return { width: '90%', height: '100%' }
    }
  }

  const dimensions = getPreviewDimensions()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-gray-900">Portfolio Builder</h1>
            <div className="hidden md:flex items-center space-x-3 bg-gray-100 rounded-lg p-1">
              {[
                { mode: 'desktop', icon: Monitor, label: 'Desktop' },
                { mode: 'tablet', icon: Tablet, label: 'Tablet' },
                { mode: 'mobile', icon: Smartphone, label: 'Mobile' }
              ].map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setPreviewMode(mode)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-all flex items-center space-x-2 ${
                    previewMode === mode
                      ? 'bg-white text-gray-900 shadow-sm font-medium'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {portfolioData.hasChanges && (
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Unsaved changes</span>
              </div>
            )}
            
            <button
              onClick={portfolioData.clearAll}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear All</span>
            </button>
            
            <button
              onClick={portfolioData.saveChanges}
              disabled={!portfolioData.hasChanges}
              className={`flex items-center space-x-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                portfolioData.hasChanges
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
            
            <button className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Builder */}
      <div className="flex-1 flex overflow-hidden" ref={containerRef}>
        {/* Icon Sidebar */}
        <div className="bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-2"
             style={{ width: `${ICON_SIDEBAR_WIDTH}px` }}>
          {formSections.map((section) => {
            const Icon = section.icon
            const isActive = activeForm === section.id
            
            return (
              <button
                key={section.id}
                onClick={() => handleFormSectionClick(section.id)}
                className={`relative w-12 h-12 rounded-xl transition-all duration-200 flex items-center justify-center group ${
                  isActive && formSidebarVisible
                    ? `${section.color} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={section.title}
              >
                <Icon className="h-5 w-5" />
                {isActive && formSidebarVisible && (
                  <ChevronRight className="absolute -right-1 h-3 w-3 text-white" />
                )}
                
                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {section.title}
                </div>
              </button>
            )
          })}
        </div>

        {/* Forms Sidebar */}
        <div
          className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out overflow-hidden relative ${
            formSidebarVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{ width: formSidebarVisible ? `${formSidebarWidth}px` : '0px' }}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {(() => {
                  const section = formSections.find(s => s.id === activeForm)
                  const Icon = section?.icon
                  return (
                    <>
                      {Icon && <Icon className="h-5 w-5 text-gray-600" />}
                      <h2 className="text-lg font-semibold text-gray-900">{section?.title}</h2>
                    </>
                  )
                })()}
              </div>
              <button 
                onClick={() => setFormSidebarVisible(false)}
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Render the appropriate form component */}
              {activeForm === 'personal' && (
                <PersonalInfoForm 
                  personalInfo={portfolioData.personalInfo} 
                  updatePersonalInfo={portfolioData.updatePersonalInfo}
                />
              )}
              {activeForm === 'experience' && (
                <ExperienceForm 
                  experience={portfolioData.experience}
                  addExperience={portfolioData.addExperience}
                  updateExperience={portfolioData.updateExperience}
                  removeExperience={portfolioData.removeExperience}
                />
              )}
              {activeForm === 'education' && (
                <EducationForm 
                  education={portfolioData.education}
                  addEducation={portfolioData.addEducation}
                  updateEducation={portfolioData.updateEducation}
                  removeEducation={portfolioData.removeEducation}
                />
              )}
              {activeForm === 'skills' && (
                <SkillsForm 
                  skills={portfolioData.skills}
                  addSkill={portfolioData.addSkill}
                  updateSkill={portfolioData.updateSkill}
                  removeSkill={portfolioData.removeSkill}
                />
              )}
              {activeForm === 'projects' && (
                <ProjectsForm 
                  projects={portfolioData.projects}
                  addProject={portfolioData.addProject}
                  updateProject={portfolioData.updateProject}
                  removeProject={portfolioData.removeProject}
                />
              )}
              {activeForm === 'contact' && (
                <ContactForm 
                  personalInfo={portfolioData.personalInfo}
                  updatePersonalInfo={portfolioData.updatePersonalInfo}
                />
              )}
            </div>
          </div>

          {/* Resize Handle */}
          {formSidebarVisible && (
            <div
              ref={resizeRef}
              onMouseDown={handleMouseDown}
              className={`absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-blue-500 transition-colors z-10 group ${
                isResizing ? 'bg-blue-500' : ''
              }`}
              title="Drag to resize sidebar"
            >
              <div className="absolute inset-y-0 right-0 w-1 bg-gray-300 group-hover:bg-blue-500 transition-colors" />
            </div>
          )}
        </div>

        {/* Preview Pane */}
        <div className="flex-1 flex flex-col bg-gray-100">
          <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Preview Container */}
              <div
                className="bg-white rounded-lg shadow-2xl overflow-hidden"
                style={{
                  width: previewMode === 'desktop' ? '90%' : `${dimensions.width}px`,
                  height: previewMode === 'desktop' ? '90%' : `${dimensions.height}px`,
                  maxWidth: previewMode === 'desktop' ? 'none' : `${dimensions.width}px`,
                  maxHeight: previewMode === 'desktop' ? 'none' : `${dimensions.height}px`,
                  minHeight: previewMode === 'desktop' ? '500px' : 'auto',
                }}
              >
                {/* Device Frame for Mobile/Tablet */}
                {previewMode !== 'desktop' && (
                  <div className="absolute inset-0 pointer-events-none z-10">
                    <div className={`absolute inset-0 border-4 rounded-lg ${
                      previewMode === 'mobile' 
                        ? 'border-gray-800 rounded-3xl' 
                        : 'border-gray-600 rounded-xl'
                    }`} />
                    {previewMode === 'mobile' && (
                      <>
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-700 rounded-full" />
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full" />
                      </>
                    )}
                  </div>
                )}

                {/* Iframe */}
                <iframe
                  srcDoc={generateHTML()}
                  className="w-full h-full border-0"
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  title="Portfolio Preview"
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>

              {/* Preview Mode Label */}
              <div className="absolute -top-8 left-0 text-sm text-gray-600 font-medium">
                {previewMode.charAt(0).toUpperCase() + previewMode.slice(1)} Preview
                {previewMode !== 'desktop' && (
                  <span className="ml-2 text-gray-500">
                    {dimensions.width} × {dimensions.height}px
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Preview Footer */}
          <div className="bg-white border-t border-gray-200 px-4 py-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span>Template: Modern Professional</span>
                <span>Mode: {previewMode}</span>
                {formSidebarVisible && (
                  <span>Sidebar: {formSidebarWidth}px</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${portfolioData.hasChanges ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                <span className={portfolioData.hasChanges ? 'text-amber-600' : 'text-green-600'}>
                  {portfolioData.hasChanges ? 'Changes Pending' : 'All Saved'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Resize Indicator Overlay */}
        {isResizing && (
          <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-white px-6 py-4 rounded-lg shadow-xl">
              <div className="text-xl font-semibold text-gray-900">{formSidebarWidth}px</div>
              <div className="text-sm text-gray-600">Sidebar Width</div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Responsive Handler */}
      <style jsx>{`
        @media (max-width: 768px) {
          .preview-container {
            transform: scale(0.7);
            transform-origin: center top;
          }
        }
      `}</style>
    </div>
  )
}

// Helper functions
function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString + '-01').toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  })
}

function groupSkillsByCategory(skills) {
  if (!skills || !Array.isArray(skills)) return {}
  
  return skills.reduce((acc, skill) => {
    const category = skill.category || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(skill)
    return acc
  }, {})
}

export default EnhancedPortfolioBuilder