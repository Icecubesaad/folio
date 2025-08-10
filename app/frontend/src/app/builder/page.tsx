'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Download, Eye, Settings, ChevronLeft, ChevronRight, Menu, X, Monitor, Tablet, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { usePortfolioStore } from '@/store/portfolio-store'
import { useTemplateStore } from '@/store/template-store'
import { FormSidebar } from '@/components/builder/form-sidebar'
import { PreviewPane } from '@/components/builder/preview-pane'
import { Toolbar } from '@/components/builder/toolbar'
import toast from 'react-hot-toast'

export default function BuilderPage() {
  const router = useRouter()
  const { personalInfo } = usePortfolioStore()
  const { selectedTemplate } = useTemplateStore()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeForm, setActiveForm] = useState('personal')
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  // Check for required data on mount
  useEffect(() => {
    // Don't redirect immediately, allow users to fill out forms
    if (!selectedTemplate) {
      console.warn('No template selected, redirecting to templates')
      // Uncomment if you want to enforce template selection
      // router.push('/templates')
    }
  }, [selectedTemplate, router])

  const handleSavePortfolio = async () => {
    if (!personalInfo?.fullName) {
      toast.error('Please fill out your personal information first')
      return
    }

    try {
      setIsGenerating(true)
      const response = await fetch('/api/save-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolioData: usePortfolioStore.getState(),
          template: selectedTemplate
        })
      })
      
      if (response.ok) {
        toast.success('Portfolio saved successfully!')
      } else {
        throw new Error('Failed to save portfolio')
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save portfolio')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadPortfolio = async () => {
    if (!personalInfo?.fullName) {
      toast.error('Please fill out your personal information first')
      return
    }

    try {
      setIsGenerating(true)
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolioData: usePortfolioStore.getState(),
          template: selectedTemplate
        })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${personalInfo.fullName.replace(/\s+/g, '-').toLowerCase()}-portfolio.zip`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Portfolio downloaded successfully!')
      } else {
        throw new Error('Failed to download portfolio')
      }
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download portfolio')
    } finally {
      setIsGenerating(false)
    }
  }

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/templates')}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Templates</span>
            </Button>
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold text-gray-900">Portfolio Builder</h1>
              <p className="text-sm text-gray-500">
                Template: {selectedTemplate?.name || 'No template selected'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Preview Mode Selector */}
            <div className="hidden lg:flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`px-3 py-1 text-xs rounded-md transition-all duration-200 flex items-center space-x-1 ${
                  previewMode === 'desktop'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Monitor className="h-3 w-3" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setPreviewMode('tablet')}
                className={`px-3 py-1 text-xs rounded-md transition-all duration-200 flex items-center space-x-1 ${
                  previewMode === 'tablet'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Tablet className="h-3 w-3" />
                <span>Tablet</span>
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`px-3 py-1 text-xs rounded-md transition-all duration-200 flex items-center space-x-1 ${
                  previewMode === 'mobile'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Smartphone className="h-3 w-3" />
                <span>Mobile</span>
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSavePortfolio}
              disabled={isGenerating || !personalInfo?.fullName}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Save</span>
            </Button>
            
            <Button
              size="sm"
              onClick={handleDownloadPortfolio}
              disabled={isGenerating || !personalInfo?.fullName}
              className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="lg:hidden"
            >
              {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Builder Interface */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Form Sidebar */}
        <div className={`
          transition-all duration-300 border-r border-gray-200 bg-white overflow-hidden
          ${sidebarCollapsed 
            ? 'w-0 lg:w-0' 
            : 'w-full lg:w-1/2 xl:w-2/5'
          }
          ${sidebarCollapsed ? 'hidden lg:hidden' : 'block'}
        `}>
          <FormSidebar 
            activeForm={activeForm}
            onFormChange={setActiveForm}
            onCollapse={() => setSidebarCollapsed(true)}
          />
        </div>

        {/* Preview Pane */}
        <div className={`
          transition-all duration-300 bg-gray-100
          ${sidebarCollapsed 
            ? 'w-full' 
            : 'w-0 lg:w-1/2 xl:w-3/5'
          }
          ${sidebarCollapsed ? 'block' : 'hidden lg:block'}
        `}>
          <PreviewPane 
            previewMode={previewMode}
            isGenerating={isGenerating}
            onExpand={() => setSidebarCollapsed(false)}
          />
        </div>
      </div>

      {/* Mobile Toggle Button */}
      {sidebarCollapsed && (
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setSidebarCollapsed(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Status Bar */}
      <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              personalInfo?.fullName ? 'bg-green-500' : 'bg-gray-300'
            }`}></div>
            <span className="text-gray-600">
              {personalInfo?.fullName ? 'Portfolio Ready' : 'Fill out forms to start'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Mode:</span>
            <span className="text-gray-700 font-medium capitalize">{previewMode}</span>
          </div>
        </div>
      </div>
    </div>
  )
}