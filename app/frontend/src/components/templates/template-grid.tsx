'use client'

import React from 'react'
import { TemplateCard } from './template-card'
import { LoadingSkeleton } from '@/components/ui/loading'

interface Template {
  id: string
  name: string
  category: string
  description: string
  previewImage: string
  tags: string[]
  featured?: boolean
}

interface TemplateGridProps {
  templates: Template[]
  selectedTemplate?: string
  onSelectTemplate: (templateId: string) => void
  isLoading?: boolean
  className?: string
}

export const TemplateGrid: React.FC<TemplateGridProps> = ({
  templates,
  selectedTemplate,
  onSelectTemplate,
  isLoading = false,
  className
}) => {
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse bg-gray-200 rounded-lg h-80" />
        ))}
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No templates found matching your criteria</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          isSelected={selectedTemplate === template.id}
          onSelect={() => onSelectTemplate(template.id)}
        />
      ))}
    </div>
  )
}