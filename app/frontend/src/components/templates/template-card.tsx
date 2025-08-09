'use client'

import React, { useState } from 'react'
import { Eye, Check, Star } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Template {
  id: string
  name: string
  category: string
  description: string
  previewImage: string
  tags: string[]
  featured?: boolean
}

interface TemplateCardProps {
  template: Template
  isSelected: boolean
  onSelect: () => void
  onPreview?: (templateId: string) => void
  className?: string
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect,
  onPreview,
  className
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onPreview) {
      onPreview(template.id)
    }
  }

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-lg group',
        isSelected && 'ring-2 ring-blue-500 bg-blue-50',
        className
      )}
      onClick={onSelect}
    >
      <div className="relative">
        {template.featured && (
          <div className="absolute top-3 left-3 z-10 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
            <Star className="h-3 w-3 mr-1" />
            Featured
          </div>
        )}

        <div className="relative overflow-hidden rounded-t-lg bg-gray-100 aspect-[4/3]">
          {!imageError ? (
            <img
              src={template.previewImage}
              alt={template.name}
              className={cn(
                'w-full h-full object-cover transition-opacity duration-200',
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-300 rounded-lg mb-2 mx-auto" />
                <p className="text-sm">Preview Unavailable</p>
              </div>
            </div>
          )}

          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="flex space-x-2">
              {onPreview && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreview}
                  className="bg-white bg-opacity-90 hover:bg-opacity-100"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              )}
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect()
                }}
                className={cn(
                  'bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900',
                  isSelected && 'bg-blue-600 text-white'
                )}
              >
                {isSelected ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Selected
                  </>
                ) : (
                  'Select'
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 text-lg">{template.name}</h3>
            {isSelected && (
              <div className="p-1 bg-blue-100 rounded-full">
                <Check className="h-4 w-4 text-blue-600" />
              </div>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {template.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {template.category}
            </span>

            <div className="flex flex-wrap gap-1">
              {template.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {template.tags.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{template.tags.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
