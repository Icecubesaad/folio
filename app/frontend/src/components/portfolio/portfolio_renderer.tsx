'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react'

interface PortfolioRendererProps {
  htmlContent: string
  isGenerating: boolean
  previewMode: 'desktop' | 'tablet' | 'mobile'
  className?: string
}

export const PortfolioRenderer: React.FC<PortfolioRendererProps> = ({
  htmlContent,
  isGenerating,
  previewMode,
  className = ''
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [loadAttempts, setLoadAttempts] = useState(0)

  // Update iframe content when HTML changes
  useEffect(() => {
    if (!htmlContent || !iframeRef.current) return

    try {
      const iframe = iframeRef.current
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

      if (iframeDoc) {
        // Write HTML content to iframe
        iframeDoc.open()
        iframeDoc.write(htmlContent)
        iframeDoc.close()
        
        setHasError(false)
        setIsLoaded(true)
      }
    } catch (error) {
      console.error('Error updating iframe content:', error)
      setHasError(true)
    }
  }, [htmlContent])

  // Handle iframe load events
  const handleIframeLoad = () => {
    setIsLoaded(true)
    setHasError(false)
  }

  const handleIframeError = () => {
    setHasError(true)
    setLoadAttempts(prev => prev + 1)
  }

  // Retry loading
  const retryLoad = () => {
    if (iframeRef.current && htmlContent) {
      setHasError(false)
      setIsLoaded(false)
      
      // Force reload by setting src to empty then back to srcdoc
      const iframe = iframeRef.current
      iframe.src = 'about:blank'
      
      setTimeout(() => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
          if (iframeDoc) {
            iframeDoc.open()
            iframeDoc.write(htmlContent)
            iframeDoc.close()
          }
        } catch (error) {
          console.error('Error retrying iframe load:', error)
          setHasError(true)
        }
      }, 100)
    }
  }

  // Get responsive styles based on preview mode
  const getIframeStyles = () => {
    const baseStyles = {
      border: 'none',
      borderRadius: '8px',
      backgroundColor: 'white'
    }

    switch (previewMode) {
      case 'mobile':
        return {
          ...baseStyles,
          width: '375px',
          height: '667px',
          maxWidth: '100%'
        }
      case 'tablet':
        return {
          ...baseStyles,
          width: '768px',
          height: '1024px',
          maxWidth: '100%'
        }
      case 'desktop':
      default:
        return {
          ...baseStyles,
          width: '100%',
          height: '100%',
          minHeight: '600px'
        }
    }
  }

  // Loading State
  if (isGenerating) {
    return (
      <div className={`flex items-center justify-center h-full bg-gray-50 rounded-lg ${className}`}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Generating Your Portfolio
          </h3>
          <p className="text-gray-600 max-w-md">
            Claude is crafting a beautiful, personalized portfolio based on your information. 
            This may take a moment...
          </p>
        </div>
      </div>
    )
  }

  // Error State
  if (hasError || (!htmlContent && !isGenerating)) {
    return (
      <div className={`flex items-center justify-center h-full bg-gray-50 rounded-lg ${className}`}>
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {hasError ? 'Preview Error' : 'No Content Yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {hasError 
              ? 'There was an issue displaying your portfolio preview. Please try refreshing or check your form data.'
              : 'Start filling out your information in the forms to see your portfolio preview here.'
            }
          </p>
          {hasError && (
            <button
              onClick={retryLoad}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Preview
            </button>
          )}
          {loadAttempts > 2 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                Multiple retry attempts detected. There may be an issue with the generated content.
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Main Iframe Renderer
  return (
    <div className={`relative h-full ${className}`}>
      {/* Loading Overlay */}
      {!isLoaded && htmlContent && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10 rounded-lg">
          <div className="text-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Loading preview...</p>
          </div>
        </div>
      )}

      {/* Iframe Container */}
      <div className="h-full overflow-auto">
        <iframe
          ref={iframeRef}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          style={getIframeStyles()}
          title="Portfolio Preview"
          sandbox="allow-same-origin allow-scripts allow-forms"
          loading="lazy"
          className="mx-auto shadow-lg"
        />
      </div>

      {/* Preview Mode Indicator */}
      {isLoaded && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {previewMode.charAt(0).toUpperCase() + previewMode.slice(1)} Preview
        </div>
      )}

      {/* Responsive Helper */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white bg-opacity-90 px-2 py-1 rounded">
        {previewMode === 'mobile' && '375 × 667px'}
        {previewMode === 'tablet' && '768 × 1024px'}
        {previewMode === 'desktop' && 'Responsive'}
      </div>
    </div>
  )
}

// Alternative version using srcdoc (sometimes more reliable)
export const PortfolioRendererSrcDoc: React.FC<PortfolioRendererProps> = ({
  htmlContent,
  isGenerating,
  previewMode,
  className = ''
}) => {
  const [key, setKey] = useState(0)

  // Force refresh when content changes
  useEffect(() => {
    if (htmlContent) {
      setKey(prev => prev + 1)
    }
  }, [htmlContent])

  if (isGenerating || !htmlContent) {
    return (
      <div className={`flex items-center justify-center h-full bg-gray-50 rounded-lg ${className}`}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">
            {isGenerating ? 'Generating portfolio...' : 'No content to display'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative h-full ${className}`}>
      <iframe
        key={key}
        srcDoc={htmlContent}
        style={
          previewMode === 'mobile' 
            ? { width: '375px', height: '667px', maxWidth: '100%' }
            : previewMode === 'tablet'
            ? { width: '768px', height: '1024px', maxWidth: '100%' }
            : { width: '100%', height: '100%', minHeight: '600px' }
        }
        className="border-none rounded-lg shadow-lg mx-auto bg-white"
        title="Portfolio Preview"
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  )
}