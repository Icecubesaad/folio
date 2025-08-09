'use client'

import { useEffect, useRef } from 'react'

interface IframeSandboxProps {
  htmlContent: string
  width?: string
  height?: string
  className?: string
}

export function IframeSandbox({ 
  htmlContent, 
  width = '100%', 
  height = '100%',
  className = ''
}: IframeSandboxProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (iframeRef.current && htmlContent) {
      const iframe = iframeRef.current
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      
      if (doc) {
        doc.open()
        doc.write(htmlContent)
        doc.close()
        
        // Add responsive meta tag if not present
        const metaViewport = doc.querySelector('meta[name="viewport"]')
        if (!metaViewport) {
          const meta = doc.createElement('meta')
          meta.name = 'viewport'
          meta.content = 'width=device-width, initial-scale=1.0'
          doc.head.appendChild(meta)
        }

        // Add security headers
        const csp = doc.createElement('meta')
        csp.httpEquiv = 'Content-Security-Policy'
        csp.content = "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: https:"
        doc.head.appendChild(csp)
      }
    }
  }, [htmlContent])

  return (
    <iframe
      ref={iframeRef}
      className={`border-0 ${className}`}
      style={{ width, height }}
      title="Portfolio Preview"
      sandbox="allow-scripts allow-same-origin allow-forms"
      loading="lazy"
    />
  )
}