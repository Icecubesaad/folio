'use client'

import React, { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const fields = [
  { id: 'developer', label: 'Software Developer', description: 'Frontend, Backend, Full-stack' },
  { id: 'designer', label: 'Designer', description: 'UI/UX, Graphic, Product' },
  { id: 'marketing', label: 'Marketing', description: 'Digital, Content, Brand' },
  { id: 'business', label: 'Business', description: 'Analyst, Manager, Consultant' },
  { id: 'creative', label: 'Creative', description: 'Writer, Artist, Photographer' },
  { id: 'data', label: 'Data Science', description: 'Analytics, ML, Research' },
  { id: 'sales', label: 'Sales', description: 'Account Manager, BD, Sales Rep' },
  { id: 'education', label: 'Education', description: 'Teacher, Professor, Trainer' },
  { id: 'healthcare', label: 'Healthcare', description: 'Medical, Nursing, Therapy' },
  { id: 'other', label: 'Other', description: 'Custom field' }
]

interface FieldSelectorProps {
  onSubmit: (selectedField: string) => void
  isLoading?: boolean
}

export const FieldSelector: React.FC<FieldSelectorProps> = ({
  onSubmit,
  isLoading = false
}) => {
  const [selectedField, setSelectedField] = useState<string>('')

  const handleSubmit = () => {
    if (selectedField) {
      onSubmit(selectedField)
    }
  }

  return (
    <Card className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your field?</h2>
        <p className="text-gray-600">
          This helps us recommend the best templates and content for your portfolio
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {fields.map((field) => (
          <button
            key={field.id}
            onClick={() => setSelectedField(field.id)}
            className={cn(
              'p-4 text-left border-2 rounded-lg transition-all duration-200 hover:shadow-md',
              selectedField === field.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{field.label}</h3>
                <p className="text-sm text-gray-600">{field.description}</p>
              </div>
              {selectedField === field.id && (
                <div className="ml-2 p-1 bg-blue-500 rounded-full">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="text-center">
        <Button
          onClick={handleSubmit}
          disabled={!selectedField || isLoading}
          className="px-8 py-3"
          loading={isLoading}
        >
          Continue to Templates
        </Button>
      </div>
    </Card>
  )
}
