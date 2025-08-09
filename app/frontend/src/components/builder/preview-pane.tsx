// src/components/builder/preview-pane.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Monitor, Tablet, Smartphone, RotateCcw, ExternalLink, Eye, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingOverlay } from '@/components/ui/loading'
import { PortfolioRenderer } from '@/components/portfolio/portfolio-renderer'
import { usePortfolioData } from '@/hooks/use-portfolio-data'
import { cn } from '@/lib/utils'

interface PreviewPaneProps {
  previewMode: 'desktop' | 'tablet' | 'mobile'
  isGenerating: boolean
  onExpand?: () => void
  className?: string
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({
  previewMode,
  isGenerating,
  onExpand,
  className
}) => {
  const { generatedHtml, portfolioData, selectedTemplate } = usePortfolioData()
  const [previewScale, setPreviewScale] = useState(1)
  const [showDeviceFrame, setShowDeviceFrame] = useState(true)

  // Auto-fit preview to container
  useEffect(() => {
    const updateScale = () => {
      const container = document.getElementById('preview-container')
      if (!container) return

      const containerWidth = container.clientWidth - 40 // padding
      const containerHeight = container.clientHeight - 40

      let deviceWidth = 1200 // desktop default
      if (previewMode === 'tablet') deviceWidth = 768
      if (previewMode === 'mobile') deviceWidth = 375

      const scale = Math.min(
        containerWidth / deviceWidth,
        containerHeight / (previewMode === 'mobile' ? 667 : 1024),
        1
      )
      
      setPreviewScale(scale)
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [previewMode])

  const getDeviceStyles = () => {
    const baseStyles = {
      transformOrigin: 'top center',
      transform: `scale(${previewScale})`
    }

    switch (previewMode) {
      case 'mobile':
        return {
          ...baseStyles,
          width: '375px',
          height: '667px'
        }
      case 'tablet':
        return {
          ...baseStyles,
          width: '768px',
          height: '1024px'
        }
      case 'desktop':
      default:
        return {
          ...baseStyles,
          width: '100%',
          height: '100%'
        }
    }
  }

  const DeviceFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (!showDeviceFrame || previewMode === 'desktop') {
      return <>{children}</>
    }

    const frameClass = previewMode === 'mobile' 
      ? 'rounded-[2.5rem] border-8 border-gray-800 bg-gray-800' 
      : 'rounded-2xl border-4 border-gray-700 bg-gray-700'

    return (
      <div className={cn('relative p-2', frameClass)}>
        {/* Device notch/home indicator for mobile */}
        {previewMode === 'mobile' && (
          <>
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-gray-800 rounded-full"></div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full"></div>
          </>
        )}
        <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col h-full bg-gray-100', className)}>
      {/* Preview Controls */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onExpand && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExpand}
                className="lg:hidden flex items-center space-x-2"
              >
                <Menu className="h-4 w-4" />
                <span>Forms</span>
              </Button>
            )}
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Preview:</span>
              {selectedTemplate && (
                <span className="text-sm text-gray-500">{selectedTemplate.name}</span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Device frame toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeviceFrame(!showDeviceFrame)}
              className={cn(
                'hidden md:flex items-center space-x-2',
                showDeviceFrame && 'bg-gray-100'
              )}
            >
              {previewMode === 'mobile' ? (
                <Smartphone className="h-4 w-4" />
              ) : previewMode === 'tablet' ? (
                <Tablet className="h-4 w-4" />
              ) : (
                <Monitor className="h-4 w-4" />
              )}
              <span className="text-xs">Frame</span>
            </Button>

            {/* Refresh button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              disabled={isGenerating}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            {/* External preview */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (generatedHtml) {
                  const blob = new Blob([generatedHtml], { type: 'text/html' })
                  const url = URL.createObjectURL(blob)
                  window.open(url, '_blank')
                }
              }}
              disabled={!generatedHtml || isGenerating}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 relative overflow-hidden" id="preview-container">
        <div className="absolute inset-0 flex items-center justify-center p-5">
          <LoadingOverlay 
            isLoading={isGenerating}
            message="Generating your portfolio..."
          >
            <div style={getDeviceStyles()}>
              <DeviceFrame>
                <PortfolioRenderer
                  htmlContent={generatedHtml}
                  isGenerating={isGenerating}
                  previewMode={previewMode}
                />
              </DeviceFrame>
            </div>
          </LoadingOverlay>
        </div>

        {/* Preview State Messages */}
        {!isGenerating && !generatedHtml && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-md">
              <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Live Preview
              </h3>
              <p className="text-gray-600 mb-4">
                Fill out the forms on the left to see your portfolio come to life. 
                Changes will appear here in real-time.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <h4 className="font-medium text-blue-900 mb-2">Getting Started:</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Start with Personal Information</li>
                  <li>Add your work experience</li>
                  <li>Include your skills and projects</li>
                  <li>Watch your portfolio update automatically</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Preview Error State */}
        {!isGenerating && generatedHtml && generatedHtml.includes('Error generating') && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-md bg-white rounded-lg shadow-lg p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Preview Error
              </h3>
              <p className="text-gray-600 mb-4">
                There was an issue generating your portfolio preview. 
                Please try refreshing or check your form data.
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="w-full"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retry Preview
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Preview Footer Info */}
      <div className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>Template: {selectedTemplate?.name || 'None'}</span>
            <span>Mode: {previewMode}</span>
            <span>Scale: {Math.round(previewScale * 100)}%</span>
          </div>
          <div className="flex items-center space-x-2">
            {portfolioData.personalInfo?.fullName && (
              <span className="text-green-600">● Live</span>
            )}
            <span>Auto-updating preview</span>
          </div>
        </div>
      </div>
    </div>
  )
}