// src/components/layout/sidebar.tsx
'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  FolderOpen, 
  Mail,
  ChevronRight,
  ChevronDown,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarItem {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  count?: number
  active?: boolean
  completed?: boolean
}

interface SidebarProps {
  className?: string
  collapsed?: boolean
  onCollapse?: () => void
  activeItem?: string
  onItemSelect?: (itemId: string) => void
  items?: SidebarItem[]
}

const defaultItems: SidebarItem[] = [
  { id: 'personal', title: 'Personal Info', icon: User, completed: false },
  { id: 'experience', title: 'Experience', icon: Briefcase, count: 0 },
  { id: 'education', title: 'Education', icon: GraduationCap, count: 0 },
  { id: 'skills', title: 'Skills', icon: Code2, count: 0 },
  { id: 'projects', title: 'Projects', icon: FolderOpen, count: 0 },
  { id: 'contact', title: 'Contact & Social', icon: Mail, completed: false }
]

export const Sidebar: React.FC<SidebarProps> = ({
  className,
  collapsed = false,
  onCollapse,
  activeItem = 'personal',
  onItemSelect,
  items = defaultItems
}) => {
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set(['main']))

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  if (collapsed) {
    return (
      <div className={cn(
        'w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-2',
        className
      )}>
        {items.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onItemSelect?.(item.id)}
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center transition-colors relative',
                activeItem === item.id
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
              title={item.title}
            >
              <Icon className="h-5 w-5" />
              {item.completed && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
              {typeof item.count === 'number' && item.count > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                  {item.count}
                </div>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className={cn(
      'w-80 bg-white border-r border-gray-200 flex flex-col h-full',
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Portfolio Sections</h2>
        {onCollapse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCollapse}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {/* Main Section */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection('main')}
              className="w-full flex items-center justify-between p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <span>Portfolio Information</span>
              {expandedSections.has('main') ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            
            {expandedSections.has('main') && (
              <div className="mt-2 ml-2 space-y-1">
                {items.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => onItemSelect?.(item.id)}
                      className={cn(
                        'w-full flex items-center space-x-3 p-3 rounded-lg text-sm transition-colors relative',
                        activeItem === item.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <Icon className={cn(
                        'h-5 w-5 flex-shrink-0',
                        activeItem === item.id ? 'text-blue-600' : 'text-gray-400'
                      )} />
                      <span className="flex-1 text-left font-medium">{item.title}</span>
                      
                      {/* Status indicators */}
                      <div className="flex items-center space-x-2">
                        {item.completed && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                        {typeof item.count === 'number' && (
                          <span className={cn(
                            'text-xs px-2 py-1 rounded-full',
                            item.count > 0
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-500'
                          )}>
                            {item.count}
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Progress Section */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Completion Progress</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{item.title}</span>
                  <div className="flex items-center space-x-2">
                    {item.completed ? (
                      <span className="text-green-600 font-medium">✓ Complete</span>
                    ) : typeof item.count === 'number' && item.count > 0 ? (
                      <span className="text-blue-600 font-medium">{item.count} items</span>
                    ) : (
                      <span className="text-gray-400">Empty</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Overall</span>
                <span className="font-medium text-gray-900">
                  {Math.round((items.filter(item => 
                    item.completed || (typeof item.count === 'number' && item.count > 0)
                  ).length / items.length) * 100)}%
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(items.filter(item => 
                      item.completed || (typeof item.count === 'number' && item.count > 0)
                    ).length / items.length) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          Fill out all sections for the best portfolio results
        </div>
      </div>
    </div>
  )
}