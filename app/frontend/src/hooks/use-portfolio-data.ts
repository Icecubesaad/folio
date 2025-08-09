import { usePortfolioStore } from '@/store/portfolio-store'
import { useTemplateStore } from '@/store/template-store'
import { debouncedGeneratePortfolio, generateQuickPreview } from '@/lib/portfolio-generator'
import { useState, useEffect, useCallback, useRef } from 'react'

export const usePortfolioData = () => {
  const portfolioData = usePortfolioStore()
  const { selectedTemplate } = useTemplateStore()
  const [generatedHtml, setGeneratedHtml] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [isFromCache, setIsFromCache] = useState(false)
  const [lastGeneratedAt, setLastGeneratedAt] = useState<number>(0)
  
  // Refs to prevent stale closures
  const portfolioDataRef = useRef(portfolioData)
  const selectedTemplateRef = useRef(selectedTemplate)
  
  // Update refs when data changes
  useEffect(() => {
    portfolioDataRef.current = portfolioData
  }, [portfolioData])
  
  useEffect(() => {
    selectedTemplateRef.current = selectedTemplate
  }, [selectedTemplate])

  // Generate portfolio with improved error handling and UX
  const generatePortfolioCallback = useCallback((html: string, fromCache = false) => {
    setGeneratedHtml(html)
    setIsGenerating(false)
    setIsFromCache(fromCache)
    setLastGeneratedAt(Date.now())
    setGenerationError(null)
  }, [])

  // Check if we have minimum data required for generation
  const hasMinimumData = useCallback(() => {
    return !!(portfolioData.personalInfo?.fullName?.trim())
  }, [portfolioData.personalInfo?.fullName])

  // Generate portfolio effect
  useEffect(() => {
    if (!selectedTemplate || !hasMinimumData()) {
      // Show quick preview if we have a name
      if (portfolioData.personalInfo?.fullName?.trim()) {
        const preview = generateQuickPreview(portfolioData, selectedTemplate)
        setGeneratedHtml(preview)
        setIsFromCache(false)
      } else {
        setGeneratedHtml('')
      }
      setIsGenerating(false)
      return
    }

    // Set loading state
    setIsGenerating(true)
    setGenerationError(null)

    // Generate portfolio with debouncing
    try {
      debouncedGeneratePortfolio(
        portfolioData,
        selectedTemplate,
        generatePortfolioCallback,
        1500 // 1.5 second debounce
      )
    } catch (error) {
      console.error('Portfolio generation setup failed:', error)
      setGenerationError('Failed to start portfolio generation')
      setIsGenerating(false)
    }
  }, [portfolioData, selectedTemplate, hasMinimumData, generatePortfolioCallback])

  // Force regeneration (useful for retry buttons)
  const forceRegenerate = useCallback(() => {
    if (!selectedTemplate || !hasMinimumData()) return

    setIsGenerating(true)
    setGenerationError(null)
    setIsFromCache(false)

    // Clear any existing debounced calls and generate immediately
    debouncedGeneratePortfolio(
      portfolioDataRef.current,
      selectedTemplateRef.current,
      generatePortfolioCallback,
      0 // No debounce for forced regeneration
    )
  }, [selectedTemplate, hasMinimumData, generatePortfolioCallback])

  // Get generation status for UI feedback
  const getGenerationStatus = useCallback(() => {
    if (generationError) return 'error'
    if (isGenerating) return 'generating'
    if (generatedHtml && !isGenerating) return 'completed'
    if (!hasMinimumData()) return 'insufficient_data'
    return 'idle'
  }, [generationError, isGenerating, generatedHtml, hasMinimumData])

  // Get completion percentage for progress indicators
  const getCompletionPercentage = useCallback(() => {
    const sections = [
      { key: 'personalInfo', weight: 30, hasData: !!portfolioData.personalInfo?.fullName },
      { key: 'experience', weight: 20, hasData: !!portfolioData.experience?.length },
      { key: 'skills', weight: 15, hasData: !!portfolioData.skills?.length },
      { key: 'projects', weight: 20, hasData: !!portfolioData.projects?.length },
      { key: 'education', weight: 10, hasData: !!portfolioData.education?.length },
      { key: 'template', weight: 5, hasData: !!selectedTemplate }
    ]

    const completedWeight = sections
      .filter(section => section.hasData)
      .reduce((sum, section) => sum + section.weight, 0)

    return Math.round(completedWeight)
  }, [portfolioData, selectedTemplate])

  // Get suggestions for improving the portfolio
  const getImprovementSuggestions = useCallback(() => {
    const suggestions: string[] = []

    if (!portfolioData.personalInfo?.bio) {
      suggestions.push('Add a professional bio to make a strong first impression')
    }
    if (!portfolioData.experience?.length) {
      suggestions.push('Add your work experience to showcase your career journey')
    }
    if (!portfolioData.projects?.length) {
      suggestions.push('Include projects to demonstrate your skills and achievements')
    }
    if (!portfolioData.skills?.length) {
      suggestions.push('List your skills to highlight your expertise')
    }
    if (!portfolioData.personalInfo?.location) {
      suggestions.push('Add your location for networking opportunities')
    }
    if (!selectedTemplate) {
      suggestions.push('Select a template that matches your professional style')
    }

    return suggestions.slice(0, 3) // Return top 3 suggestions
  }, [portfolioData, selectedTemplate])

  // Analytics/tracking for generation performance
  const getGenerationStats = useCallback(() => {
    return {
      lastGenerated: lastGeneratedAt,
      timeSinceGenerated: lastGeneratedAt ? Date.now() - lastGeneratedAt : 0,
      isFromCache,
      completionPercentage: getCompletionPercentage(),
      status: getGenerationStatus()
    }
  }, [lastGeneratedAt, isFromCache, getCompletionPercentage, getGenerationStatus])

  return {
    // Core data
    portfolioData,
    selectedTemplate,
    generatedHtml,
    
    // Generation state
    isGenerating,
    generationError,
    isFromCache,
    
    // Helper functions
    hasMinimumData: hasMinimumData(),
    forceRegenerate,
    
    // Status and progress
    generationStatus: getGenerationStatus(),
    completionPercentage: getCompletionPercentage(),
    improvementSuggestions: getImprovementSuggestions(),
    
    // Analytics
    generationStats: getGenerationStats()
  }
}