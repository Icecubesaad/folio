// src/components/ui/loading.tsx
import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  className, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <Loader2 className={cn(
      'animate-spin text-gray-500',
      sizeClasses[size],
      className
    )} />
  )
}

interface LoadingSkeletonProps {
  className?: string
  lines?: number
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className, 
  lines = 3 
}) => {
  return (
    <div className={cn('animate-pulse space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i}
          className={cn(
            'h-4 bg-gray-200 rounded',
            i === lines - 1 && 'w-3/4', // Last line shorter
            i === 0 && 'w-full', // First line full
            i > 0 && i < lines - 1 && 'w-5/6' // Middle lines
          )}
        />
      ))}
    </div>
  )
}

interface LoadingCardProps {
  className?: string
}

export const LoadingCard: React.FC<LoadingCardProps> = ({ className }) => {
  return (
    <div className={cn(
      'animate-pulse bg-white rounded-lg border shadow-sm p-6',
      className
    )}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
    </div>
  )
}

interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  className?: string
  message?: string
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isLoading, 
  children, 
  className,
  message = 'Loading...'
}) => {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4 mx-auto" />
            <p className="text-gray-600 text-sm">{message}</p>
          </div>
        </div>
      )}
    </div>
  )
}

interface LoadingPageProps {
  message?: string
  className?: string
}

export const LoadingPage: React.FC<LoadingPageProps> = ({ 
  message = 'Loading...', 
  className 
}) => {
  return (
    <div className={cn(
      'min-h-screen flex items-center justify-center bg-gray-50',
      className
    )}>
      <div className="text-center">
        <LoadingSpinner size="lg" className="mb-4 mx-auto text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{message}</h2>
        <p className="text-gray-600">Please wait while we process your request.</p>
      </div>
    </div>
  )
}