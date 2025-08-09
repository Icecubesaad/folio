// src/components/builder/builder-layout.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Monitor, Tablet, Smartphone, PanelLeft, PanelRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormSidebar } from './form-sidebar'
import { PreviewPane } from './preview-pane'
import { Toolbar } from './toolbar'
import { usePortfolioData } from '@/hooks/use-portfolio-data'
import { cn } from '@/lib/utils'

interface BuilderLayoutProps {
  className?: string
}

type PreviewMode = 'desktop' | 'tablet' | 'mobile'

export const BuilderLayout: React.FC<BuilderLayoutProps> = ({ className }) => {
  const [activeForm, setActiveForm] = useState('personal')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop')
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const { isGenerating, generatePortfolio } = usePortfolioData()

  // Auto-generate portfolio when data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      generatePortfolio()
    }, 1000) // Debounce generation

    return () => clearTimeout(timer)
  }, [generatePortfolio])

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true)
        setShowMobileSidebar(false)
      } else {
        setSidebarCollapsed(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSave = async () => {
    // Implement save logic
    console.log('Saving portfolio...')
  }

  const handleDownload = async () => {
    // Implement download logic
    console.log('Downloading portfolio...')
  }

  const handlePreview = () => {
    // Open preview in new window
    console.log('Opening preview...')
  }

  const handleShare = () => {
    // Implement share logic
    console.log('Sharing portfolio...')
  }

  return (
    <div className={cn('h-screen flex flex-col bg-gray-50', className)}>
      {/* Toolbar */}
      <Toolbar
        isGenerating={isGenerating}
        onSave={handleSave}
        onDownload={handleDownload}
        onPreview={handlePreview}
        onShare={handleShare}
      />

      {/* Device Mode Selector */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
              className="flex items-center space-x-2"
            >
              <Monitor className="h-4 w-4" />
              <span className="hidden sm:inline">Desktop</span>
            </Button>
            <Button
              variant={previewMode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('tablet')}
              className="flex items-center space-x-2"
            >
              <Tablet className="h-4 w-4" />
              <span className="hidden sm:inline">Tablet</span>
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
              className="flex items-center space-x-2"
            >
              <Smartphone className="h-4 w-4" />
              <span className="hidden sm:inline">Mobile</span>
            </Button>
          </div>

          {/* Sidebar Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (window.innerWidth < 1024) {
                setShowMobileSidebar(!showMobileSidebar)
              } else {
                setSidebarCollapsed(!sidebarCollapsed)
              }
            }}
            className="flex items-center space-x-2"
          >
            {sidebarCollapsed || showMobileSidebar ? (
              <PanelRight className="h-4 w-4" />
            ) : (
              <PanelLeft className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {sidebarCollapsed ? 'Show Forms' : 'Hide Forms'}
            </span>
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {showMobileSidebar && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setShowMobileSidebar(false)}
          />
        )}

        {/* Form Sidebar */}
        <div
          className={cn(
            'transition-all duration-300 ease-in-out bg-white border-r border-gray-200',
            // Desktop behavior
            'hidden lg:block',
            sidebarCollapsed ? 'lg:w-0 lg:overflow-hidden' : 'lg:w-1/2 xl:w-2/5',
            // Mobile behavior
            showMobileSidebar && 'fixed inset-y-0 left-0 z-50 w-full max-w-md block lg:hidden'
          )}
        >
          <FormSidebar
            activeForm={activeForm}
            onFormChange={setActiveForm}
            onCollapse={() => {
              if (window.innerWidth < 1024) {
                setShowMobileSidebar(false)
              } else {
                setSidebarCollapsed(true)
              }
            }}
          />
        </div>

        {/* Preview Pane */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <PreviewPane
            previewMode={previewMode}
            isGenerating={isGenerating}
            onExpand={() => setShowMobileSidebar(true)}
          />
        </div>
      </div>

      {/* Mobile Form Navigation */}
      {showMobileSidebar && (
        <div className="lg:hidden bg-white border-t border-gray-200 p-4 fixed bottom-0 left-0 right-0 z-50">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Editing: {activeForm}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMobileSidebar(false)}
            >
              Done
            </Button>
          </div>
        </div>
      )}

      {/* Resizer Handle */}
      {!sidebarCollapsed && (
        <div
          className="hidden lg:block absolute left-1/2 xl:left-2/5 top-20 bottom-0 w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize z-30 transition-colors"
          onMouseDown={(e) => {
            e.preventDefault()
            const startX = e.clientX
            const startWidth = document.querySelector('.form-sidebar')?.clientWidth || 0

            const handleMouseMove = (e: MouseEvent) => {
              const newWidth = Math.min(
                Math.max(startWidth + (e.clientX - startX), 320),
                window.innerWidth * 0.7
              )
              const sidebar = document.querySelector('.form-sidebar') as HTMLElement
              if (sidebar) {
                sidebar.style.width = `${newWidth}px`
              }
            }

            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove)
              document.removeEventListener('mouseup', handleMouseUp)
            }

            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
          }}
        />
      )}
    </div>
  )
}