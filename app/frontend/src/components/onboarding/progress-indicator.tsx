'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProgressStep {
  id: string
  title: string
  description: string
}

interface ProgressIndicatorProps {
  steps: ProgressStep[]
  currentStep: string
  completedSteps: string[]
  className?: string
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
  completedSteps,
  className
}) => {
  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep)
  }

  const isStepCompleted = (stepId: string) => {
    return completedSteps.includes(stepId)
  }

  const isStepActive = (stepId: string) => {
    return stepId === currentStep
  }

  const currentIndex = getCurrentStepIndex()

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      {/* Desktop Progress Bar */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = isStepCompleted(step.id)
            const isActive = isStepActive(step.id)
            const isUpcoming = index > currentIndex

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200',
                      isCompleted && 'bg-green-500 border-green-500',
                      isActive && !isCompleted && 'bg-blue-500 border-blue-500',
                      isUpcoming && 'bg-gray-200 border-gray-300'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <span
                        className={cn(
                          'text-sm font-semibold',
                          isActive && 'text-white',
                          isUpcoming && 'text-gray-500'
                        )}
                      >
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="mt-2 text-center">
                    <p
                      className={cn(
                        'text-sm font-medium',
                        (isActive || isCompleted) && 'text-gray-900',
                        isUpcoming && 'text-gray-500'
                      )}
                    >
                      {step.title}
                    </p>
                    <p
                      className={cn(
                        'text-xs mt-1',
                        (isActive || isCompleted) && 'text-gray-600',
                        isUpcoming && 'text-gray-400'
                      )}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'flex-1 h-0.5 mx-4 mt-5',
                      index < currentIndex ? 'bg-green-500' : 'bg-gray-300'
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="md:hidden">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => {
            const isCompleted = isStepCompleted(step.id)
            const isActive = isStepActive(step.id)

            return (
              <React.Fragment key={step.id}>
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200',
                    isCompleted && 'bg-green-500 border-green-500',
                    isActive && !isCompleted && 'bg-blue-500 border-blue-500',
                    !isActive && !isCompleted && 'bg-gray-200 border-gray-300'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <span
                      className={cn(
                        'text-xs font-semibold',
                        isActive && 'text-white',
                        !isActive && 'text-gray-500'
                      )}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'flex-1 h-0.5',
                      index < currentIndex ? 'bg-green-500' : 'bg-gray-300'
                    )}
                  />
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Current Step Info */}
        <div className="mt-4 text-center">
          {steps.map((step) => (
            isStepActive(step.id) && (
              <div key={step.id}>
                <p className="font-medium text-gray-900">{step.title}</p>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Progress Percentage */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Overall Progress</span>
          <span>{Math.round(((currentIndex + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}