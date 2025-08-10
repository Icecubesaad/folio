// src/components/builder/builder-layout.tsx
'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
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
  const [sidebarWidth, setSidebarWidth] = useState(400) // Default width in pixels
  const [isResizing, setIsResizing] = useState(false)
  
  const { isGenerating, forceRegenerate } = usePortfolioData()
  const resizeRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Sidebar width constraints
  const MIN_SIDEBAR_WIDTH = 320
  const MAX_SIDEBAR_WIDTH = 800

  // Handle mouse resize
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)

    const startX = e.clientX
    const startWidth = sidebarWidth

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX
      const newWidth = Math.min(
        Math.max(startWidth + deltaX, MIN_SIDEBAR_WIDTH),
        MAX_SIDEBAR_WIDTH
      )
      setSidebarWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [sidebarWidth])

  // Handle wheel resize on the resize handle
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!resizeRef.current) return
    
    const rect = resizeRef.current.getBoundingClientRect()
    const isOverHandle = (
      e.clientX >= rect.left && 
      e.clientX <= rect.right && 
      e.clientY >= rect.top && 
      e.clientY <= rect.bottom
    )

    if (isOverHandle) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -20 : 20 // Invert for natural feel
      const newWidth = Math.min(
        Math.max(sidebarWidth + delta, MIN_SIDEBAR_WIDTH),
        MAX_SIDEBAR_WIDTH
      )
      setSidebarWidth(newWidth)
    }
  }, [sidebarWidth])

  // Add wheel event listener
  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
      return () => container.removeEventListener('wheel', handleWheel)
    }
  }, [handleWheel])

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
    console.log('Saving portfolio...')
  }

  const handleDownload = async () => {
    console.log('Downloading portfolio...')
  }

  const handlePreview = () => {
    window.open(window.location.href, '_blank')
  }

  const handleShare = () => {
    console.log('Sharing portfolio...')
  }

  return (
    <div 
      ref={containerRef}
      className={cn('h-screen flex flex-col bg-gray-50', className)}
    >
      {/* Toolbar */}
      <Toolbar
        isGenerating={isGenerating}
        onSave={handleSave}
        onDownload={handleDownload}
        onPreview={handlePreview}
        onShare={handleShare}
      />

      {/* Device Mode Selector */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {[
              { mode: 'desktop' as const, label: 'Desktop', icon: Monitor },
              { mode: 'tablet' as const, label: 'Tablet', icon: Tablet },
              { mode: 'mobile' as const, label: 'Mobile', icon: Smartphone }
            ].map((option) => {
              const Icon = option.icon
              return (
                <Button
                  key={option.mode}
                  variant={previewMode === option.mode ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode(option.mode)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{option.label}</span>
                </Button>
              )
            })}
          </div>

          {/* Sidebar Controls */}
          <div className="flex items-center space-x-2">
            {/* Width indicator (desktop only) */}
            {!sidebarCollapsed && (
              <div className="hidden lg:flex items-center space-x-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                <span>Form width: {sidebarWidth}px</span>
              </div>
            )}

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
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
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
            'transition-all duration-300 ease-in-out bg-white border-r border-gray-200 relative',
            // Desktop behavior
            'hidden lg:block',
            sidebarCollapsed ? 'lg:w-0 lg:overflow-hidden' : '',
            // Mobile behavior
            showMobileSidebar && 'fixed inset-y-0 left-0 z-50 w-full max-w-md block lg:hidden'
          )}
          style={!sidebarCollapsed ? { width: `${sidebarWidth}px` } : {}}
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

          {/* Resize Handle - Desktop Only */}
          {!sidebarCollapsed && (
            <div
              ref={resizeRef}
              onMouseDown={handleMouseDown}
              className={cn(
                'absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-blue-500 transition-colors z-10 hidden lg:block group',
                isResizing && 'bg-blue-500'
              )}
              title="Drag to resize or scroll to adjust width"
            >
              {/* Visual indicator */}
              <div className="absolute inset-y-0 right-0 w-1 bg-gray-300 group-hover:bg-blue-500 transition-colors" />
              
              {/* Resize tooltip */}
              <div className="absolute top-1/2 -translate-y-1/2 left-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Drag or scroll to resize
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preview Pane */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <PreviewPane
            previewMode={previewMode}
            isGenerating={isGenerating}
            onExpand={() => setShowMobileSidebar(true)}
          />
        </div>

        {/* Resize indicator overlay */}
        {isResizing && (
          <div className="fixed inset-0 bg-black bg-opacity-10 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
              <div className="text-lg font-medium text-gray-900">{sidebarWidth}px</div>
              <div className="text-sm text-gray-600">Form panel width</div>
            </div>
          </div>
        )}
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

      {/* Keyboard shortcuts hint */}
      <div className="hidden lg:block fixed bottom-4 right-4 text-xs text-gray-400 bg-white px-2 py-1 rounded shadow-sm">
        <div>💡 Hover resize handle and scroll to adjust width</div>
      </div>
    </div>
  )
}