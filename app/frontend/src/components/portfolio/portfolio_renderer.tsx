'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface PortfolioRendererProps {
  htmlContent: string
  isGenerating: boolean
  previewMode: 'desktop' | 'tablet' | 'mobile'
}

export function PortfolioRenderer({ 
  htmlContent, 
  isGenerating, 
  previewMode 
}: PortfolioRendererProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  useEffect(() => {
    if (iframeRef.current && htmlContent && !isGenerating) {
      const iframe = iframeRef.current
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      
      if (doc) {
        doc.open()
        doc.write(htmlContent)
        doc.close()
        setIframeLoaded(true)
      }
    }
  }, [htmlContent, isGenerating])

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return '375px'
      case 'tablet': return '768px'
      case 'desktop': return '100%'
      default: return '100%'
    }
  }

  const getPreviewHeight = () => {
    switch (previewMode) {
      case 'mobile': return '667px'
      case 'tablet': return '1024px'
      case 'desktop': return '100%'
      default: return '100%'
    }
  }

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Generating your portfolio...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
        </div>
      </div>
    )
  }

  if (!htmlContent) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4 mx-auto flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
          </div>
          <p className="text-gray-600">Fill out the forms to see your portfolio</p>
          <p className="text-sm text-gray-500 mt-2">Start with personal information</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex items-center justify-center bg-gray-100">
      <div 
        className="bg-white shadow-lg transition-all duration-300 ease-in-out"
        style={{
          width: getPreviewWidth(),
          height: getPreviewHeight(),
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      >
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0 rounded-lg"
          title="Portfolio Preview"
          sandbox="allow-scripts allow-same-origin"
          onLoad={() => setIframeLoaded(true)}
        />
        
        {!iframeLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white rounded-lg">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        )}
      </div>
    </div>
  )
}