'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Download, Eye, Settings, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react'
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

  // Redirect if no template selected
  useEffect(() => {
    if (!selectedTemplate || !personalInfo?.fullName) {
      router.push('/templates')
    }
  }, [selectedTemplate, personalInfo, router])

  const handleSavePortfolio = async () => {
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
      toast.error('Failed to save portfolio')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadPortfolio = async () => {
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
      toast.error('Failed to download portfolio')
    } finally {
      setIsGenerating(false)
    }
  }

  if (!selectedTemplate || !personalInfo?.fullName) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

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
              <p className="text-sm text-gray-500">Template: {selectedTemplate.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Preview Mode Selector */}
            <div className="hidden lg:flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              {[
                { mode: 'desktop' as const, label: 'Desktop' },
                { mode: 'tablet' as const, label: 'Tablet' },
                { mode: 'mobile' as const, label: 'Mobile' }
              ].map((option) => (
                <button
                  key={option.mode}
                  onClick={() => setPreviewMode(option.mode)}
                  className={`px-3 py-1 text-xs rounded-md transition-all duration-200 ${
                    previewMode === option.mode
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSavePortfolio}
              disabled={isGenerating}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Save</span>
            </Button>
            
            <Button
              size="sm"
              onClick={handleDownloadPortfolio}
              disabled={isGenerating}
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
          ${sidebarCollapsed ? 'w-0 lg:w-80' : 'w-full lg:w-80'} 
          transition-all duration-300 border-r border-gray-200 bg-white overflow-hidden
          ${sidebarCollapsed ? 'lg:block hidden' : 'block'}
        `}>
          <FormSidebar 
            activeForm={activeForm}
            onFormChange={setActiveForm}
            onCollapse={() => setSidebarCollapsed(true)}
          />
        </div>

        {/* Preview Pane */}
        <div className={`
          ${sidebarCollapsed ? 'w-full' : 'w-0 lg:w-full'} 
          transition-all duration-300 bg-gray-100
          ${sidebarCollapsed ? 'block' : 'lg:block hidden'}
        `}>
          <PreviewPane 
            previewMode={previewMode}
            isGenerating={isGenerating}
            onExpand={() => setSidebarCollapsed(false)}
          />
        </div>
      </div>
    </div>
  )
}