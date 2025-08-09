'use client'

import React from 'react'
import { X, ExternalLink, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { IframeSandbox } from '@/components/portfolio/iframe-sandbox'

interface Template {
  id: string
  name: string
  category: string
  description: string
  previewImage: string
  demoHtml?: string
  tags: string[]
}

interface TemplatePreviewProps {
  template: Template | null
  isOpen: boolean
  onClose: () => void
  onSelect?: (templateId: string) => void
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  isOpen,
  onClose,
  onSelect
}) => {
  if (!template) return null

  const handleSelect = () => {
    if (onSelect) {
      onSelect(template.id)
    }
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={template.name}
      description={template.description}
      size="full"
    >
      <div className="flex flex-col h-[80vh]">
        {/* Preview Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
          <div className="flex items-center space-x-4">
            <div>
              <h3 className="font-semibold text-gray-900">{template.name}</h3>
              <p className="text-sm text-gray-600">{template.category}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {template.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('#', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Full Preview
            </Button>
            <Button size="sm" onClick={handleSelect}>
              <Download className="h-4 w-4 mr-2" />
              Use This Template
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
          {template.demoHtml ? (
            <IframeSandbox
              htmlContent={template.demoHtml}
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-white flex items-center justify-center">
              <div className="text-center">
                <img
                  src={template.previewImage}
                  alt={template.name}
                  className="max-w-full max-h-96 object-contain mx-auto mb-4 rounded-lg shadow-md"
                />
                <p className="text-gray-600">
                  Interactive preview will be available after selection
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
