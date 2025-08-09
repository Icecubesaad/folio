'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, ArrowRight, Filter, Grid, List, Star, Zap, Palette, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { usePortfolioStore } from '@/store/portfolio-store'
import { useTemplateStore } from '@/store/template-store'
import toast from 'react-hot-toast'

interface Template {
  id: string
  name: string
  category: string
  style: string
  preview: string
  description: string
  features: string[]
  bestFor: string[]
  complexity: 'Simple' | 'Moderate' | 'Advanced'
  popular?: boolean
}

export default function TemplatesPage() {
  const router = useRouter()
  const { personalInfo, preferences } = usePortfolioStore()
  const { setSelectedTemplate } = useTemplateStore()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedTemplate, setSelected] = useState<string | null>(null)

  // Redirect if no onboarding data
  useEffect(() => {
    if (!personalInfo?.fullName) {
      router.push('/onboarding')
    }
  }, [personalInfo, router])

  const templates: Template[] = [
    {
      id: 'modern-minimal',
      name: 'Modern Minimal',
      category: 'developer',
      style: 'modern',
      preview: '/templates/modern-minimal.png',
      description: 'Clean, focused design that lets your work shine. Perfect for developers and designers.',
      features: ['Responsive Design', 'Dark/Light Mode', 'Smooth Animations', 'Project Showcase'],
      bestFor: ['Frontend Developers', 'UI/UX Designers', 'Full-Stack Developers'],
      complexity: 'Simple',
      popular: true
    },
    {
      id: 'creative-portfolio',
      name: 'Creative Portfolio',
      category: 'designer',
      style: 'creative',
      preview: '/templates/creative-portfolio.png',
      description: 'Bold, artistic design with vibrant colors and unique layouts.',
      features: ['Custom Animations', 'Image Gallery', 'Video Support', 'Interactive Elements'],
      bestFor: ['Graphic Designers', 'Photographers', 'Artists', 'Content Creators'],
      complexity: 'Moderate'
    },
    {
      id: 'professional-corporate',
      name: 'Professional Corporate',
      category: 'business',
      style: 'professional',
      preview: '/templates/professional-corporate.png',
      description: 'Traditional, trustworthy design perfect for business professionals.',
      features: ['Clean Typography', 'Professional Layout', 'Contact Forms', 'Testimonials'],
      bestFor: ['Marketing Managers', 'Consultants', 'Business Analysts', 'Executives'],
      complexity: 'Simple'
    },
    {
      id: 'developer-showcase',
      name: 'Developer Showcase',
      category: 'developer',
      style: 'tech',
      preview: '/templates/developer-showcase.png',
      description: 'Code-inspired design with syntax highlighting and technical aesthetics.',
      features: ['Code Snippets', 'GitHub Integration', 'Terminal Theme', 'Tech Stack Display'],
      bestFor: ['Backend Developers', 'Full-Stack Developers', 'DevOps Engineers'],
      complexity: 'Advanced',
      popular: true
    },
    {
      id: 'freelancer-hub',
      name: 'Freelancer Hub',
      category: 'freelancer',
      style: 'modern',
      preview: '/templates/freelancer-hub.png',
      description: 'Versatile design perfect for showcasing diverse skills and services.',
      features: ['Service Listings', 'Pricing Tables', 'Client Reviews', 'Booking System'],
      bestFor: ['Freelancers', 'Consultants', 'Multi-disciplinary Professionals'],
      complexity: 'Moderate'
    },
    {
      id: 'photographer-gallery',
      name: 'Photographer Gallery',
      category: 'creative',
      style: 'creative',
      preview: '/templates/photographer-gallery.png',
      description: 'Image-focused design with beautiful galleries and visual storytelling.',
      features: ['Full-Screen Gallery', 'Lightbox Effects', 'EXIF Data', 'Client Proofing'],
      bestFor: ['Photographers', 'Videographers', 'Visual Artists'],
      complexity: 'Moderate'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Templates', count: templates.length },
    { id: 'developer', name: 'Developer', count: templates.filter(t => t.category === 'developer').length },
    { id: 'designer', name: 'Designer', count: templates.filter(t => t.category === 'designer').length },
    { id: 'business', name: 'Business', count: templates.filter(t => t.category === 'business').length },
    { id: 'creative', name: 'Creative', count: templates.filter(t => t.category === 'creative').length },
    { id: 'freelancer', name: 'Freelancer', count: templates.filter(t => t.category === 'freelancer').length }
  ]

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory)

  // Get recommended templates based on user preferences
  const getRecommendedTemplates = () => {
    if (!preferences) return templates.slice(0, 3)
    
    const fieldMapping: Record<string, string> = {
      'Frontend Developer': 'developer',
      'Backend Developer': 'developer', 
      'Full-Stack Developer': 'developer',
      'UI/UX Designer': 'designer',
      'Graphic Designer': 'designer',
      'Marketing Manager': 'business',
      'Consultant': 'business'
    }

    const recommendedCategory = fieldMapping[preferences.field] || 'all'
    const styleMatch = templates.filter(t => t.style === preferences.preferredStyle)
    const categoryMatch = templates.filter(t => t.category === recommendedCategory)

    // Combine style and category matches, remove duplicates
    const recommended = [...new Set([...styleMatch, ...categoryMatch])].slice(0, 3)
    return recommended.length > 0 ? recommended : templates.slice(0, 3)
  }

  const handleSelectTemplate = (template: Template) => {
    setSelected(template.id)
    setSelectedTemplate(template)
    toast.success(`${template.name} template selected!`)
    
    // Navigate to builder after a short delay
    setTimeout(() => {
      router.push('/builder')
    }, 1000)
  }

  if (!personalInfo?.fullName) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Template
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a template that matches your style and profession. 
            We'll customize it with your information using AI.
          </p>
        </div>

        {/* Recommended Section */}
        {preferences && (
          <div className="mb-12">
            <div className="flex items-center space-x-2 mb-6">
              <Zap className="h-5 w-5 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-gray-900">Recommended for You</h2>
              <span className="text-sm text-gray-500">Based on your preferences</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {getRecommendedTemplates().map((template) => (
                <Card key={template.id} className="group hover:shadow-xl transition-all duration-300 border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
                  <div className="relative">
                    <img 
                      src={template.preview} 
                      alt={template.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Recommended
                      </span>
                    </div>
                    {template.popular && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <Star className="h-3 w-3" />
                          <span>Popular</span>
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{template.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 capitalize">{template.complexity}</span>
                      <Button 
                        onClick={() => handleSelectTemplate(template)}
                        disabled={selectedTemplate === template.id}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      >
                        {selectedTemplate === template.id ? 'Selected!' : 'Select'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Templates Grid/List */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-6'
        }>
          {filteredTemplates.map((template) => (
            <Card key={template.id} className={`group hover:shadow-xl transition-all duration-300 ${
              viewMode === 'list' ? 'flex items-center space-x-6 p-6' : ''
            }`}>
              {viewMode === 'grid' ? (
                <>
                  <div className="relative">
                    <img 
                      src={template.preview} 
                      alt={template.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {template.popular && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <Star className="h-3 w-3" />
                          <span>Popular</span>
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-t-lg flex items-center justify-center">
                      <Button
                        variant="outline"
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white hover:bg-gray-100"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{template.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        template.complexity === 'Simple' ? 'bg-green-100 text-green-700' :
                        template.complexity === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {template.complexity}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 mb-2">Best for:</div>
                      <div className="flex flex-wrap gap-1">
                        {template.bestFor.slice(0, 2).map((item) => (
                          <span key={item} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            {item}
                          </span>
                        ))}
                        {template.bestFor.length > 2 && (
                          <span className="text-gray-400 text-xs">+{template.bestFor.length - 2} more</span>
                        )}
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleSelectTemplate(template)}
                      disabled={selectedTemplate === template.id}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {selectedTemplate === template.id ? 'Selected!' : 'Select Template'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <img 
                    src={template.preview} 
                    alt={template.name}
                    className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{template.name}</h3>
                      <div className="flex items-center space-x-2">
                        {template.popular && (
                          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                            <Star className="h-3 w-3" />
                            <span>Popular</span>
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          template.complexity === 'Simple' ? 'bg-green-100 text-green-700' :
                          template.complexity === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {template.complexity}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {template.bestFor.slice(0, 3).map((item) => (
                          <span key={item} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            {item}
                          </span>
                        ))}
                      </div>
                      <Button 
                        onClick={() => handleSelectTemplate(template)}
                        disabled={selectedTemplate === template.id}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {selectedTemplate === template.id ? 'Selected!' : 'Select'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Palette className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600">Try selecting a different category or check back later for new templates.</p>
          </div>
        )}
      </div>
    </div>
  )
}
