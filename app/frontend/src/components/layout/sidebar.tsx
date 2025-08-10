// src/components/layout/sidebar.tsx
'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { 
  User, 
  Briefcase, 
  Code2, 
  FolderOpen, 
  GraduationCap, 
  Mail,
  Check,
  Circle,
  ChevronLeft,
  X
} from 'lucide-react'

interface SidebarItem {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  completed?: boolean
  count?: number
  hasData?: boolean
}

interface SidebarProps {
  activeItem: string
  onItemSelect: (item: string) => void
  items: SidebarItem[]
  collapsed?: boolean
  onCollapse?: () => void
  className?: string
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeItem,
  onItemSelect,
  items = [],
  collapsed = false,
  onCollapse,
  className
}) => {
  const defaultItems: SidebarItem[] = [
    {
      id: 'personal',
      title: 'Personal Info',
      icon: User,
      completed: false,
      hasData: false
    },
    {
      id: 'experience',
      title: 'Experience',
      icon: Briefcase,
      count: 0,
      hasData: false
    },
    {
      id: 'skills',
      title: 'Skills',
      icon: Code2,
      count: 0,
      hasData: false
    },
    {
      id: 'projects',
      title: 'Projects',
      icon: FolderOpen,
      count: 0,
      hasData: false
    },
    {
      id: 'education',
      title: 'Education',
      icon: GraduationCap,
      count: 0,
      hasData: false
    },
    {
      id: 'contact',
      title: 'Contact & Social',
      icon: Mail,
      completed: false,
      hasData: false
    }
  ]

  const sidebarItems = items.length > 0 ? items : defaultItems

  const getItemStatus = (item: SidebarItem) => {
    if (item.completed) return 'completed'
    if (item.hasData || (item.count && item.count > 0)) return 'partial'
    return 'empty'
  }

  const getStatusIcon = (item: SidebarItem) => {
    const status = getItemStatus(item)
    
    if (status === 'completed') {
      return <Check className="h-4 w-4 text-green-600" />
    }
    if (status === 'partial') {
      return <Circle className="h-4 w-4 text-blue-600 fill-current" />
    }
    return <Circle className="h-4 w-4 text-gray-300" />
  }

  if (collapsed) {
    return (
      <div className={cn(
        'w-16 bg-white border-r border-gray-200 flex flex-col',
        className
      )}>
        {/* Collapsed Header */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={onCollapse}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            title="Expand sidebar"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600 rotate-180" />
          </button>
        </div>

        {/* Collapsed Navigation */}
        <nav className="flex-1 py-4">
          <div className="space-y-2 px-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = activeItem === item.id
              const status = getItemStatus(item)

              return (
                <button
                  key={item.id}
                  onClick={() => onItemSelect(item.id)}
                  className={cn(
                    'w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 relative group',
                    isActive 
                      ? 'bg-blue-100 text-blue-700 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                  title={item.title}
                >
                  <Icon className="h-5 w-5" />
                  
                  {/* Status indicator */}
                  <div className="absolute -top-1 -right-1">
                    {status === 'completed' && (
                      <div className="w-3 h-3 bg-green-500 rounded-full border border-white" />
                    )}
                    {status === 'partial' && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full border border-white" />
                    )}
                  </div>

                  {/* Count badge */}
                  {item.count && item.count > 0 && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {item.count > 9 ? '9+' : item.count}
                    </div>
                  )}

                  {/* Tooltip */}
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {item.title}
                    {item.count && item.count > 0 && ` (${item.count})`}
                  </div>
                </button>
              )
            })}
          </div>
        </nav>
      </div>
    )
  }

  return (
    <div className={cn(
      'w-80 bg-white border-r border-gray-200 flex flex-col',
      className
    )}>
      {/* Expanded Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Portfolio Sections</h2>
            <p className="text-sm text-gray-600 mt-1">Complete each section to build your portfolio</p>
          </div>
          {onCollapse && (
            <button
              onClick={onCollapse}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              title="Close sidebar"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Progress Overview */}
        <div className="mt-4 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">Overall Progress</span>
            <span className="font-medium text-gray-900">
              {sidebarItems.filter(item => getItemStatus(item) !== 'empty').length} / {sidebarItems.length}
            </span>
          </div>
          <div className="mt-2 bg-white rounded-full h-2">
            <div 
              className="h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
              style={{ 
                width: `${(sidebarItems.filter(item => getItemStatus(item) !== 'empty').length / sidebarItems.length) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>

      {/* Expanded Navigation */}
      <nav className="flex-1 py-4">
        <div className="space-y-1 px-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.id
            const status = getItemStatus(item)

            return (
              <button
                key={item.id}
                onClick={() => onItemSelect(item.id)}
                className={cn(
                  'w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 group',
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                {/* Icon */}
                <div className="flex-shrink-0 mr-3">
                  <Icon className={cn(
                    'h-5 w-5 transition-colors',
                    isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                  )} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">
                      {item.title}
                    </span>
                    
                    <div className="flex items-center space-x-2 ml-2">
                      {/* Count badge */}
                      {item.count !== undefined && (
                        <span className={cn(
                          'px-2 py-0.5 text-xs font-medium rounded-full',
                          item.count > 0
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-500'
                        )}>
                          {item.count}
                        </span>
                      )}
                      
                      {/* Status indicator */}
                      {getStatusIcon(item)}
                    </div>
                  </div>
                  
                  {/* Subtitle */}
                  <div className="text-xs text-gray-500 mt-0.5">
                    {status === 'completed' && 'Complete'}
                    {status === 'partial' && item.count && `${item.count} item${item.count === 1 ? '' : 's'} added`}
                    {status === 'partial' && !item.count && 'In progress'}
                    {status === 'empty' && 'Not started'}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 mb-2">Quick Actions</div>
        <div className="space-y-1">
          <button
            onClick={() => {
              const nextEmpty = sidebarItems.find(item => getItemStatus(item) === 'empty')
              if (nextEmpty) onItemSelect(nextEmpty.id)
            }}
            className="w-full text-left text-xs text-blue-600 hover:text-blue-700 p-2 rounded hover:bg-blue-50 transition-colors"
          >
            → Complete next section
          </button>
          <button
            onClick={() => onItemSelect('personal')}
            className="w-full text-left text-xs text-gray-600 hover:text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors"
          >
            ↻ Review personal info
          </button>
        </div>
      </div>
    </div>
  )
}