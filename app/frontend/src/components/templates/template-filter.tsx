'use client'

import React from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FilterOption {
  id: string
  label: string
  count?: number
}

interface TemplateFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
  selectedTags: string[]
  onTagChange: (tags: string[]) => void
  categories: FilterOption[]
  tags: FilterOption[]
  showFeaturedOnly: boolean
  onFeaturedChange: (featured: boolean) => void
  className?: string
}

export const TemplateFilters: React.FC<TemplateFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryChange,
  selectedTags,
  onTagChange,
  categories,
  tags,
  showFeaturedOnly,
  onFeaturedChange,
  className
}) => {
  const clearAllFilters = () => {
    onSearchChange('')
    onCategoryChange([])
    onTagChange([])
    onFeaturedChange(false)
  }

  const hasActiveFilters = 
    searchQuery || 
    selectedCategories.length > 0 || 
    selectedTags.length > 0 || 
    showFeaturedOnly

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoryChange(selectedCategories.filter(id => id !== categoryId))
    } else {
      onCategoryChange([...selectedCategories, categoryId])
    }
  }

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagChange(selectedTags.filter(id => id !== tagId))
    } else {
      onTagChange([...selectedTags, tagId])
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Featured Toggle */}
        <Button
          variant={showFeaturedOnly ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFeaturedChange(!showFeaturedOnly)}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Featured Only</span>
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-600"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Category Filters */}
      {categories.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={cn(
                  'px-3 py-1 rounded-full text-sm border transition-colors',
                  selectedCategories.includes(category.id)
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                )}
              >
                {category.label}
                {category.count && (
                  <span className="ml-1 text-xs opacity-60">
                    ({category.count})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tag Filters */}
      {tags.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 10).map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={cn(
                  'px-2 py-1 rounded text-xs border transition-colors',
                  selectedTags.includes(tag.id)
                    ? 'bg-purple-100 border-purple-300 text-purple-800'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                )}
              >
                {tag.label}
              </button>
            ))}
            {tags.length > 10 && (
              <span className="text-xs text-gray-500 py-1 px-2">
                +{tags.length - 10} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <Filter className="h-4 w-4" />
          <span>
            {selectedCategories.length + selectedTags.length + (showFeaturedOnly ? 1 : 0)} 
            {' '}filter(s) active
          </span>
          {searchQuery && (
            <span>• Searching for {searchQuery}</span>
          )}
        </div>
      )}
    </div>
  )
}