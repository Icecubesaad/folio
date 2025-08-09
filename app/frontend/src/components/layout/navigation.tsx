// src/components/layout/navigation.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Home, 
  Layout, 
  Wrench, 
  FileText, 
  Settings,
  ChevronRight,
  ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
  disabled?: boolean
}

interface BreadcrumbItem {
  name: string
  href?: string
  current?: boolean
}

interface NavigationProps {
  className?: string
  variant?: 'horizontal' | 'vertical' | 'breadcrumb'
  items?: NavigationItem[]
  breadcrumbs?: BreadcrumbItem[]
}

const defaultNavigationItems: NavigationItem[] = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
    description: 'Portfolio Builder homepage'
  },
  {
    name: 'Get Started',
    href: '/onboarding',
    icon: FileText,
    description: 'Tell us about yourself'
  },
  {
    name: 'Choose Template',
    href: '/templates',
    icon: Layout,
    description: 'Pick your design'
  },
  {
    name: 'Build Portfolio',
    href: '/builder',
    icon: Wrench,
    description: 'Customize your portfolio'
  }
]

export const Navigation: React.FC<NavigationProps> = ({
  className,
  variant = 'horizontal',
  items = defaultNavigationItems,
  breadcrumbs
}) => {
  const pathname = usePathname()

  if (variant === 'breadcrumb' && breadcrumbs) {
    return (
      <nav className={cn('flex items-center space-x-2', className)}>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.name}>
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
            )}
            {crumb.href && !crumb.current ? (
              <Link
                href={crumb.href}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                {crumb.name}
              </Link>
            ) : (
              <span className={cn(
                'text-sm font-medium',
                crumb.current ? 'text-gray-900' : 'text-gray-500'
              )}>
                {crumb.name}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>
    )
  }

  if (variant === 'vertical') {
    return (
      <nav className={cn('space-y-1', className)}>
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : item.disabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
              onClick={(e) => item.disabled && e.preventDefault()}
            >
              <Icon className={cn(
                'mr-3 h-5 w-5 flex-shrink-0',
                isActive ? 'text-blue-600' : 'text-gray-400'
              )} />
              <div className="flex-1">
                <div>{item.name}</div>
                {item.description && (
                  <div className="text-xs text-gray-500 mt-1">
                    {item.description}
                  </div>
                )}
              </div>
              {isActive && (
                <div className="w-2 h-2 bg-blue-600 rounded-full ml-2"></div>
              )}
            </Link>
          )
        })}
      </nav>
    )
  }

  // Horizontal navigation (default)
  return (
    <nav className={cn('flex items-center space-x-8', className)}>
      {items.map((item) => {
        const isActive = pathname === item.href
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'text-sm font-medium transition-colors relative',
              isActive
                ? 'text-blue-600'
                : item.disabled
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:text-blue-600'
            )}
            onClick={(e) => item.disabled && e.preventDefault()}
          >
            {item.name}
            {isActive && (
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
            )}
          </Link>
        )
      })}
    </nav>
  )
}

// Step Navigation Component for multi-step processes
interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  steps: Array<{
    name: string
    description?: string
    completed?: boolean
  }>
  onStepClick?: (step: number) => void
  className?: string
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  steps,
  onStepClick,
  className
}) => {
  return (
    <nav className={cn('flex items-center justify-between', className)}>
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        const isCompleted = step.completed || stepNumber < currentStep
        const isClickable = onStepClick && (isCompleted || stepNumber <= currentStep + 1)

        return (
          <React.Fragment key={step.name}>
            <div className="flex items-center">
              <button
                onClick={() => isClickable && onStepClick(stepNumber)}
                disabled={!isClickable}
                className={cn(
                  'flex items-center space-x-3 p-2 rounded-lg transition-all',
                  isClickable ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : isCompleted
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                )}>
                  {isCompleted && stepNumber < currentStep ? '✓' : stepNumber}
                </div>
                <div className="text-left hidden sm:block">
                  <div className={cn(
                    'text-sm font-medium',
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-900'
                  )}>
                    {step.name}
                  </div>
                  {step.description && (
                    <div className="text-xs text-gray-500">
                      {step.description}
                    </div>
                  )}
                </div>
              </button>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className={cn(
                'flex-1 h-px mx-4',
                stepNumber < currentStep ? 'bg-green-600' : 'bg-gray-200'
              )} />
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

// Page Navigation Component (Previous/Next)
interface PageNavigationProps {
  onPrevious?: () => void
  onNext?: () => void
  previousLabel?: string
  nextLabel?: string
  previousDisabled?: boolean
  nextDisabled?: boolean
  className?: string
}

export const PageNavigation: React.FC<PageNavigationProps> = ({
  onPrevious,
  onNext,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  previousDisabled = false,
  nextDisabled = false,
  className
}) => {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div>
        {onPrevious && (
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={previousDisabled}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{previousLabel}</span>
          </Button>
        )}
      </div>

      <div>
        {onNext && (
          <Button
            onClick={onNext}
            disabled={nextDisabled}
            className="flex items-center space-x-2"
          >
            <span>{nextLabel}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}